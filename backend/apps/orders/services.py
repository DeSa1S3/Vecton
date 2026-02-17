from django.db.models import Sum, Avg, Count
from django.utils import timezone
from .models import Order, Payment


class OrderService:

    @staticmethod
    def get_order_statistics(period='month'):

        now = timezone.now()
        
        if period == 'day':
            start_date = now - timezone.timedelta(days=1)
        elif period == 'week':
            start_date = now - timezone.timedelta(weeks=1)
        elif period == 'month':
            start_date = now - timezone.timedelta(days=30)
        elif period == 'year':
            start_date = now - timezone.timedelta(days=365)
        else:
            start_date = None
        
        queryset = Order.objects.all()
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        
        return {
            'total': queryset.count(),
            'completed': queryset.filter(status=Order.Status.COMPLETED).count(),
            'cancelled': queryset.filter(status=Order.Status.CANCELLED).count(),
            'in_progress': queryset.filter(status=Order.Status.IN_PROGRESS).count(),
            'total_revenue': queryset.filter(
                status=Order.Status.COMPLETED
            ).aggregate(total=Sum('total_price'))['total'] or 0,
        }
    
    @staticmethod
    def assign_manager(order, manager):

        order.assigned_to = manager
        order.save(update_fields=['assigned_to'])
        
        from apps.notifications.services import NotificationService
        NotificationService.notify_order_assigned(order)
        
        return order