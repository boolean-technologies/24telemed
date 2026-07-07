import os
import json
import uuid

import requests
from django.db import models

from users.models import User
from patient.models import Patient
from call_log.models import CallLog, CallStatus, ConsultationType


class BookingStatus(models.TextChoices):
    PENDING = 'Pending'       # personnel requested, awaiting doctor
    CONFIRMED = 'Confirmed'   # doctor accepted the slot
    DECLINED = 'Declined'     # doctor declined
    CANCELLED = 'Cancelled'   # personnel cancelled
    COMPLETED = 'Completed'   # the scheduled call took place


class BookingPriority(models.IntegerChoices):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4


class Booking(models.Model):
    """
    A scheduled consultation between a health-care assistant (personnel) and a
    doctor for a given patient. When the time comes, `start()` materialises a
    CallLog + VideoSDK room so both sides join the existing meeting flow.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    health_care_assistant = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='bookings_created'
    )
    doctor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='bookings_received'
    )
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True)
    scheduled_time = models.DateTimeField()
    duration_minutes = models.IntegerField(default=30)
    reason = models.TextField(null=True, blank=True)
    priority = models.IntegerField(
        choices=BookingPriority.choices, default=BookingPriority.MEDIUM
    )
    consultation_type = models.CharField(
        max_length=20, choices=ConsultationType.choices,
        default=ConsultationType.E_CONSULTATION
    )
    status = models.CharField(
        max_length=20, choices=BookingStatus.choices, default=BookingStatus.PENDING
    )
    decline_note = models.TextField(null=True, blank=True)
    call_log = models.ForeignKey(
        CallLog, on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reminder_sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['scheduled_time']

    def confirm(self):
        self.status = BookingStatus.CONFIRMED
        self.save()

    def decline(self, note=None):
        self.status = BookingStatus.DECLINED
        self.decline_note = note
        self.save()

    def cancel(self):
        self.status = BookingStatus.CANCELLED
        self.save()

    def _create_videosdk_room(self, call_log_id):
        """Synchronous VideoSDK room creation, mirroring call_log_manager."""
        url = "https://api.videosdk.live/v2/rooms"
        token = os.getenv('VIDEO_SDK_TOKEN')
        headers = {"Authorization": token, "Content-Type": "application/json"}
        data = {
            "customRoomId": str(call_log_id),
            "webhook": {
                "endPoint": os.getenv('VIDEO_SDK_CALL_WEBHOOK'),
                "events": ["session-started", "session-ended"],
            },
            "autoCloseConfig": {
                "type": "session-end-and-deactivate",
                "duration": int(os.getenv('VIDEO_SDK_CALL_DURATION_LIMIT', '15')),
            },
        }
        response = requests.post(url, json=data, headers=headers)
        return json.loads(response.text).get("roomId")

    def start(self):
        """
        Create (once) the CallLog + VideoSDK room for this booking and return it.
        Idempotent: returns the existing call_log if already started.
        """
        if self.call_log:
            if not self.call_log.medical_encounter:
                self.call_log.setUpEncounter()
            return self.call_log

        call_log = CallLog.objects.create(
            health_care_assistant=self.health_care_assistant,
            doctor=self.doctor,
            patient=self.patient,
            notes=self.reason,
            priority=self.priority,
            consultation_type=self.consultation_type,
            status=CallStatus.INITIATED,
        )
        call_log.setUpEncounter()
        room_id = self._create_videosdk_room(call_log.id)
        call_log.setMeetingId(room_id)

        self.call_log = call_log
        self.status = BookingStatus.CONFIRMED
        self.save()
        return call_log
