from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):

    list_display = ('email', 'phone', 'full_name', 'role', 'is_active', 'date_joined')
    list_filter = ('role', 'is_active', 'is_staff', 'date_joined')
    search_fields = ('email', 'phone', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Персональная информация'), {
            'fields': ('first_name', 'last_name', 'patronymic', 'phone', 'avatar')
        }),
        (_('Компания'), {'fields': ('company_name',)}),
        (_('Права'), {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        (_('Настройки'), {'fields': ('preferred_notification', 'agreed_to_terms')}),
        (_('Даты'), {'fields': ('last_login', 'date_joined', 'last_activity')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone', 'password1', 'password2', 'first_name', 'last_name', 'role'),
        }),
    )
    
    def full_name(self, obj):
        return obj.full_name
    full_name.short_description = _('Полное имя')