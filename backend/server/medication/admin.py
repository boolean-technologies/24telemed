from django.contrib import admin
from .models import Drug, MedicalEncounter, PrescribedDrug

class DrugAdmin(admin.ModelAdmin):
    list_display = ('name', 'manufacturer', 'strength')

class MedicalEncounterAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request):
        return False

    def has_delete_permission(self, request):
        return False
    list_display = ('doctor', 'patient', 'reason_for_visit')

class PrescribedDrugAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request):
        return False

    def has_delete_permission(self, request):
        return False
    list_display = ('drug', 'dosage', 'frequency')

admin.site.register(Drug, DrugAdmin)
admin.site.register(MedicalEncounter, MedicalEncounterAdmin)
admin.site.register(PrescribedDrug, PrescribedDrugAdmin)
