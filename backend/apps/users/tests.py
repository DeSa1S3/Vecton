from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()


class UserModelTests(TestCase):
    
    def test_create_user(self):
        user = User.objects.create_user(
            email='test@example.com',
            phone='79991234567',
            password='testpass123',
            first_name='Иван',
            last_name='Петров'
        )
        
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.phone, '79991234567')
        self.assertTrue(user.check_password('testpass123'))
        self.assertEqual(user.full_name, 'Петров Иван')
        self.assertEqual(user.role, User.Role.CLIENT)
    
    def test_create_superuser(self):
        admin = User.objects.create_superuser(
            email='admin@example.com',
            phone='79991234568',
            password='admin123',
            first_name='Admin',
            last_name='User'
        )
        
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_staff)
        self.assertEqual(admin.role, User.Role.ADMIN)
    
    def test_phone_validation(self):
        with self.assertRaises(ValidationError):
            user = User(
                email='test@example.com',
                phone='89603651313',  
                first_name='Иван',
                last_name='Петров'
            )
            user.full_clean()
    
    def test_is_manager_property(self):
        client = User.objects.create_user(
            email='client@example.com',
            phone='79991234569',
            password='pass123',
            first_name='Client',
            last_name='User',
            role=User.Role.CLIENT
        )
        self.assertFalse(client.is_manager)
        
        manager = User.objects.create_user(
            email='manager@example.com',
            phone='79991234570',
            password='pass123',
            first_name='Manager',
            last_name='User',
            role=User.Role.MANAGER
        )
        self.assertTrue(manager.is_manager)