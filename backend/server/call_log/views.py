from rest_framework import viewsets
from .models import CallLog, CallStatus
from .serializers import CallLogSerializer, CallStatsSerializer
from utils.permission import PersonnelPermission, DoctorPermission
from django.db.models import Sum
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import CallLogSerializer, FullCallLogSerializer
from utils.permission import PersonnelPermission, DoctorPermission
from .filters import CallLogFilter

from rest_framework.views import APIView
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import base64
import rsa
import json
import os
import logging

logger = logging.getLogger(__name__)

class CallLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CallLog.objects.all()
    serializer_class = CallLogSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CallLogFilter
    # TODO: Fix this permission later
    # permission_classes = (DoctorPermission, PersonnelPermission,)

class DoctorCallLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CallLog.objects.all()
    serializer_class = FullCallLogSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CallLogFilter
    permission_classes = [DoctorPermission]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return CallLog.objects.filter(doctor=user)
        else:
            return CallLog.objects.none()
    
    @swagger_auto_schema(
        method='get',
        operation_description="Retrieve the call-log statistics",
        responses={200: CallStatsSerializer}
    )
    @action(detail=False, methods=['get'], serializer_class=CallStatsSerializer)
    def call_stats(self, request):
        filtered_calls = self.filter_queryset(self.get_queryset())

        total_call_time = filtered_calls.aggregate(total_call_time=Sum('duration'))['total_call_time']
        total_completed = filtered_calls.filter(status=CallStatus.COMPLETED).count()
        total_busy = filtered_calls.filter(status=CallStatus.DECLINED).count()
        total_failed = filtered_calls.filter(status=CallStatus.FAILED).count()

        return Response({
            'total_call_time': total_call_time,
            'total_completed': total_completed,
            'total_busy': total_busy,
            'total_failed': total_failed
        })

class PersonnelCallLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FullCallLogSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CallLogFilter
    permission_classes = [PersonnelPermission]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return CallLog.objects.filter(health_care_assistant=user)
        else:
            return CallLog.objects.none()
        
        
class WebhookAPIView(APIView):
    permission_classes = []
    
    @staticmethod
    def verify_webhook(data, signature):
        try:
            public_key = rsa.PublicKey.load_pkcs1(os.getenv('VIDEO_SDK_PUBLIC_KEY').encode('utf-8'))
            rsa.verify(data.encode('utf-8'), signature, public_key)
            return True
        except rsa.VerificationError as e:
            logger.error("Verification failed: %s", e)
            return False
        except Exception as e:
            logger.error("An error occurred during webhook verification: %s", e)
            return False

    @method_decorator(csrf_exempt)
    def post(self, request, *args, **kwargs):
        data = request.data
        signature = request.headers.get('videosdk-signature')

        if not signature:
            return Response({'error': 'Missing signature'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            signature_bytes = base64.b64decode(signature)
        except (TypeError, ValueError):
            return Response({'error': 'Invalid signature format'}, status=status.HTTP_400_BAD_REQUEST)

        #   TODO: Fix signature verification later
        # verified = self.verify_webhook(json.dumps(data), signature_bytes)

        # if not verified:
        #     return Response({'error': 'Invalid signature'}, status=status.HTTP_401_UNAUTHORIZED)

        hook_type = data.get("webhookType")
        meeting_data = data.get("data")
        
        if not meeting_data or not hook_type:
            return Response({'error': 'Missing required data'}, status=status.HTTP_400_BAD_REQUEST)

        meeting_id = meeting_data.get("meetingId")
        if not meeting_id:
            return Response({'error': 'Missing meeting ID'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            call_log = CallLog.objects.get(meeting_id=meeting_id)
        except CallLog.DoesNotExist:
            return Response({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)

        if hook_type == "session-started":
            call_log.sessionStarted(meeting_data.get("start"))

        elif hook_type == "session-ended":
            call_log.sessionEnded(meeting_data.get("start"), meeting_data.get("end"))

        return Response({'status': 'success'}, status=status.HTTP_200_OK)