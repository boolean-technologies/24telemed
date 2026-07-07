from django.contrib import admin
from .models import PushDevice, User
from django.contrib.auth.hashers import make_password

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'user_id', 'get_user_name', 'user_type', 'provider_role', 'is_verified', 'phone_number')
    list_editable = ('is_verified', 'provider_role')
    fields = ('user_type', 'provider_role', 'is_verified', 'username', 'password', 'first_name', 'last_name', 'email', 'phone_number', 'insurance_coverage', 'specialty', 'location', 'description', 'date_of_birth')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    list_filter = ('user_type', 'provider_role', 'is_verified', 'location', 'specialty')
    ordering = ('-username',)

    def get_user_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'
    get_user_name.short_description = "Full Name"

    def save_model(self, request, obj, form, change):
        if 'password' in form.changed_data:
            obj.password = make_password(obj.password)
        super().save_model(request, obj, form, change)

admin.site.register(User, UserAdmin)


@admin.register(PushDevice)
class PushDeviceAdmin(admin.ModelAdmin):
    list_display = ('user', 'platform', 'active', 'updated_at')
    list_filter = ('platform', 'active')
    search_fields = ('user__username', 'token')
