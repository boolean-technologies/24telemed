from rest_framework import viewsets
from .models import CallLog, CallStatus, CallType
from .serializers import CallLogSerializer, CallStatsSerializer
from utils.permission import PersonnelPermission, DoctorPermission
from django.db.models import Sum
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django_filters.rest_framework import DjangoFilterBackend
from .models import CallLog
from .serializers import CallLogSerializer, FullCallLogSerializer
from utils.permission import PersonnelPermission, DoctorPermission
from .filters import CallLogFilter

class CallLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CallLog.objects.all()
    serializer_class = CallLogSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CallLogFilter
    permission_classes = [PersonnelPermission, DoctorPermission]

    @action(detail=False, methods=['get'], serializer_class=CallStatsSerializer)
    def call_stats(self, request):
        status = request.query_params.get('status', None)
        call_type = request.query_params.get('call_type', None)
        order = request.query_params.get('order', None)
        notes__icontains = request.query_params.get('notes__icontains', None)

        filtered_calls = CallLog.objects.all()
        if status:
            filtered_calls = filtered_calls.filter(status=status)
        if call_type:
            filtered_calls = filtered_calls.filter(call_type=call_type)
        if notes__icontains:
            filtered_calls = filtered_calls.filter(notes__icontains=notes__icontains)
        if order:
            if order == 'start_time':
                filtered_calls = filtered_calls.order_by('start_time')
            elif order == 'created_at':
                filtered_calls = filtered_calls.order_by('created_at')
            elif order == 'priority':
                filtered_calls = filtered_calls.order_by('priority')

        total_call_time = filtered_calls.aggregate(total_call_time=Sum('duration'))['total_call_time']
        total_completed = filtered_calls.filter(status=CallStatus.COMPLETED).count()
        total_busy = filtered_calls.filter(status=CallStatus.BUSY).count()
        total_failed = filtered_calls.filter(status=CallStatus.FAILED).count()

        return Response({
            'total_call_time': total_call_time,
            'total_completed': total_completed,
            'total_busy': total_busy,
            'total_failed': total_failed
        })

class DoctorCallLogViewSet(CallLogViewSet):
    serializer_class = FullCallLogSerializer
    # permission_classes = [PersonnelPermission, DoctorPermission]
