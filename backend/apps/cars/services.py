from django.db.models import Q, Count
from .models import Car


class CarService:

    @staticmethod
    def get_filtered_cars(filters):

        queryset = Car.objects.filter(status=Car.Status.IN_STOCK)
        
        if filters.get('brand'):
            queryset = queryset.filter(brand__iexact=filters['brand'])
        
        if filters.get('price_min'):
            queryset = queryset.filter(price__gte=filters['price_min'])
        
        if filters.get('price_max'):
            queryset = queryset.filter(price__lte=filters['price_max'])
        
        if filters.get('year_min'):
            queryset = queryset.filter(year__gte=filters['year_min'])
        
        if filters.get('year_max'):
            queryset = queryset.filter(year__lte=filters['year_max'])
        
        if filters.get('transmission'):
            queryset = queryset.filter(transmission__in=filters['transmission'])
        
        if filters.get('drive'):
            queryset = queryset.filter(drive__in=filters['drive'])
        
        return queryset
    
    @staticmethod
    def increment_views(car):

        car.views_count += 1
        car.save(update_fields=['views_count'])
    
    @staticmethod
    def get_similar_cars(car, limit=4):

        return Car.objects.filter(
            Q(brand=car.brand) |
            Q(model__icontains=car.model[:3]) |
            Q(year__range=(car.year-2, car.year+2))
        ).exclude(id=car.id).exclude(status=Car.Status.SOLD)[:limit]
    
    @staticmethod
    def get_popular_brands(limit=10):

        return Car.objects.filter(status=Car.Status.IN_STOCK)\
            .values('brand')\
            .annotate(count=Count('id'))\
            .order_by('-count')[:limit]