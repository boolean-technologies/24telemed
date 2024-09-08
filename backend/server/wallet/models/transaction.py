from django.db import models
from django.utils import timezone
import uuid
from .wallet import Wallet

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('transfer', 'Transfer'),
    ]

    PAYMENT_SOURCES = [
        ('flutterwave', 'Flutterwave'),
        ('paystack', 'Paystack'),
    ]

    PAYMENT_METHODS = [
        ('card', 'Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('ussd', 'USSD'),
        ('mobile_money', 'Mobile Money'),
        ('bank', 'Bank'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    payment_source = models.CharField(max_length=20, choices=PAYMENT_SOURCES, blank=True, null=True)  # Flutterwave, Paystack
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, blank=True, null=True)  # Card, Bank Transfer, USSD, etc.
    payment_reference = models.CharField(max_length=100, null=True, blank=True)  # Reference ID from payment gateway
    amount = models.FloatField(default=0, null=True)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    # Transaction metadata for payment gateway details
    flw_ref = models.CharField(max_length=100, blank=True, null=True)  # Flutterwave reference ID
    order_ref = models.CharField(max_length=100, blank=True, null=True)  # Payment order reference (general)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('successful', 'Successful'), ('failed', 'Failed')], default='pending')

    def __str__(self):
        return f"{self.transaction_type.capitalize()} of {self.amount} via {self.payment_source} on {self.created_at}"

    class Meta:
        ordering = ['-created_at']
