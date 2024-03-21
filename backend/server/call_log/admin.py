from django.contrib import admin
from .models import CallLog

class CallLogAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return False
        
    def has_change_permission(self, request):
        return False
    
    def has_delete_permission(self, request):
        return False

    list_display = ('health_care_assistant', 'doctor', 'call_type', 'priority', 'duration')

admin.site.register(CallLog, CallLogAdmin)