from django.conf import settings
from django.db import models
import uuid
from users.models import User

class Wallet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    balance = models.FloatField(default=0, null=True)
    currency = models.CharField(max_length=10, default='NGN')
    status = models.CharField(max_length=20, choices=[('active', 'Active'), ('inactive', 'Inactive')], default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Wallet - {self.currency} {self.balance}"

    def deposit(self, amount):
        """Adds a deposit to the wallet balance."""
        if amount <= 0:
            raise ValueError("Deposit amount must be positive.")
        self.balance += amount
        self.save()

    def withdraw(self, amount):
        """Withdraws an amount from the wallet balance."""
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive.")
        if self.balance < amount:
            raise ValueError("Insufficient balance.")
        self.balance -= amount
        self.save()

    def set_inactive(self):
        """Sets the wallet status to inactive."""
        self.status = 'inactive'
        self.save()

    def set_active(self):
        """Sets the wallet status to active."""
        self.status = 'active'
        self.save()

    def is_active(self):
        """Checks if the wallet is active."""
        return self.status == 'active'
    
    def get_call_unit_cost(self):
        default_price = getattr(settings, 'CALL_SESSION_UNIT_PRICE', 0)

        user: User = self.user
        discounted_states = ["enugu", "kaduna", "plateau", "ghana"]

        username_first_word = None
        if user.username:
            username_first_word = user.username.split("_")[0].strip().lower()

        user_location = None
        if user.location:
            user_location = user.location.strip().lower()

        if user.user_type == 'customer' and (
            (username_first_word in discounted_states) or 
            (user_location in discounted_states)
        ):
            return 500

        return default_price

    def get_call_session(self):
        unit_cost = self.get_call_unit_cost()
        
        if unit_cost <= 0:
            return 0
        
        return self.balance // unit_cost