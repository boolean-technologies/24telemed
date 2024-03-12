from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Patient
from .serializers import PatientSerializer, PatientSearchSerializer
from drf_yasg.utils import swagger_auto_schema
from .filter import PatientFilter
from rest_framework import mixins
from utils.permission import PersonnelPermission

class PatientViewSet(
            mixins.CreateModelMixin,
            mixins.RetrieveModelMixin,
            mixins.UpdateModelMixin,
            viewsets.GenericViewSet,
    ):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filterset_class = PatientFilter
    filter_backends = [DjangoFilterBackend]
    permission_classes = [PersonnelPermission]
        
    @swagger_auto_schema(
        method='get',
        operation_description="Search patients by phone number",
    )
    @action(detail=False, methods=['get'], serializer_class=PatientSearchSerializer)
    def search(self, _):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = PatientSearchSerializer(queryset, many=True)
        return Response(serializer.data)