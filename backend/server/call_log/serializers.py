from rest_framework import serializers
from .models import CallLog
from users.serializers import UserSearchSerializer
from patient.serializers import PatientSearchSerializer
import os

class CallLogSerializer(serializers.ModelSerializer):
    duration_limit = serializers.SerializerMethodField()
    class Meta:
        model = CallLog
        fields = '__all__'

    def get_duration_limit(self, obj) -> int:
        return int(os.getenv('VIDEO_SDK_CALL_DURATION_LIMIT'))

class CallStatsSerializer(serializers.Serializer):
    total_call_time = serializers.IntegerField()
    total_completed = serializers.IntegerField()
    total_busy = serializers.IntegerField()
    total_failed = serializers.IntegerField()
    
class FullCallLogSerializer(CallLogSerializer):
    health_care_assistant = UserSearchSerializer()
    doctor = UserSearchSerializer()
    patient = PatientSearchSerializer()
    class Meta:
        model = CallLog
        fields = '__all__'
