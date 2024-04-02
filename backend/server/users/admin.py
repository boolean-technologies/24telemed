from django.contrib import admin
from .models import User

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'get_user_name','user_type', 'phone_number')

    def get_user_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'
    get_user_name.short_description = "Full Name"

admin.site.register(User, UserAdmin)