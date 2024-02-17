from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Drug, PrescribedDrug, MedicalEncounter
from .serializers import DrugSerializer, PrescribedDrugSerializer, MedicalEncounterSerializer
from drf_yasg.utils import swagger_auto_schema
from rest_framework import mixins
from utils.permission import DoctorPermission, PersonnelPermission

class DrugViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Drug.objects.all()
    serializer_class = DrugSerializer
    filter_backends = [DjangoFilterBackend]
    permission_classes = [DoctorPermission, PersonnelPermission]

class DoctorMedicalEncounterViewSet(viewsets.ModelViewSet):
    queryset = MedicalEncounter.objects.all()
    serializer_class = MedicalEncounterSerializer
    filter_backends = [DjangoFilterBackend]
    permission_classes = [DoctorPermission]

class DoctorPrescribedDrugViewSet(viewsets.ModelViewSet):
    queryset = PrescribedDrug.objects.all()
    serializer_class = PrescribedDrugSerializer
    filter_backends = [DjangoFilterBackend]
    permission_classes = [DoctorPermission]

class PersonnelMedicalEncounterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MedicalEncounter.objects.all()
    serializer_class = MedicalEncounterSerializer
    filter_backends = [DjangoFilterBackend]
    permission_classes = [PersonnelPermission]