from django.contrib import admin
from django.utils.html import format_html
from .models import Order, OrderItem, Review, Payment


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['price', 'quantity']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'car', 'order_type', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'order_type', 'created_at')
    search_fields = ('user__email', 'user__phone', 'car__brand', 'car__model')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [OrderItemInline]
    fieldsets = (
        ('Основная информация', {
            'fields': ('user', 'car', 'assigned_to', 'order_type', 'status')
        }),
        ('Финансы', {
            'fields': ('total_price',)
        }),
        ('Комментарии', {
            'fields': ('customer_comment', 'manager_comment')
        }),
        ('Даты', {
            'fields': ('desired_date', 'created_at', 'updated_at')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  
            if not obj.assigned_to:
                from apps.users.models import User
                manager = User.objects.filter(role=User.Role.MANAGER).first()
                if manager:
                    obj.assigned_to = manager
        super().save_model(request, obj, form, change)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'car', 'rating', 'is_verified', 'created_at')
    list_filter = ('rating', 'is_verified', 'created_at')
    search_fields = ('user__email', 'car__brand', 'car__model', 'comment')
    readonly_fields = ('created_at',)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'amount', 'status', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('order__id', 'transaction_id')
    readonly_fields = ('created_at', 'paid_at')