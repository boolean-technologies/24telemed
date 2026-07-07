from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from drf_yasg.utils import swagger_auto_schema
from .models import User, PasswordResetRequest, PushDevice
from .serializers import UserSerializer, CurrentUserSerializer, UserSearchSerializer, DoctorSerializer, DoctorTokenObtainPairSerializer, PersonnelTokenObtainPairSerializer, RegistrationSerializer
from utils.permission import DoctorPermission, PersonnelPermission
from drf_yasg import openapi
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.password_validation import validate_password, ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
import pyotp
from datetime import datetime, timedelta
from utils.notification import Notification
from file.models import File
from django.db.models import Q
from django.utils import timezone
from rest_framework_simplejwt.views import TokenObtainPairView
import secrets

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        method='get',
        operation_description="Retrieve the current logged-in user's information",
        responses={200: CurrentUserSerializer}
    )
    @action(detail=False, methods=['get'])
    def current_user(self, request):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data)   

    @action(
        detail=False,
        methods=['post'],
        parser_classes=[MultiPartParser, FormParser],
        permission_classes=[IsAuthenticated],
    )
    def profile_photo(self, request):
        upload = request.FILES.get('file')
        if not upload:
            return Response(
                {'detail': 'Choose an image to upload.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not (upload.content_type or '').startswith('image/'):
            return Response(
                {'detail': 'The selected file must be an image.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if upload.size > 5 * 1024 * 1024:
            return Response(
                {'detail': 'The image must be smaller than 5 MB.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        stored_file = File.objects.create(file=upload)
        request.user.photo = stored_file
        request.user.save(update_fields=['photo'])
        return Response(CurrentUserSerializer(request.user).data)

    @action(
        detail=False,
        methods=['post', 'delete'],
        permission_classes=[IsAuthenticated],
    )
    def push_devices(self, request):
        token = request.data.get('token')
        if not token:
            return Response(
                {'detail': 'Push token is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.method == 'DELETE':
            PushDevice.objects.filter(token=token, user=request.user).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        device, _ = PushDevice.objects.update_or_create(
            token=token,
            defaults={
                'user': request.user,
                'platform': request.data.get('platform', ''),
                'active': True,
            },
        )
        return Response({'id': str(device.id)}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        method='put',
        operation_description="Authenticated user password reset",
        request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'current_password': openapi.Schema(type=openapi.TYPE_STRING),
            'new_password': openapi.Schema(type=openapi.TYPE_STRING),
        },
        required=['current_password','new_password']
    ),
    )
    @action(detail=False, methods=['put'], serializer_class=None)
    def change_password(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not check_password(current_password, user.password):
            return Response({'detail': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user=user)
        except ValidationError as e:
            return Response({'detail': e.messages}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({'detail': 'Password reset successful.'}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        method='post',
        operation_description="Forget password endpoint",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'identifier': openapi.Schema(type=openapi.TYPE_STRING, description="Username, email, or phone number"),
            },
            required=['identifier']
        ),
    )
    @action(detail=False, methods=['post'], serializer_class=None, permission_classes=[AllowAny])
    def forget_password(self, request):
        identifier = request.data.get('identifier')
        if not identifier:
            return Response(
                {'detail': 'Enter your username, email, or phone number.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            user = User.objects.get(Q(username=identifier) | Q(email=identifier) | Q(phone_number=identifier))
            otp_secret = pyotp.random_base32()
            otp = pyotp.TOTP(otp_secret).now()

            reset_request = PasswordResetRequest.objects.create(
                user=user,
                otp_hash=make_password(otp),
                expires_at=timezone.now() + timedelta(minutes=5),
            )
            # Retain the old session values for existing web clients.
            request.session['otp_secret'] = otp_secret
            request.session['otp_expiry'] = (datetime.now() + timedelta(minutes=5)).isoformat()
            request.session['user_id'] = str(user.id)

            notification = Notification(user=user, emailType='forget_password_otp')
            if not notification.send(otp=otp):
                reset_request.delete()
                return Response(
                    {'detail': 'We could not send the OTP. Please try again shortly.'},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )
            return Response(
                {
                    'detail': 'Password reset OTP sent to your email.',
                    'reset_id': str(reset_request.id),
                },
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        method='post',
        operation_description="OTP validation for password reset",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'otp': openapi.Schema(type=openapi.TYPE_STRING, description="OTP sent to user"),
            },
            required=['otp']
        ),
    )
    @action(detail=False, methods=['post'], serializer_class=None, permission_classes=[AllowAny])
    def otp_validation(self, request):
        otp = request.data.get('otp')
        reset_id = request.data.get('reset_id')

        if reset_id:
            try:
                reset_request = PasswordResetRequest.objects.select_related('user').get(
                    id=reset_id, used_at__isnull=True
                )
            except (PasswordResetRequest.DoesNotExist, ValueError):
                return Response(
                    {'detail': 'This reset request is no longer valid.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if reset_request.expires_at < timezone.now():
                return Response(
                    {'detail': 'OTP expired. Request a new one.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if reset_request.attempts >= 5:
                return Response(
                    {'detail': 'Too many attempts. Request a new OTP.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            reset_request.attempts += 1
            if not otp or not check_password(otp, reset_request.otp_hash):
                reset_request.save(update_fields=['attempts'])
                return Response(
                    {'detail': 'Invalid OTP.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            reset_token = secrets.token_urlsafe(32)
            reset_request.reset_token_hash = make_password(reset_token)
            reset_request.verified_at = timezone.now()
            reset_request.save(
                update_fields=['attempts', 'reset_token_hash', 'verified_at']
            )
            return Response(
                {
                    'reset_id': str(reset_request.id),
                    'reset_token': reset_token,
                },
                status=status.HTTP_200_OK,
            )

        # Legacy browser-session flow.
        try:
            user_id = request.session.get('user_id')
            otp_secret = request.session.get('otp_secret')
            otp_expiry = request.session.get('otp_expiry')

            if not user_id or not otp_secret or not otp_expiry:
                return Response({'detail': 'Session timeout, try again.'}, status=status.HTTP_400_BAD_REQUEST)

            if datetime.fromisoformat(otp_expiry) < datetime.now():
                return Response({'detail': 'OTP expired.'}, status=status.HTTP_400_BAD_REQUEST)
            
            totp = pyotp.TOTP(otp_secret)
            is_valid = totp.verify(otp, valid_window=3)

            if not is_valid:
                return Response({'detail': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.get(pk=user_id)
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        method='put',
        operation_description="Change user password",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'new_password': openapi.Schema(type=openapi.TYPE_STRING, description="New password"),
            },
            required=['new_password']
        ),
    )
    @action(detail=False, methods=['put'], serializer_class=None, permission_classes=[AllowAny])
    def password_reset_change(self, request):
        new_password = request.data.get('new_password')
        reset_id = request.data.get('reset_id')
        reset_token = request.data.get('reset_token')

        try:
            if reset_id and reset_token:
                try:
                    reset_request = PasswordResetRequest.objects.select_related('user').get(
                        id=reset_id,
                        used_at__isnull=True,
                        verified_at__isnull=False,
                    )
                except (PasswordResetRequest.DoesNotExist, ValueError):
                    return Response(
                        {'detail': 'This reset request is no longer valid.'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                if (
                    reset_request.expires_at < timezone.now()
                    or not check_password(
                        reset_token, reset_request.reset_token_hash
                    )
                ):
                    return Response(
                        {'detail': 'This reset token is invalid or expired.'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                user = reset_request.user
            elif request.user.is_authenticated:
                # Existing clients may still authenticate with the JWT returned
                # by the legacy OTP validation branch.
                reset_request = None
                user = request.user
            else:
                return Response(
                    {'detail': 'A verified reset token is required.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            validate_password(new_password, user=user)
            user.set_password(new_password)
            user.save()
            if reset_request:
                reset_request.used_at = timezone.now()
                reset_request.save(update_fields=['used_at'])

            return Response({'detail': 'Password changed successfully'}, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({'detail': e.messages}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DoctorUserViewSet(viewsets.ReadOnlyModelViewSet):
    # Only admin-approved providers are visible to patients / callable.
    queryset = User.objects.filter(user_type='doctor', is_verified=True)
    serializer_class = DoctorSerializer
    permission_classes = [PersonnelPermission]

    def get_queryset(self):
        qs = super().get_queryset()
        # Optional ?provider_role=doctor|nurse filter (nurses for nursing visits).
        role = self.request.query_params.get('provider_role')
        if role in ('doctor', 'nurse'):
            qs = qs.filter(provider_role=role)
        return qs

class PersonnelUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(user_type__in=['personnel', 'customer'])
    serializer_class = UserSearchSerializer
    permission_classes = [DoctorPermission]

class RegisterView(generics.CreateAPIView):
    """Public self-sign-up. Returns JWT tokens so the app can log in directly."""

    permission_classes = [AllowAny]
    serializer_class = RegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'user_type': user.user_type,
                'is_verified': user.is_verified,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class DoctorTokenObtainPairView(TokenObtainPairView):
    serializer_class = DoctorTokenObtainPairSerializer

class PersonnelTokenObtainPairView(TokenObtainPairView):
    serializer_class = PersonnelTokenObtainPairSerializer
