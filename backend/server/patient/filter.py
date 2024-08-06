from django_filters import rest_framework as filters
from .models import Patient

class PatientFilter(filters.FilterSet):
    phone_number = filters.CharFilter(lookup_expr='exact')
    patient_id = filters.CharFilter(lookup_expr='exact')
    class Meta:
        model = Patient
        fields = ['phone_number', 'patient_id']