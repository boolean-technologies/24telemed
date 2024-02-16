from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from .models import User
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import PatientRecord
from .serializers import UserSerializer, PatientRecordSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from .filter import *

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PatientRecordViewSet(viewsets.ModelViewSet):
    queryset = PatientRecord.objects.all()
    serializer_class = PatientRecordSerializer
    filterset_class = PatientFilter
    filter_backends = [DjangoFilterBackend]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        method='get',
        operation_description="Search patient by first name, last name, or phone number",
    )
    @action(detail=False, methods=['get'])
    def search(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)