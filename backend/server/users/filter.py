import django_filters
from django_filters import rest_framework as filters
from .models import PatientRecord
from django.db.models import Q

class PatientFilter(filters.FilterSet):
    query = filters.CharFilter(method='filter_by_query')

    class Meta:
        model = PatientRecord
        fields = ['query']

    def filter_by_query(self, queryset, name, value):
        return queryset.filter(
            Q(first_name__icontains=value) |
            Q(last_name__icontains=value) |
            Q(phone_number__icontains=value)
        )