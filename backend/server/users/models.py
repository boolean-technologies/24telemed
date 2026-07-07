from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
import random
from file.models import File

class UserType(models.TextChoices):
    PERSONNEL = 'personnel'
    DOCTOR = 'doctor'
    CUSTOMER = 'customer'


class ProviderRole(models.TextChoices):
    """For provider (doctor-type) accounts: a doctor or a nurse."""
    DOCTOR = 'doctor'
    NURSE = 'nurse'


class InsuranceCoverage(models.TextChoices):
    HEALTHSPRING = 'health_spring'
    INNOSON_VEHICLE_MANUFACTURING = 'innoson_vehicle_manufacturing'
    CHELSEA_GROUP = 'chelsea_group'
    NEWPORT = 'newport'
    ANGELES_HOTEL = 'angeles_hotel'
    TELEMED_24 = '24Telemed'
    SIMS_NIGERIA = 'Sims_Nigeria'


    
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=15, unique=True, editable=False, null=True, blank=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    user_type = models.CharField(max_length=20, choices=UserType.choices, default=UserType.PERSONNEL)
    insurance_coverage = models.CharField(max_length=50, choices=InsuranceCoverage.choices, blank=True, null=True)
    photo = models.ForeignKey(File, blank=True, null=True, on_delete=models.SET_NULL)
    specialty = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    # Doctors self-sign-up unverified and must be approved by an admin before
    # they appear to patients / can take calls. Non-doctors are verified.
    is_verified = models.BooleanField(default=True)
    # Distinguishes a doctor vs a nurse among provider (doctor-type) accounts.
    # Used to list nurses for "Virtual Nursing Home Visit" consults.
    provider_role = models.CharField(
        max_length=20, choices=ProviderRole.choices, default=ProviderRole.DOCTOR
    )

    def save(self, *args, **kwargs):
        if not self.user_id:
            is_unique = False
            while not is_unique:
                potential_id = ''.join(random.choices('0123456789', k=8))
                is_unique = not User.objects.filter(user_id=potential_id).exists()
            self.user_id = potential_id
        super().save(*args, **kwargs)


class PushDevice(models.Model):
    """An Expo push token registered by an authenticated mobile user."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='push_devices'
    )
    token = models.CharField(max_length=255, unique=True)
    platform = models.CharField(max_length=20, blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.username} ({self.platform or "unknown"})'


class PasswordResetRequest(models.Model):
    """Short-lived, single-use state for the mobile forgot-password flow."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='password_reset_requests'
    )
    otp_hash = models.CharField(max_length=128)
    reset_token_hash = models.CharField(max_length=128, blank=True)
    expires_at = models.DateTimeField()
    verified_at = models.DateTimeField(null=True, blank=True)
    used_at = models.DateTimeField(null=True, blank=True)
    attempts = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
