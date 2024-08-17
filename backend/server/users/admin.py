from django.contrib import admin
from .models import User
from django.contrib.auth.hashers import make_password

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'user_id', 'get_user_name', 'user_type', 'phone_number')
    fields = ('user_type', 'username', 'password', 'first_name', 'last_name', 'email', 'phone_number', 'specialty', 'location', 'description', 'date_of_birth')

    def get_user_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'
    get_user_name.short_description = "Full Name"

    def save_model(self, request, obj, form, change):
        if 'password' in form.changed_data:
            obj.password = make_password(obj.password)
        super().save_model(request, obj, form, change)

admin.site.register(User, UserAdmin)
