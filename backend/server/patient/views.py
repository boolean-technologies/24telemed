from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Patient, PatientAccessLog
from .serializers import PatientSerializer, PatientSearchSerializer, PatientAccessLogSerializer
from drf_yasg.utils import swagger_auto_schema
from .filter import PatientFilter
from rest_framework import mixins
from utils.permission import PersonnelPermission
from rest_framework.permissions import IsAuthenticated

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
    permission_classes = [IsAuthenticated]
        
    @swagger_auto_schema(
        method='get',
        operation_description="Search patients by phone number",
        responses={200: PatientSearchSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], serializer_class=PatientSearchSerializer)
    def search(self, request):
        phone_number = request.query_params.get('phone_number')
        if not phone_number:
            return Response({"detail": "phone_number is required for searching"}, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.filter_queryset(self.get_queryset())
        serializer = PatientSearchSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        PatientAccessLog.objects.create(user=request.user, patient=instance)
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class PatientAccessLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PatientAccessLog.objects.all()
    serializer_class = PatientAccessLogSerializer
    permission_classes = [IsAuthenticated]