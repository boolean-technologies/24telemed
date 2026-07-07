from rest_framework import serializers

from patient.serializers import PatientSearchSerializer
from users.serializers import UserSearchSerializer
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    """Read serializer with nested participant/patient details for the apps."""

    doctor_detail = UserSearchSerializer(source='doctor', read_only=True)
    health_care_assistant_detail = UserSearchSerializer(
        source='health_care_assistant', read_only=True
    )
    patient_detail = PatientSearchSerializer(source='patient', read_only=True)
    call_log_id = serializers.PrimaryKeyRelatedField(
        source='call_log', read_only=True
    )

    class Meta:
        model = Booking
        fields = [
            'id',
            'doctor',
            'doctor_detail',
            'health_care_assistant',
            'health_care_assistant_detail',
            'patient',
            'patient_detail',
            'scheduled_time',
            'duration_minutes',
            'reason',
            'priority',
            'consultation_type',
            'status',
            'decline_note',
            'call_log_id',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'health_care_assistant',
            'status',
            'decline_note',
            'call_log_id',
            'created_at',
            'updated_at',
        ]


class BookingCreateSerializer(serializers.ModelSerializer):
    """Personnel-facing create serializer."""

    class Meta:
        model = Booking
        fields = [
            'doctor',
            'patient',
            'scheduled_time',
            'duration_minutes',
            'reason',
            'priority',
            'consultation_type',
        ]


class DeclineSerializer(serializers.Serializer):
    note = serializers.CharField(required=False, allow_blank=True)
