from django.contrib import admin
from .models import Patient

class PatientAdmin(admin.ModelAdmin):
    list_display = ('get_patient_name', 'phone_number', 'age', 'gender')

    def get_patient_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'
    get_patient_name.short_description = "Patient Name"

admin.site.register(Patient, PatientAdmin)