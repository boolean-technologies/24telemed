from rest_framework.permissions import BasePermission

class PersonnelPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.user_type == 'personnel' or request.user.user_type == 'customer'

class DoctorPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.user_type == 'doctor'