from django_filters import rest_framework as filters
from .models import Patient

class PatientFilter(filters.FilterSet):

    class Meta:
        model = Patient
        fields = ['phone_number']