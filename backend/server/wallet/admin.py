from django.contrib import admin
from django.core.exceptions import PermissionDenied
from .models import Wallet

# Register your models here.
class WalletAdmin(admin.ModelAdmin):
    list_display = ['user', 'balance', 'currency', 'status', 'created_at', 'updated_at']
    search_fields = ['user__username', 'currency', 'status']
    list_filter = ['status', 'currency', 'created_at']

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return True

    def get_readonly_fields(self, request, obj=None):
        return [f.name for f in self.model._meta.fields]

    def save_model(self, request, obj, form, change):
        raise PermissionDenied("Modifications are not allowed in admin.")

    def get_actions(self, request):
        actions = super().get_actions(request) or {}
        actions.pop('delete_selected', None)
        return actions

admin.site.register(Wallet, WalletAdmin)