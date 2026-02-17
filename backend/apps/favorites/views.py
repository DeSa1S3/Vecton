from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Favorite
from .serializers import FavoriteSerializer, FavoriteCreateSerializer
from apps.cars.models import Car


class FavoriteViewSet(viewsets.ModelViewSet):

    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('car')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return FavoriteCreateSerializer
        return FavoriteSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(
            {'message': 'Автомобиль добавлен в избранное'},
            status=status.HTTP_201_CREATED
        )
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        
        return Response(
            {'message': 'Автомобиль удален из избранного'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['delete'])
    def clear(self, request):

        self.get_queryset().delete()
        return Response(
            {'message': 'Избранное очищено'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def check(self, request):

        car_id = request.query_params.get('car_id')
        if not car_id:
            return Response(
                {'error': 'Не указан car_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        exists = self.get_queryset().filter(car_id=car_id).exists()
        return Response({'in_favorites': exists})