from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import generics, mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from . import services
from .models import Partner
from .paystack import PaystackError
from .serializers import (
    PartnerConsultationCreateSerializer,
    PartnerConsultationSerializer,
    PartnerRegistrationSerializer,
    PartnerSerializer,
)


class PartnerPatientPermission(BasePermission):
    message = 'This account is not registered with a partner clinic.'

    def has_permission(self, request, view):
        user = request.user
        return (
            user.is_authenticated
            and user.user_type == 'customer'
            and services.get_partner_for(user) is not None
        )


def payment_callback_url(request):
    base = getattr(settings, 'PARTNER_PORTAL_URL', '') or request.headers.get('Origin', '')
    return f'{base.rstrip("/")}/app/payment/callback'


class PartnerDetailView(generics.RetrieveAPIView):
    """Public: a partner's landing info and its services/doctors."""

    permission_classes = [AllowAny]
    serializer_class = PartnerSerializer
    queryset = Partner.objects.filter(is_active=True)
    lookup_field = 'slug'


class PartnerRegisterView(APIView):
    """Public: sign up as a patient of this partner. Returns JWT tokens."""

    permission_classes = [AllowAny]

    def post(self, request, slug):
        partner = get_object_or_404(Partner, slug=slug, is_active=True)
        serializer = PartnerRegistrationSerializer(data=request.data, context={'partner': partner})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {'access': str(refresh.access_token), 'refresh': str(refresh), 'partner': partner.slug},
            status=status.HTTP_201_CREATED,
        )


class MyPartnerView(APIView):
    """The partner the logged-in patient belongs to."""

    def get(self, request):
        partner = services.get_partner_for(request.user) if request.user.is_authenticated else None
        if partner is None:
            raise NotFound('This account is not registered with a partner clinic.')
        return Response(PartnerSerializer(partner).data)


class PartnerConsultationViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [PartnerPatientPermission]
    serializer_class = PartnerConsultationSerializer

    def get_queryset(self):
        return self.request.user.partner_consultations.select_related('service', 'partner')

    def create(self, request):
        partner = services.get_partner_for(request.user)
        write = PartnerConsultationCreateSerializer(data=request.data, context={'partner': partner})
        write.is_valid(raise_exception=True)
        try:
            consultation = services.create_consultation(
                request.user,
                write.validated_data['service'],
                reason=write.validated_data.get('reason', ''),
                patient=request.user.patient_profile.first(),
            )
        except services.PartnerConfigError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return self._checkout(request, consultation, status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        """Restart checkout for a consultation that wasn't paid."""
        return self._checkout(request, self.get_object(), status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        consultation = self.get_object()
        if consultation.status == 'pending_payment':
            try:
                consultation = services.verify_payment(consultation)
            except PaystackError:
                # Not paid (yet) — the webhook will still settle it if it was.
                pass
        return Response(self.get_serializer(consultation).data)

    def _checkout(self, request, consultation, success_status):
        try:
            url = services.initialize_payment(consultation, payment_callback_url(request))
        except services.PartnerConfigError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except PaystackError as exc:
            return Response({'detail': f'Payment could not be started: {exc}'}, status=status.HTTP_502_BAD_GATEWAY)
        data = self.get_serializer(consultation).data
        data['authorization_url'] = url
        return Response(data, status=success_status)
