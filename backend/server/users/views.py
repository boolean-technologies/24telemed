from rest_framework import viewsets
from .models import User
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import PatientRecord, MedicalRecord
from .serializers import UserSerializer, PatientRecordSerializer, MedicalRecordSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PatientRecordViewSet(viewsets.ModelViewSet):
    queryset = PatientRecord.objects.all()
    serializer_class = PatientRecordSerializer
    # permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        method='get',
        operation_description="Patient search operation",
        manual_parameters=[
            openapi.Parameter(
                'first_name', openapi.IN_QUERY, description="First name",
                type=openapi.TYPE_STRING),
            openapi.Parameter(
                'last_name', openapi.IN_QUERY, description="Last name",
                type=openapi.TYPE_STRING),
            openapi.Parameter(
                'phone_number', openapi.IN_QUERY, description="Phone number",
                type=openapi.TYPE_STRING),
        ]
    )

    @action(detail=False, methods=['get'])
    def search(self, request):
        queryset = self.queryset
        first_name = request.query_params.get('first_name', None)
        last_name = request.query_params.get('last_name', None)
        phone_number = request.query_params.get('phone_number', None)

        if first_name:
            queryset = queryset.filter(first_name__icontains=first_name)
        if last_name:
            queryset = queryset.filter(last_name__icontains=last_name)
        if phone_number:
            queryset = queryset.filter(phone_number__icontains=phone_number)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class MedicalRecordViewSet(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated]