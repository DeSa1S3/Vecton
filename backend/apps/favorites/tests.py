from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.cars.models import Car
from .models import Favorite

User = get_user_model()


class FavoriteModelTests(TestCase):
    
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
    
    def test_add_to_favorites(self):
        favorite = Favorite.objects.create(
            user=self.user,
            car=self.car
        )
        
        self.assertEqual(favorite.user, self.user)
        self.assertEqual(favorite.car, self.car)
        self.assertIsNotNone(favorite.created_at)
    
    def test_unique_together(self):
        Favorite.objects.create(user=self.user, car=self.car)
        
        with self.assertRaises(Exception):
            Favorite.objects.create(user=self.user, car=self.car)