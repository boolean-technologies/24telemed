from rest_framework import serializers
from .models import CallLog

class CallLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallLog
        fields = '__all__'

class CallStatsSerializer(serializers.Serializer):
    total_call_time = serializers.IntegerField()
    total_completed = serializers.IntegerField()
    total_busy = serializers.IntegerField()
    total_failed = serializers.IntegerField()