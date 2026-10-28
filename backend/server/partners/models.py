import uuid
from decimal import Decimal

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from users.models import User
from patient.models import Patient


class FeeBearer(models.TextChoices):
    # Who absorbs Paystack's processing fee on a split payment.
    ACCOUNT = 'account', '24Telemed (main account)'
    SUBACCOUNT = 'subaccount', 'Partner (subaccount)'


class Partner(models.Model):
    """A clinic/hospital whose patients book and pay through the partner portal.

    Payments for its services are split on Paystack: the partner's subaccount
    receives the fee minus `commission_percent`, which settles to 24Telemed.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    # Used in the portal URL, e.g. https://<portal>/uriel-icare
    slug = models.SlugField(max_length=80, unique=True)
    tagline = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    logo_url = models.URLField(blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=30, blank=True)

    commission_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('15.00'),
        validators=[MinValueValidator(Decimal('0')), MaxValueValidator(Decimal('100'))],
        help_text='Percentage of every consultation fee kept by 24Telemed. '
                  'Applied per transaction, so changes take effect immediately.',
    )
    paystack_fee_bearer = models.CharField(
        max_length=20, choices=FeeBearer.choices, default=FeeBearer.SUBACCOUNT
    )

    # Settlement details used to create the Paystack subaccount.
    settlement_bank_code = models.CharField(
        max_length=20, blank=True,
        help_text='Paystack bank code, e.g. 232 for Sterling Bank.',
    )
    settlement_account_number = models.CharField(max_length=20, blank=True)
    settlement_account_name = models.CharField(
        max_length=255, blank=True,
        help_text='Filled in from Paystack when the subaccount is created.',
    )
    paystack_subaccount_code = models.CharField(
        max_length=50, blank=True,
        help_text='ACCT_xxx. Created via the "Create / sync Paystack subaccount" admin action, '
                  'or paste one created on the Paystack dashboard.',
    )

    # When on, doctors assigned to this partner's services are hidden from
    # regular 24Telemed patients and can only be reached via a paid consultation.
    exclusive_doctors = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class PartnerService(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    partner = models.ForeignKey(Partner, on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    fee = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='NGN')
    doctors = models.ManyToManyField(
        User,
        blank=True,
        related_name='partner_services',
        limit_choices_to={'user_type': 'doctor'},
    )
    # Only needed when this service settles to a different account than the
    # partner's default subaccount.
    paystack_subaccount_code = models.CharField(
        max_length=50, blank=True,
        help_text='Optional override. Leave blank to use the partner subaccount.',
    )
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'name']

    def __str__(self):
        return f'{self.partner.name}: {self.name}'

    @property
    def subaccount_code(self):
        return self.paystack_subaccount_code or self.partner.paystack_subaccount_code


class PartnerMembership(models.Model):
    """Marks a patient account as belonging to a partner (signed up via its portal)."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='partner_membership')
    partner = models.ForeignKey(Partner, on_delete=models.PROTECT, related_name='members')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} @ {self.partner.name}'


class ConsultationStatus(models.TextChoices):
    PENDING_PAYMENT = 'pending_payment', 'Pending payment'
    PAID = 'paid', 'Paid'
    COMPLETED = 'completed', 'Completed'
    CANCELLED = 'cancelled', 'Cancelled'


class PartnerConsultation(models.Model):
    """One paid consultation: the patient pays the service fee up front and can
    call any of the service's doctors until a call completes."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    partner = models.ForeignKey(Partner, on_delete=models.PROTECT, related_name='consultations')
    service = models.ForeignKey(PartnerService, on_delete=models.PROTECT, related_name='consultations')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='partner_consultations')
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True, blank=True)
    reason = models.TextField(blank=True)

    # Snapshotted at checkout so later price/commission edits don't change
    # what this patient agreed to pay.
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='NGN')
    commission_percent = models.DecimalField(max_digits=5, decimal_places=2)
    commission_amount = models.DecimalField(max_digits=12, decimal_places=2)
    subaccount_code = models.CharField(max_length=50)

    reference = models.CharField(max_length=100, unique=True)
    status = models.CharField(
        max_length=20, choices=ConsultationStatus.choices, default=ConsultationStatus.PENDING_PAYMENT
    )
    paid_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    payment_data = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.service} for {self.user.username} ({self.status})'

    @property
    def partner_amount(self):
        return self.amount - self.commission_amount
