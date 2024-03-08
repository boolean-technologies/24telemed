from rest_framework import serializers
from .models import CallLog
from users.serializers import UserSearchSerializer
class CallLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallLog
        fields = '__all__'

class FullCallLogSerializer(serializers.ModelSerializer):
    health_care_assistant = UserSearchSerializer()
    doctor = UserSearchSerializer()
    class Meta:
        model = CallLog
        fields = '__all__'