from django.contrib import admin
from .models import Favorite


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'car', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'user__phone', 'car__brand', 'car__model')
    readonly_fields = ('created_at',)