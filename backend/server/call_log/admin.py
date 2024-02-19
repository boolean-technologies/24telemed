from django.contrib import admin
from .models import CallLog

class CallLogAdmin(admin.ModelAdmin):
    list_display = ('health_care_assistant', 'doctor', 'call_type', 'priority', 'duration')

admin.site.register(CallLog, CallLogAdmin)