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

        call_stats = CallLog.get_call_stats(status=status, call_type=call_type, notes__icontains=notes__icontains, order=order)

        serializer = CallStatsSerializer(call_stats)
        return Response(serializer.data)

class DoctorCallLogViewSet(CallLogViewSet):
    serializer_class = FullCallLogSerializer
    # permission_classes = [PersonnelPermission, DoctorPermission]
