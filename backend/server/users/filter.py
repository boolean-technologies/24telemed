import django_filters
from django_filters import rest_framework as filters
from .models import PatientRecord
from django.db.models import Q

class PatientFilter(filters.FilterSet):

    class Meta:
        model = PatientRecord
        fields = ['phone_number']