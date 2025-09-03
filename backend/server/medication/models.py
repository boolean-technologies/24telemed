from django.db import models
import uuid
from users.models import User
from patient.models import Patient


class Drug(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    manufacturer = models.CharField(max_length=100, blank=True, null=True)
    active_ingredient = models.CharField(max_length=100, blank=True, null=True)
    dosage_form = models.CharField(max_length=100, blank=True, null=True)
    strength = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class MedicalEncounter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_medical_encounters')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='patient_medical_encounters')
    reason_for_visit = models.CharField(max_length=1024, blank=True, null=True)
    assessment_and_diagnosis = models.TextField(blank=True, null=True)
    treatment_and_interventions = models.TextField(blank=True, null=True)
    follow_up_plans = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Prescription for {self.patient.first_name} by {self.doctor.first_name} on {self.created_at}"

class PrescribedDrug(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    medical_encounter = models.ForeignKey(MedicalEncounter, on_delete=models.CASCADE, related_name='prescribed_drugs')
    drug = models.ForeignKey(Drug, on_delete=models.CASCADE)
    dosage = models.CharField(max_length=250)
    frequency = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.drug.name} - {self.dosage}, {self.frequency}"