from django.db import models
import uuid
import random
from users.models import User

class Gender(models.TextChoices):
    MALE = 'Male'
    FEMALE = 'Female'

class Patient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient_id = models.CharField(max_length=15, unique=True, editable=False)
    phone_number = models.CharField(max_length=15, unique=True)
    photo = models.ImageField(upload_to='patient_photos/', blank=True, null=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    age = models.IntegerField()
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=Gender.choices)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, blank=True, null=True)
    email = models.EmailField(blank=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    medical_history = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    current_medications = models.TextField(blank=True)
    blood_type = models.CharField(max_length=3, blank=True)
    weight = models.FloatField(blank=True, null=True)
    height = models.FloatField(blank=True, null=True)
    chronic_conditions = models.TextField(blank=True)
    immunization_record = models.TextField(blank=True)
    family_medical_history = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='patient_profile', blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.patient_id:
            is_unique = False
            while not is_unique:
                potential_id = ''.join(random.choices('0123456789', k=11))
                is_unique = not Patient.objects.filter(patient_id=potential_id).exists()
            self.patient_id = potential_id
        super().save(*args, **kwargs)

    
class PatientAccessLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)