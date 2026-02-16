from rest_framework import serializers
from .models import Order, OrderItem, Review, Payment
from apps.cars.serializers import CarListSerializer
from apps.users.serializers import UserSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = OrderItem
        fields = ['id', 'name', 'quantity', 'price']


class ReviewSerializer(serializers.ModelSerializer):
    
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    car_info = serializers.CharField(source='car.__str__', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_name', 'car', 'car_info',
            'rating', 'comment', 'pros', 'cons',
            'is_verified', 'created_at'
        ]
        read_only_fields = ['id', 'is_verified', 'created_at']


class PaymentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'amount', 'status', 'payment_method',
            'transaction_id', 'created_at', 'paid_at'
        ]
        read_only_fields = ['id', 'created_at', 'paid_at']


class OrderListSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    car_info = serializers.CharField(source='car.__str__', read_only=True)
    car_image = serializers.SerializerMethodField()
    assigned_to_name = serializers.CharField(
        source='assigned_to.full_name',
        read_only=True,
        allow_null=True
    )
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'user_name', 'car', 'car_info', 'car_image',
            'assigned_to', 'assigned_to_name', 'order_type', 'status',
            'total_price', 'desired_date', 'created_at'
        ]
    
    def get_car_image(self, obj):
        primary = obj.car.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
            return primary.image.url
        return None


class OrderDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    car = CarListSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    payment = PaymentSerializer(read_only=True)
    review = ReviewSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'car', 'assigned_to', 'order_type', 'status',
            'total_price', 'customer_comment', 'manager_comment',
            'desired_date', 'items', 'payment', 'review',
            'created_at', 'updated_at'
        ]


class OrderCreateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Order
        fields = [
            'car', 'order_type', 'customer_comment', 'desired_date'
        ]
    
    def validate(self, data):
        car = data['car']
        if car.status != car.Status.IN_STOCK:
            raise serializers.ValidationError(
                'Этот автомобиль больше не доступен для заказа'
            )
        return data
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)