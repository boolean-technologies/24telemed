from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from utils.permission import PersonnelPermission, DoctorPermission
from utils.push_notifications import send_push_to_user
from chat.services import ensure_conversation
from .models import Booking, BookingStatus
from .serializers import (
    BookingSerializer,
    BookingCreateSerializer,
    DeclineSerializer,
)


class PersonnelBookingViewSet(viewsets.ModelViewSet):
    """Personnel: create, list, cancel and start their own bookings."""

    permission_classes = [PersonnelPermission]
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Booking.objects.filter(health_care_assistant=user)
        return Booking.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingSerializer

    def perform_create(self, serializer):
        serializer.save(health_care_assistant=self.request.user)

    def create(self, request, *args, **kwargs):
        write = self.get_serializer(data=request.data)
        write.is_valid(raise_exception=True)
        booking = write.save(health_care_assistant=request.user)
        ensure_conversation(booking.doctor, request.user)
        patient_name = (
            f'{booking.patient.first_name} {booking.patient.last_name}'.strip()
            if booking.patient
            else 'A patient'
        )
        send_push_to_user(
            booking.doctor,
            title='New appointment request',
            body=f'{patient_name} requested an appointment.',
            data={
                'type': 'booking_created',
                'booking_id': str(booking.id),
                'route': '/(doctor)/(tabs)/bookings',
            },
        )
        read = BookingSerializer(booking)
        return Response(read.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        booking.cancel()
        send_push_to_user(
            booking.doctor,
            title='Appointment cancelled',
            body='The patient cancelled an appointment.',
            data={
                'type': 'booking_cancelled',
                'booking_id': str(booking.id),
                'route': '/(doctor)/(tabs)/bookings',
            },
        )
        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Materialise the CallLog + VideoSDK room and return the call log id."""
        booking = self.get_object()
        call_log = booking.start()
        send_push_to_user(
            booking.doctor,
            title='Appointment call started',
            body='The patient started your scheduled appointment call.',
            data={
                'type': 'booking_call_started',
                'booking_id': str(booking.id),
                'call_log_id': str(call_log.id),
                'route': f'/(doctor)/meeting/{call_log.id}',
            },
            channel_id='incoming-calls',
            ttl=60,
        )
        return Response(
            {
                'booking': BookingSerializer(booking).data,
                'call_log_id': str(call_log.id),
                'meeting_id': call_log.meeting_id,
            }
        )


class DoctorBookingViewSet(viewsets.ReadOnlyModelViewSet):
    """Doctor: list bookings addressed to them, confirm/decline, and start."""

    permission_classes = [DoctorPermission]
    serializer_class = BookingSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Booking.objects.filter(doctor=user)
        return Booking.objects.none()

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        booking = self.get_object()
        booking.confirm()
        send_push_to_user(
            booking.health_care_assistant,
            title='Appointment confirmed',
            body=f'Dr. {booking.doctor.first_name or booking.doctor.username} confirmed your appointment.',
            data={
                'type': 'booking_confirmed',
                'booking_id': str(booking.id),
                'route': '/(patient)/(tabs)/bookings',
            },
        )
        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=['post'])
    def decline(self, request, pk=None):
        booking = self.get_object()
        serializer = DeclineSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking.decline(serializer.validated_data.get('note'))
        send_push_to_user(
            booking.health_care_assistant,
            title='Appointment declined',
            body=f'Dr. {booking.doctor.first_name or booking.doctor.username} could not accept the appointment.',
            data={
                'type': 'booking_declined',
                'booking_id': str(booking.id),
                'route': '/(patient)/(tabs)/bookings',
            },
        )
        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        booking = self.get_object()
        call_log = booking.start()
        send_push_to_user(
            booking.health_care_assistant,
            title='Appointment call started',
            body=f'Dr. {booking.doctor.first_name or booking.doctor.username} started your appointment call.',
            data={
                'type': 'booking_call_started',
                'booking_id': str(booking.id),
                'call_log_id': str(call_log.id),
                'route': f'/(patient)/meeting/{call_log.id}',
            },
            channel_id='incoming-calls',
            ttl=60,
        )
        return Response(
            {
                'booking': BookingSerializer(booking).data,
                'call_log_id': str(call_log.id),
                'meeting_id': call_log.meeting_id,
            }
        )
