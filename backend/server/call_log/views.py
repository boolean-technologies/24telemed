from rest_framework import viewsets
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
    # permission_classes = [PersonnelPermission, DoctorPermission]

class DoctorCallLogViewSet(CallLogViewSet):
    serializer_class = FullCallLogSerializer
    # permission_classes = [PersonnelPermission, DoctorPermission]