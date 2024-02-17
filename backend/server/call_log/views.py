from rest_framework import viewsets
from .models import CallLog
from .serializers import CallLogSerializer
from utils.permission import PersonnelPermission, DoctorPermission

class CallLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CallLog.objects.all()
    serializer_class = CallLogSerializer
    permission_classes = [PersonnelPermission, DoctorPermission]