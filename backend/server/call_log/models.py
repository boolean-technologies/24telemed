import uuid
from django.utils.dateparse import parse_datetime
from django.db import models
from users.models import User
from patient.models import Patient
import math
from wallet.models import Wallet, Transaction
from medication.models import MedicalEncounter

class CallStatus(models.TextChoices):
    INITIATED = 'Initiated'
    IN_PROGRESS = 'In Progress'
    COMPLETED = 'Completed'
    DECLINED = 'Declined'
    FAILED = 'Failed'
    BUSY = 'Busy'

class CallType(models.TextChoices):
    VIDEO = 'Video'
    AUDIO = 'Audio'

class CallPriority(models.TextChoices):
    CRITICAL = 4
    HIGH = 3
    MEDIUM = 2
    LOW = 1


class ConsultationType(models.TextChoices):
    E_CONSULTATION = 'e_consultation', 'E-consultation'
    SECOND_OPINION = 'second_opinion', 'Second Medical Opinion'
    NURSING_VISIT = 'nursing_visit', 'Virtual Nursing Home Visit'


class CallLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    health_care_assistant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='health_care_assistant')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor')
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=CallStatus.choices, default=CallStatus.INITIATED)
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True)
    call_type = models.CharField(max_length=10, choices=CallType.choices, default=CallType.VIDEO)
    meeting_id = models.CharField(max_length=100, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    duration = models.IntegerField(null=True, blank=True)
    call_data = models.JSONField(null=True, blank=True)
    priority = models.IntegerField(choices=CallPriority.choices, default=CallPriority.MEDIUM)
    consultation_type = models.CharField(
        max_length=20, choices=ConsultationType.choices,
        default=ConsultationType.E_CONSULTATION
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    decline_note = models.TextField(null=True, blank=True)
    medical_encounter = models.ForeignKey(MedicalEncounter, on_delete=models.SET_NULL, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.end_time:
            duration = (self.end_time - self.start_time).total_seconds()
            self.duration = int(math.ceil(duration / 60))
        super().save(*args, **kwargs)

    def setUpEncounter(self):
        if self.medical_encounter:
            return
        medical_encounter = MedicalEncounter.objects.create(
            doctor=self.doctor,
            patient=self.patient,
            reason_for_visit=self.notes,
        )
        self.medical_encounter = medical_encounter
        self.save()

    def setToBusy(self):
        self.status = CallStatus.BUSY
        self.save()

    def setToFailed(self):
        self.status = CallStatus.FAILED
        self.save()

    def setToInProgress(self):
        self.status = CallStatus.IN_PROGRESS
        self.save()

    def setToCompleted(self):
        self.status = CallStatus.COMPLETED
        self.save()
        self._complete_booking()

    def setToDeclined(self, note = None):
        self.status = CallStatus.DECLINED
        self.decline_note = note
        self.save()

    def setMeetingId(self, meetingId):
        self.meeting_id = meetingId
        self.save()
        
    def sessionStarted(self, startTime):
        if isinstance(startTime, str):
            startTime = parse_datetime(startTime)
        if startTime is not None:
            self.start_time = startTime
            self.status = "In Progress"
            self.save()
    
    def sessionEnded(self, startTime, endTime):
        # Webhook delivery isn't exactly-once — VideoSDK can (and does) retry
        # or redeliver a session-ended event. Without this guard, every
        # redelivery would bill the wallet again for the same call.
        #
        # Deliberately checks end_time, not status: the app's own in-call
        # "hang up" sends a websocket message (handleEndCall -> setToCompleted)
        # that also sets status to Completed, but never bills and never
        # touches end_time — that path racing ahead of this webhook must not
        # cause the real, billable session-ended event to be skipped.
        if self.end_time is not None:
            return

        if isinstance(startTime, str):
            startTime = parse_datetime(startTime)
        if isinstance(endTime, str):
            endTime = parse_datetime(endTime)

        if startTime is not None and endTime is not None:
            self.start_time = startTime
            self.end_time = endTime
            self.status = "Completed"
            self.save()
            self._complete_booking()

            if self.health_care_assistant and self.health_care_assistant.user_type == 'customer':
                wallet = Wallet.objects.get(user=self.health_care_assistant)
                Transaction.objects.create(
                    wallet=wallet,
                    transaction_type='withdrawal',
                    amount=wallet.get_call_unit_cost(),
                    description=f'Call session with Dr. {self.doctor.first_name} ({self.doctor.user_id})',
                    status='successful',
                )

    def _complete_booking(self):
        # Local import avoids a circular model import.
        from booking.models import Booking, BookingStatus

        Booking.objects.filter(call_log=self).exclude(
            status=BookingStatus.CANCELLED
        ).update(status=BookingStatus.COMPLETED)
