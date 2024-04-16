from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from .models import User
from .serializers import UserSerializer, UserSearchSerializer, DoctorSerializer
from utils.permission import DoctorPermission, PersonnelPermission
from drf_yasg import openapi
from django.contrib.auth.hashers import check_password
from django.contrib.auth.password_validation import validate_password, ValidationError

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        method='get',
        operation_description="Retrieve the current logged-in user's information",
        responses={200: UserSerializer}
    )
    @action(detail=False, methods=['get'])
    def current_user(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)   

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

class DoctorUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [PersonnelPermission]

class PersonnelUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSearchSerializer
    permission_classes = [DoctorPermission]