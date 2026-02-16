from rest_framework import serializers
from .models import Car, CarImage, Brand, CarModel


class CarImageSerializer(serializers.ModelSerializer):

    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CarImage
        fields = ['id', 'image', 'image_url', 'is_primary', 'order', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']
    
    def get_image_url(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def validate_image(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError('Размер файла не должен превышать 5 МБ')
        
        if value.content_type not in ['image/jpeg', 'image/png', 'image/webp']:
            raise serializers.ValidationError('Допустимы только JPEG, PNG и WebP')
        
        return value


class BrandSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Brand
        fields = ['id', 'name', 'logo', 'country', 'is_active']


class CarModelSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    
    class Meta:
        model = CarModel
        fields = ['id', 'brand', 'brand_name', 'name', 'generation', 'year_start', 'year_end']


class CarListSerializer(serializers.ModelSerializer):

    formatted_price = serializers.SerializerMethodField()
    formatted_mileage = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()
    images_count = serializers.IntegerField(source='images.count', read_only=True)
    
    class Meta:
        model = Car
        fields = [
            'id', 'brand', 'model', 'year', 'price', 'formatted_price',
            'mileage', 'formatted_mileage', 'status', 'main_image',
            'images_count', 'created_at'
        ]
    
    def get_formatted_price(self, obj):
        return obj.formatted_price
    
    def get_formatted_mileage(self, obj):
        return obj.formatted_mileage
    
    def get_main_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
            return primary.image.url
        return None


class CarDetailSerializer(serializers.ModelSerializer):

    images = CarImageSerializer(many=True, read_only=True)
    formatted_price = serializers.SerializerMethodField()
    formatted_mileage = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Car
        fields = [
            'id', 'brand', 'model', 'year', 'price', 'formatted_price',
            'mileage', 'formatted_mileage', 'vin', 'color', 'engine_volume',
            'engine_power', 'fuel_type', 'transmission', 'drive', 'body_type',
            'description', 'equipment', 'status', 'views_count',
            'images', 'main_image', 'created_at', 'updated_at'
        ]
    
    def get_formatted_price(self, obj):
        return obj.formatted_price
    
    def get_formatted_mileage(self, obj):
        return obj.formatted_mileage
    
    def get_main_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
            return primary.image.url
        return None


class CarCreateUpdateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Car
        fields = [
            'brand', 'model', 'year', 'price', 'mileage', 'vin',
            'color', 'engine_volume', 'engine_power', 'fuel_type',
            'transmission', 'drive', 'body_type', 'description',
            'equipment', 'status', 'images'
        ]
    
    def create(self, validated_data):
        images = validated_data.pop('images', [])
        car = Car.objects.create(**validated_data)
        
        for idx, image in enumerate(images):
            CarImage.objects.create(
                car=car,
                image=image,
                order=idx,
                is_primary=(idx == 0)
            )
        
        return car
    
    def update(self, instance, validated_data):
        images = validated_data.pop('images', [])
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if images:
            instance.images.all().delete()
            
            for idx, image in enumerate(images):
                CarImage.objects.create(
                    car=instance,
                    image=image,
                    order=idx,
                    is_primary=(idx == 0)
                )
        
        return instance