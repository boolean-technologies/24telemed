from rest_framework import serializers
from .models import CallLog
from users.serializers import UserSearchSerializer
from patient.serializers import PatientSearchSerializer

class CallLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallLog
        fields = '__all__'

class CallStatsSerializer(serializers.Serializer):
    total_call_time = serializers.IntegerField()
    total_completed = serializers.IntegerField()
    total_busy = serializers.IntegerField()
    total_failed = serializers.IntegerField()
    
class FullCallLogSerializer(serializers.ModelSerializer):
    health_care_assistant = UserSearchSerializer()
    doctor = UserSearchSerializer()
    patient = PatientSearchSerializer()
    class Meta:
        model = CallLog
        fields = '__all__'
