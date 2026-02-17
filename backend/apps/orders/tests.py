from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.cars.models import Car
from .models import Order

User = get_user_model()


class OrderModelTests(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            phone='79991234567',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        self.car = Car.objects.create(
            brand='Toyota',
            model='Camry',
            year=2022,
            price=2500000,
            created_by=self.user
        )
    
    def test_create_order(self):
        order = Order.objects.create(
            user=self.user,
            car=self.car,
            order_type=Order.OrderType.TEST_DRIVE,
            customer_comment='Хочу посмотреть авто'
        )
        
        self.assertEqual(order.user, self.user)
        self.assertEqual(order.car, self.car)
        self.assertEqual(order.order_type, Order.OrderType.TEST_DRIVE)
        self.assertEqual(order.status, Order.Status.NEW)
        self.assertEqual(order.customer_comment, 'Хочу посмотреть авто')
    
    def test_order_str(self):
        order = Order.objects.create(
            user=self.user,
            car=self.car,
            order_type=Order.OrderType.PURCHASE
        )
        
        expected = f"Заказ #{order.id} - {self.user.full_name} - Toyota Camry"
        self.assertEqual(str(order), expected)