from rest_framework import viewsets
from .models import User
from .serializers import UserSerializer, UserSearchSerializer
from utils.permission import DoctorPermission

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class DoctorUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSearchSerializer
    permission_classes = []