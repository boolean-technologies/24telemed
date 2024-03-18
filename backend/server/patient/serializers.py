from rest_framework import serializers
from .models import Patient, PatientAccessLog

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class PatientSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'patient_id', 'phone_number', 'photo', 'first_name', 'last_name', 'gender', 'address']

class PatientAccessLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientAccessLog
        fields = '__all__'