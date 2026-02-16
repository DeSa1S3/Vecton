from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count
from .models import Order, Review, Payment
from .serializers import (
    OrderListSerializer, OrderDetailSerializer, OrderCreateSerializer,
    ReviewSerializer, PaymentSerializer
)
from core.permissions import IsOwnerOrManager


class OrderViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAuthenticated, IsOwnerOrManager]
    
    def get_queryset(self):
        user = self.request.user
        
        queryset = Order.objects.select_related(
            'user', 'car', 'assigned_to'
        ).prefetch_related('items', 'car__images')
        
        if user.is_manager:
            return queryset
        
        return queryset.filter(user=user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return OrderListSerializer
        elif self.action == 'create':
            return OrderCreateSerializer
        return OrderDetailSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):

        order = self.get_object()
        
        if order.status in [Order.Status.COMPLETED, Order.Status.CANCELLED]:
            return Response(
                {'error': 'Заказ нельзя отменить'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = Order.Status.CANCELLED
        order.save()
        
        return Response({'status': 'Заказ отменен'})
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_review(self, request, pk=None):

        order = self.get_object()
        
        if order.status != Order.Status.COMPLETED:
            return Response(
                {'error': 'Отзыв можно оставить только после завершения заказа'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if hasattr(order, 'review'):
            return Response(
                {'error': 'Отзыв уже оставлен'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        serializer.save(
            user=request.user,
            car=order.car,
            order=order
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):

        if not request.user.is_manager:
            return Response(
                {'error': 'Доступ запрещен'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        queryset = self.get_queryset()
        
        stats = {
            'total': queryset.count(),
            'by_status': queryset.values('status').annotate(
                count=Count('id')
            ).order_by('status'),
            'by_type': queryset.values('order_type').annotate(
                count=Count('id')
            ).order_by('order_type'),
            'today': queryset.filter(
                created_at__date=request.query_params.get('date')
            ).count() if request.query_params.get('date') else None
        }
        
        return Response(stats)