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
from .serializers import CallLogSerializer, FullCallLogSerializer
from utils.permission import PersonnelPermission, DoctorPermission
from .filters import CallLogFilter


class CallLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CallLog.objects.all()
    serializer_class = CallLogSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CallLogFilter
    permission_classes = [DoctorPermission, PersonnelPermission]

class DoctorCallLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CallLog.objects.all()
    serializer_class = FullCallLogSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CallLogFilter
    permission_classes = [DoctorPermission]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return CallLog.objects.filter(doctor=user)
        else:
            return CallLog.objects.none()
    
    @swagger_auto_schema(
        method='get',
        operation_description="Retrieve the call-log statistics",
        responses={200: CallStatsSerializer}
    )
    @action(detail=False, methods=['get'], serializer_class=CallStatsSerializer)
    def call_stats(self, request):
        filtered_calls = self.filter_queryset(self.get_queryset())

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

class PersonnelCallLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FullCallLogSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CallLogFilter
    permission_classes = [PersonnelPermission]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return CallLog.objects.filter(health_care_assistant=user)
        else:
            return CallLog.objects.none()