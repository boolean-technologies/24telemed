from rest_framework import viewsets
from .models import CallLog
from .serializers import CallLogSerializer

class CallLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CallLog.objects.all()
    serializer_class = CallLogSerializer