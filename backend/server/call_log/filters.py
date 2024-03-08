import django_filters
from .models import CallLog

class CallLogFilter(django_filters.FilterSet):
    class Meta:
        model = CallLog
        fields = {
            'status': ['exact'],
            'call_type': ['exact'],
            'notes': ['icontains'],
        }

    order = django_filters.OrderingFilter(
        fields=(
            ('start_time', 'start_time'),
            ('created_at', 'created_at'),
            ('priority', 'priority'),
        ),
    )
