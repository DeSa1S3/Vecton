from django.contrib import admin
from django.utils.html import format_html
from .models import Car, CarImage, Brand, CarModel


class CarImageInline(admin.TabularInline):
    """Инлайн для изображений автомобиля."""
    model = CarImage
    extra = 1
    readonly_fields = ['image_preview']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px;"/>', obj.image.url)
        return "Нет изображения"
    image_preview.short_description = 'Превью'


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('brand', 'model', 'year', 'price', 'status', 'views_count', 'created_at')
    list_filter = ('brand', 'status', 'year', 'transmission', 'drive', 'fuel_type')
    search_fields = ('brand', 'model', 'vin', 'description')
    readonly_fields = ('views_count', 'created_at', 'updated_at')
    inlines = [CarImageInline]
    fieldsets = (
        ('Основная информация', {
            'fields': ('brand', 'model', 'year', 'price', 'mileage', 'vin', 'status')
        }),
        ('Технические характеристики', {
            'fields': ('color', 'engine_volume', 'engine_power', 'fuel_type',
                      'transmission', 'drive', 'body_type')
        }),
        ('Дополнительно', {
            'fields': ('description', 'equipment', 'views_count')
        }),
        ('Метаданные', {
            'fields': ('created_by', 'created_at', 'updated_at')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'is_active')
    search_fields = ('name',)


@admin.register(CarModel)
class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'generation', 'year_start', 'year_end')
    list_filter = ('brand',)
    search_fields = ('name',)