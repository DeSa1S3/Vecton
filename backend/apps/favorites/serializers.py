from rest_framework import serializers
from .models import Favorite
from apps.cars.serializers import CarListSerializer


class FavoriteSerializer(serializers.ModelSerializer):

    car = CarListSerializer(read_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'car', 'created_at']
        read_only_fields = ['id', 'created_at']


class FavoriteCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Favorite
        fields = ['car']
    
    def validate(self, data):
        user = self.context['request'].user
        car = data['car']
        
        if Favorite.objects.filter(user=user, car=car).exists():
            raise serializers.ValidationError(
                'Этот автомобиль уже в избранном'
            )
        
        return data
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)