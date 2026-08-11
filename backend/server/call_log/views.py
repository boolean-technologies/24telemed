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
from django.db import transaction
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

        completed_calls = filtered_calls.filter(status=CallStatus.COMPLETED)
        total_call_time = completed_calls.aggregate(total_call_time=Sum('duration'))['total_call_time'] or 0
        total_completed = completed_calls.count()
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
            # Stored as base64 because CapRover's env var field truncates any
            # value at its first line break, so the raw multi-line PEM can't
            # be saved there directly. Defensively strip surrounding quotes
            # and any literal/real newline artifacts CapRover's storage has
            # been observed to tack on — none of those are valid base64.
            raw_key = (os.getenv('VIDEO_SDK_PUBLIC_KEY') or '').strip()
            raw_key = raw_key.strip('"').strip("'")
            raw_key = raw_key.replace('\\n', '').replace('\n', '').strip()
            pem_bytes = base64.b64decode(raw_key)
            public_key = rsa.PublicKey.load_pkcs1(pem_bytes)
            # Must byte-match VideoSDK's own JSON.stringify(body) (no spaces
            # after ':'/','), or every legitimate signature fails to verify.
            payload = json.dumps(data, separators=(',', ':'))
            rsa.verify(payload.encode('utf-8'), signature, public_key)
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

        verified = self.verify_webhook(data, signature_bytes)

        if not verified:
            return Response({'error': 'Invalid signature'}, status=status.HTTP_401_UNAUTHORIZED)

        hook_type = data.get("webhookType")
        meeting_data = data.get("data")
        
        if not meeting_data or not hook_type:
            return Response({'error': 'Missing required data'}, status=status.HTTP_400_BAD_REQUEST)

        meeting_id = meeting_data.get("meetingId")
        if not meeting_id:
            return Response({'error': 'Missing meeting ID'}, status=status.HTTP_400_BAD_REQUEST)

        if hook_type == "session-started":
            try:
                call_log = CallLog.objects.get(meeting_id=meeting_id)
            except CallLog.DoesNotExist:
                return Response({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)
            call_log.sessionStarted(meeting_data.get("start"))

        elif hook_type == "session-ended":
            # Lock the row for the duration of the check-and-bill sequence so
            # two near-simultaneous webhook deliveries for the same session
            # can't both pass the "not already Completed" check before either
            # commits — the second request blocks here until the first's
            # transaction (and its billing) has landed.
            with transaction.atomic():
                try:
                    call_log = CallLog.objects.select_for_update().get(meeting_id=meeting_id)
                except CallLog.DoesNotExist:
                    return Response({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)
                call_log.sessionEnded(meeting_data.get("start"), meeting_data.get("end"))

        return Response({'status': 'success'}, status=status.HTTP_200_OK)