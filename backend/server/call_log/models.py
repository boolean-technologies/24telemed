import uuid
from django.db import models
from django.utils import timezone
from enum import Enum
from users.models import User
from patient.models import Patient
from django.db.models import Sum

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
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    call_type = models.CharField(max_length=10, choices=CallType.choices, default=CallType.VIDEO)
    notes = models.TextField(null=True, blank=True)
    duration = models.IntegerField(null=True, blank=True)
    call_data = models.JSONField(null=True, blank=True)
    priority = models.IntegerField(choices=CallPriority.choices, default=CallPriority.MEDIUM)

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
        self.status = CallStatus.IN_PROGRESS
        self.save()

    def setToDeclined(self):
        self.status = CallStatus.DECLINED
        self.save()

    @classmethod
    def get_call_stats(cls, status=None, call_type=None, notes__icontains=None, order=None):
        filtered_calls = cls.objects.all()
        if status:
            filtered_calls = filtered_calls.filter(status=status)
        if call_type:
            filtered_calls = filtered_calls.filter(call_type=call_type)
        if notes__icontains:
            filtered_calls = filtered_calls.filter(notes__icontains=notes__icontains)
        if order:
            if order == 'start_time':
                filtered_calls = filtered_calls.order_by('start_time')
            elif order == 'created_at':
                filtered_calls = filtered_calls.order_by('created_at')
            elif order == 'priority':
                filtered_calls = filtered_calls.order_by('priority')

        total_call_time = filtered_calls.aggregate(total_call_time=Sum('duration'))['total_call_time']
        total_completed = filtered_calls.filter(status=CallStatus.COMPLETED).count()
        total_busy = filtered_calls.filter(status=CallStatus.BUSY).count()
        total_failed = filtered_calls.filter(status=CallStatus.FAILED).count()

        return {
            'total_call_time': total_call_time,
            'total_completed': total_completed,
            'total_busy': total_busy,
            'total_failed': total_failed
        }