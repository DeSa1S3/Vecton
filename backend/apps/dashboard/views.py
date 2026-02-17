from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Count, Sum, Avg
from django.utils import timezone
from datetime import timedelta
from apps.cars.models import Car
from apps.orders.models import Order
from apps.users.models import User
from core.permissions import IsManager


class DashboardStatsView(APIView):

    permission_classes = [IsAuthenticated, IsManager]
    
    def get(self, request):
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        cars_stats = {
            'total': Car.objects.count(),
            'in_stock': Car.objects.filter(status=Car.Status.IN_STOCK).count(),
            'sold': Car.objects.filter(status=Car.Status.SOLD).count(),
            'reserved': Car.objects.filter(status=Car.Status.RESERVED).count(),
            'added_today': Car.objects.filter(created_at__date=today).count(),
            'added_week': Car.objects.filter(created_at__date__gte=week_ago).count(),
            'added_month': Car.objects.filter(created_at__date__gte=month_ago).count(),
            'total_views': Car.objects.aggregate(total=Sum('views_count'))['total'] or 0,
        }
        
        orders_stats = {
            'total': Order.objects.count(),
            'new': Order.objects.filter(status=Order.Status.NEW).count(),
            'in_progress': Order.objects.filter(status=Order.Status.IN_PROGRESS).count(),
            'completed': Order.objects.filter(status=Order.Status.COMPLETED).count(),
            'cancelled': Order.objects.filter(status=Order.Status.CANCELLED).count(),
            'today': Order.objects.filter(created_at__date=today).count(),
            'week': Order.objects.filter(created_at__date__gte=week_ago).count(),
            'month': Order.objects.filter(created_at__date__gte=month_ago).count(),
        }
        
        users_stats = {
            'total': User.objects.count(),
            'clients': User.objects.filter(role=User.Role.CLIENT).count(),
            'managers': User.objects.filter(role=User.Role.MANAGER).count(),
            'new_today': User.objects.filter(date_joined__date=today).count(),
            'new_week': User.objects.filter(date_joined__date__gte=week_ago).count(),
            'new_month': User.objects.filter(date_joined__date__gte=month_ago).count(),
        }
        
        return Response({
            'cars': cars_stats,
            'orders': orders_stats,
            'users': users_stats,
        })


class PopularCarsView(APIView):

    permission_classes = [IsAuthenticated, IsManager]
    
    def get(self, request):
        limit = int(request.query_params.get('limit', 10))
        
        popular_cars = Car.objects.filter(
            status=Car.Status.SOLD
        ).annotate(
            orders_count=Count('orders')
        ).order_by('-orders_count', '-views_count')[:limit]
        
        data = []
        for car in popular_cars:
            data.append({
                'id': car.id,
                'brand': car.brand,
                'model': car.model,
                'year': car.year,
                'orders_count': car.orders_count,
                'views_count': car.views_count,
            })
        
        return Response(data)


class RecentOrdersView(APIView):

    permission_classes = [IsAuthenticated, IsManager]
    
    def get(self, request):
        limit = int(request.query_params.get('limit', 10))
        
        orders = Order.objects.select_related(
            'user', 'car'
        ).order_by('-created_at')[:limit]
        
        data = []
        for order in orders:
            data.append({
                'id': order.id,
                'user': {
                    'id': order.user.id,
                    'full_name': order.user.full_name,
                    'email': order.user.email,
                },
                'car': {
                    'id': order.car.id,
                    'brand': order.car.brand,
                    'model': order.car.model,
                    'year': order.car.year,
                },
                'order_type': order.order_type,
                'status': order.status,
                'total_price': order.total_price,
                'created_at': order.created_at,
            })
        
        return Response(data)


class RevenueStatsView(APIView):

    permission_classes = [IsAuthenticated, IsManager]
    
    def get(self, request):
        period = request.query_params.get('period', 'month')
        
        today = timezone.now().date()
        
        if period == 'day':
            start_date = today
            group_by = 'hour'
        elif period == 'week':
            start_date = today - timedelta(days=7)
            group_by = 'day'
        elif period == 'month':
            start_date = today - timedelta(days=30)
            group_by = 'day'
        elif period == 'year':
            start_date = today - timedelta(days=365)
            group_by = 'month'
        else:
            start_date = today - timedelta(days=30)
            group_by = 'day'
        
        completed_orders = Order.objects.filter(
            status=Order.Status.COMPLETED,
            created_at__date__gte=start_date
        )
        
        total_revenue = completed_orders.aggregate(
            total=Sum('total_price')
        )['total'] or 0
        
        avg_order_value = completed_orders.aggregate(
            avg=Avg('total_price')
        )['avg'] or 0
        
        return Response({
            'total_revenue': total_revenue,
            'avg_order_value': avg_order_value,
            'orders_count': completed_orders.count(),
            'period': period,
            'start_date': start_date,
            'end_date': today,
        })