from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Notification
from .serializers import NotificationSerializer, NotificationMarkReadSerializer


class NotificationViewSet(viewsets.ModelViewSet):

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        is_read = request.query_params.get('is_read')
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read.lower() == 'true')
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def mark_read(self, request):
        serializer = NotificationMarkReadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        queryset = self.get_queryset()
        
        if serializer.validated_data.get('mark_all'):
            count = queryset.filter(is_read=False).update(is_read=True)
            return Response({
                'message': f'{count} уведомлений отмечено как прочитанные'
            })
        
        notification_ids = serializer.validated_data.get('notification_ids', [])
        if notification_ids:
            count = queryset.filter(
                id__in=notification_ids,
                is_read=False
            ).update(is_read=True)
            return Response({
                'message': f'{count} уведомлений отмечено как прочитанные'
            })
        
        return Response(
            {'error': 'Не указаны уведомления'},
            status=status.HTTP_400_BAD_REQUEST