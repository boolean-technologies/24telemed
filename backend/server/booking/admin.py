from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'health_care_assistant',
        'doctor',
        'patient',
        'scheduled_time',
        'status',
        'priority',
    )
    list_filter = ('status', 'priority', 'scheduled_time')
    search_fields = ('doctor__username', 'health_care_assistant__username')
    raw_id_fields = ('health_care_assistant', 'doctor', 'patient', 'call_log')
