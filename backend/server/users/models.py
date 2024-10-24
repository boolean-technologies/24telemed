from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
import random
from file.models import File

class UserType(models.TextChoices):
    PERSONNEL = 'personnel'
    DOCTOR = 'doctor'
    CUSTOMER = 'customer'


class InsuranceCoverage(models.TextChoices):
    HEALTHSPRING = 'health_spring'
    
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=15, unique=True, editable=False, null=True, blank=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    user_type = models.CharField(max_length=20, choices=UserType.choices, default=UserType.PERSONNEL)
    insurance_coverage = models.CharField(max_length=20, choices=InsuranceCoverage.choices, blank=True, null=True)
    photo = models.ForeignKey(File, blank=True, null=True, on_delete=models.SET_NULL)
    specialty = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.user_id:
            is_unique = False
            while not is_unique:
                potential_id = ''.join(random.choices('0123456789', k=8))
                is_unique = not User.objects.filter(user_id=potential_id).exists()
            self.user_id = potential_id
        super().save(*args, **kwargs)
