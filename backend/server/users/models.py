from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class UserType(models.TextChoices):
    PERSONNEL = 'personnel'
    DOCTOR = 'doctor'
    
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    user_type = models.CharField(max_length=20, choices=UserType.choices, default=UserType.PERSONNEL)
    photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    specialty = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)