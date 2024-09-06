from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from .models import User
from .serializers import UserSerializer, CurrentUserSerializer, WalletAccountSerializer, UserSearchSerializer, DoctorSerializer, DoctorTokenObtainPairSerializer, PersonnelTokenObtainPairSerializer
from utils.permission import DoctorPermission, PersonnelPermission
from drf_yasg import openapi
from django.contrib.auth.hashers import check_password
from django.contrib.auth.password_validation import validate_password, ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
import pyotp
from datetime import datetime, timedelta
from utils.notification import Notification
from django.db.models import Q
from rest_framework_simplejwt.views import TokenObtainPairView
from utils.flutterwave import FlutterwaveAPI

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

    @swagger_auto_schema(
        method='get',
        operation_description="Retrieve the current logged-in user's wallet",
        responses={200: WalletAccountSerializer}
    )
    @action(detail=False, methods=['get'])
    def current_user_wallet(self, request):
        user: User = request.user
        # TODO: Check if user have account and if not throw error
        wallet = FlutterwaveAPI.get_virtual_account(user.wallet.account_number)
        return Response(wallet)

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
    @action(detail=False, methods=['post'], serializer_class=None, permission_classes=[])
    def forget_password(self, request):
        identifier = request.data.get('identifier')
        try:
            user = User.objects.get(Q(username=identifier) | Q(email=identifier) | Q(phone_number=identifier))
            user_id = user.id
            otp_secret = pyotp.random_base32()
            otp = pyotp.TOTP(otp_secret).now()

            request.session['otp_secret'] = otp_secret
            request.session['otp_expiry'] = (datetime.now() + timedelta(minutes=5)).isoformat()
            request.session['user_id'] = str(user_id)
            try:
                notification = Notification(user=user, emailType='forget_password_otp')
                notification.send(otp=otp)
                return Response({'detail': 'Password reset OTP sent to your mail.'}, status=status.HTTP_200_OK)
            except Exception as e:
                pass
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
    @action(detail=False, methods=['post'], serializer_class=None, permission_classes=[])
    def otp_validation(self, request):
        otp = request.data.get('otp')

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
    @action(detail=False, methods=['put'], serializer_class=None, permission_classes=[IsAuthenticated])
    def password_reset_change(self, request):
        new_password = request.data.get('new_password')

        try:
            user = request.user
            user.set_password(new_password)
            user.save()

            return Response({'detail': 'Password changed successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DoctorUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [PersonnelPermission]

class PersonnelUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSearchSerializer
    permission_classes = [DoctorPermission]

class DoctorTokenObtainPairView(TokenObtainPairView):
    serializer_class = DoctorTokenObtainPairSerializer

class PersonnelTokenObtainPairView(TokenObtainPairView):
    serializer_class = PersonnelTokenObtainPairSerializer
