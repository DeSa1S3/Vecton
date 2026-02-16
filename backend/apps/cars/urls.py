from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarViewSet, BrandViewSet, CarModelViewSet

router = DefaultRouter()
router.register('cars', CarViewSet, basename='cars')
router.register('brands', BrandViewSet, basename='brands')
router.register('models', CarModelViewSet, basename='car-models')

urlpatterns = [
    path('', include(router.urls)),
]