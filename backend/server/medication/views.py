from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Drug, PrescribedDrug, MedicalEncounter
from call_log.models import CallLog
from .serializers import (
    DrugSerializer,
    PrescribeDrugSerializer,
    PrescribedDrugSerializer,
    MedicalEncounterSerializer,
)
from utils.permission import DoctorPermission, PersonnelPermission
from utils.push_notifications import send_push_to_user
from rest_framework.filters import OrderingFilter

class DrugViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Drug.objects.all()
    serializer_class = DrugSerializer
    filter_backends = [DjangoFilterBackend]
    permission_classes = [IsAuthenticated]

class DoctorMedicalEncounterViewSet(viewsets.ModelViewSet):
    queryset = MedicalEncounter.objects.all().order_by('-created_at')
    serializer_class = MedicalEncounterSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['patient']
    permission_classes = [DoctorPermission]

    def get_queryset(self):
        return (
            MedicalEncounter.objects.filter(doctor=self.request.user)
            .select_related('doctor', 'patient', 'patient__user')
            .prefetch_related('prescribed_drugs__drug')
            .order_by('-created_at')
        )

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)

    def perform_update(self, serializer):
        # Notes may change, but an existing clinical record must never be moved
        # to another doctor or patient by including foreign keys in a PATCH.
        serializer.save(
            doctor=self.request.user,
            patient=serializer.instance.patient,
        )

    @action(detail=True, methods=['post'])
    def prescribe(self, request, pk=None):
        encounter = self.get_object()
        serializer = PrescribeDrugSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        drug = Drug.objects.filter(name__iexact=data['drug_name']).first()
        if not drug:
            drug = Drug.objects.create(name=data['drug_name'])
        prescribed = PrescribedDrug.objects.create(
            medical_encounter=encounter,
            drug=drug,
            dosage=data['dosage'],
            frequency=data['frequency'],
            duration=data.get('duration', ''),
            instructions=data.get('instructions', ''),
        )
        if encounter.patient.user:
            call_log_id = (
                CallLog.objects.filter(medical_encounter=encounter)
                .values_list('id', flat=True)
                .first()
            )
            send_push_to_user(
                encounter.patient.user,
                title='New prescription',
                body=f'Dr. {request.user.first_name or request.user.username} prescribed {drug.name}.',
                data={
                    'type': 'prescription',
                    'encounter_id': str(encounter.id),
                    'route': (
                        f'/(patient)/consultation/{call_log_id}'
                        if call_log_id
                        else '/(patient)/(tabs)'
                    ),
                },
                channel_id='appointments',
            )
        return Response(
            PrescribedDrugSerializer(prescribed).data,
            status=status.HTTP_201_CREATED,
        )

class DoctorPrescribedDrugViewSet(viewsets.ModelViewSet):
    queryset = PrescribedDrug.objects.all()
    serializer_class = PrescribedDrugSerializer
    filter_backends = [DjangoFilterBackend]
    permission_classes = [DoctorPermission]

    def get_queryset(self):
        return PrescribedDrug.objects.filter(
            medical_encounter__doctor=self.request.user
        ).select_related('drug', 'medical_encounter')

    def perform_create(self, serializer):
        encounter = serializer.validated_data['medical_encounter']
        if encounter.doctor_id != self.request.user.id:
            raise PermissionDenied(
                'You can only prescribe for your own consultations.'
            )
        serializer.save()

class PersonnelMedicalEncounterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MedicalEncounter.objects.all().order_by('-created_at')
    serializer_class = MedicalEncounterSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['patient']
    permission_classes = [PersonnelPermission]

    def get_queryset(self):
        queryset = (
            MedicalEncounter.objects.select_related('doctor', 'patient')
            .prefetch_related('prescribed_drugs__drug')
            .order_by('-created_at')
        )
        if self.request.user.user_type == 'customer':
            return queryset.filter(patient__user=self.request.user)
        return queryset
