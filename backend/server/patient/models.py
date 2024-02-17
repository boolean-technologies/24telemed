from django.db import models
import uuid

class Gender(models.TextChoices):
    MALE = 'Male'
    FEMALE = 'Female'

class Patient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
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
    
