from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Car, Brand, CarModel
from .serializers import (
    CarListSerializer, CarDetailSerializer, CarCreateUpdateSerializer,
    BrandSerializer, CarModelSerializer, CarImageSerializer
)
from core.permissions import IsManagerOrReadOnly
from .filters import CarFilter
from .services import CarService


class CarViewSet(viewsets.ModelViewSet):
    """
    ViewSet для автомобилей.
    """
    queryset = Car.objects.all().prefetch_related('images')
    permission_classes = [IsManagerOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = CarFilter
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CarListSerializer
        elif self.action == 'retrieve':
            return CarDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return CarCreateUpdateSerializer
        return CarListSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Фильтрация по параметрам запроса
        price_min = self.request.query_params.get('price_min')
        price_max = self.request.query_params.get('price_max')
        year_min = self.request.query_params.get('year_min')
        year_max = self.request.query_params.get('year_max')
        search = self.request.query_params.get('search')
        
        if price_min:
            queryset = queryset.filter(price__gte=price_min)
        if price_max:
            queryset = queryset.filter(price__lte=price_max)
        if year_min:
            queryset = queryset.filter(year__gte=year_min)
        if year_max:
            queryset = queryset.filter(year__lte=year_max)
        
        if search:
            queryset = queryset.filter(
                Q(brand__icontains=search) |
                Q(model__icontains=search) |
                Q(description__icontains=search)
            )
        
        # Не показываем проданные авто обычным пользователям
        if not self.request.user.is_authenticated or not self.request.user.is_manager:
            queryset = queryset.exclude(status=Car.Status.SOLD)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        """
        Увеличение счетчика просмотров.
        """
        car = self.get_object()
        CarService.increment_views(car)
        return Response({'views_count': car.views_count})
    
    @action(detail=True, methods=['get'])
    def similar(self, request, pk=None):
        """
        Похожие автомобили.
        """
        car = self.get_object()
        similar_cars = CarService.get_similar_cars(car, limit=4)
        serializer = CarListSerializer(
            similar_cars,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='images')
    def upload_images(self, request, pk=None):
        """
        Загрузка изображений для автомобиля.
        """
        car = self.get_object()
        files = request.FILES.getlist('images')
        
        if len(files) > 10:
            return Response(
                {'error': 'Нельзя загрузить более 10 изображений'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        images = []
        for idx, file in enumerate(files):
            image = CarImage.objects.create(
                car=car,
                image=file,
                order=car.images.count() + idx,
                is_primary=(idx == 0 and not car.images.exists())
            )
            images.append(image)
        
        serializer = CarImageSerializer(images, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BrandViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandSerializer
    pagination_class = None


class CarModelViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = CarModelSerializer
    pagination_class = None
    
    def get_queryset(self):
        queryset = CarModel.objects.filter(is_active=True)
        brand_id = self.request.query_params.get('brand')
        if brand_id:
            queryset = queryset.filter(brand_id=brand_id)
        return queryset