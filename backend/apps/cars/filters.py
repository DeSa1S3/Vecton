import django_filters
from .models import Car


class CarFilter(django_filters.FilterSet):

    brand = django_filters.CharFilter(lookup_expr='iexact')
    brand_in = django_filters.MultipleChoiceFilter(
        field_name='brand',
        lookup_expr='iexact',
        choices=[]
    )
    model = django_filters.CharFilter(lookup_expr='icontains')
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    year_min = django_filters.NumberFilter(field_name='year', lookup_expr='gte')
    year_max = django_filters.NumberFilter(field_name='year', lookup_expr='lte')
    transmission = django_filters.MultipleChoiceFilter(
        field_name='transmission',
        choices=Car.Transmission.choices
    )
    drive = django_filters.MultipleChoiceFilter(
        field_name='drive',
        choices=Car.Drive.choices
    )
    fuel_type = django_filters.MultipleChoiceFilter(
        field_name='fuel_type',
        choices=Car.FuelType.choices
    )
    body_type = django_filters.MultipleChoiceFilter(
        field_name='body_type',
        choices=Car.BodyType.choices
    )
    mileage_max = django_filters.NumberFilter(field_name='mileage', lookup_expr='lte')
    status = django_filters.ChoiceFilter(choices=Car.Status.choices)
    
    class Meta:
        model = Car
        fields = [
            'brand', 'model', 'year', 'price', 'mileage',
            'transmission', 'drive', 'fuel_type', 'body_type', 'status'
        ]