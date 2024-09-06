from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
import random


class UserType(models.TextChoices):
    PERSONNEL = 'personnel'
    DOCTOR = 'doctor'
    CUSTOMER = 'customer'
    
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=15, unique=True, editable=False, null=True, blank=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    user_type = models.CharField(max_length=20, choices=UserType.choices, default=UserType.PERSONNEL)
    photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    specialty = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    bvn = models.CharField(max_length=11, unique=True, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.user_id:
            is_unique = False
            while not is_unique:
                potential_id = ''.join(random.choices('0123456789', k=8))
                is_unique = not User.objects.filter(user_id=potential_id).exists()
            self.user_id = potential_id
        super().save(*args, **kwargs)


class Wallet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    account_number = models.CharField(max_length=10)
    bank_name = models.CharField(max_length=100)
    flw_ref = models.CharField(max_length=100, unique=True)
    order_ref = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    note = models.TextField(null=True, blank=True)
    amount = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Wallet"
