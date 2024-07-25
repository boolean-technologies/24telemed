import uuid
from django.utils.dateparse import parse_datetime
from django.db import models
from users.models import User
from patient.models import Patient

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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    decline_note = models.TextField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.end_time:
            self.duration = (self.end_time - self.start_time).seconds // 60
        super().save(*args, **kwargs)

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
        if isinstance(startTime, str):
            startTime = parse_datetime(startTime)
        if isinstance(endTime, str):
            endTime = parse_datetime(endTime)

        if startTime is not None and endTime is not None:
            self.start_time = startTime
            self.end_time = endTime
            self.status = "Completed"
            self.save()