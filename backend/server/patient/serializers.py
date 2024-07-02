from rest_framework import serializers
from .models import Patient, PatientAccessLog

class PatientSerializer(serializers.ModelSerializer):
    last_seen = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = '__all__'

    def get_last_seen(self, obj):
        last_log = PatientAccessLog.objects.filter(patient=obj).order_by('-created_at').first()
        return last_log.created_at if last_log else None

class PatientSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'patient_id', 'phone_number', 'photo', 'first_name', 'last_name', 'gender', 'address']

class PatientAccessLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientAccessLog
        fields = '__all__'