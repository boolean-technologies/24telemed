from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from .models import Drug, PrescribedDrug, MedicalEncounter
from .serializers import DrugSerializer, PrescribedDrugSerializer, MedicalEncounterSerializer
from utils.permission import DoctorPermission, PersonnelPermission
from rest_framework.filters import OrderingFilter

class DrugViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Drug.objects.all()
    serializer_class = DrugSerializer
    filter_backends = [DjangoFilterBackend]
    permission_classes = [DoctorPermission, PersonnelPermission]

class DoctorMedicalEncounterViewSet(viewsets.ModelViewSet):
    queryset = MedicalEncounter.objects.all().order_by('-created_at')
    serializer_class = MedicalEncounterSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['patient']
    permission_classes = [DoctorPermission]

class DoctorPrescribedDrugViewSet(viewsets.ModelViewSet):
    queryset = PrescribedDrug.objects.all()
    serializer_class = PrescribedDrugSerializer
    filter_backends = [DjangoFilterBackend]
    permission_classes = [DoctorPermission]

class PersonnelMedicalEncounterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MedicalEncounter.objects.all().order_by('-created_at')
    serializer_class = MedicalEncounterSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['patient']
    permission_classes = [PersonnelPermission]