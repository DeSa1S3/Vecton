from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Notification
from .services import NotificationService

User = get_user_model()


class NotificationModelTests(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            phone='79991234567',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
    
    def test_create_notification(self):
        notification = Notification.objects.create(
            user=self.user,
            type=Notification.NotificationType.EMAIL,
            title='Test Title',
            message='Test Message'
        )
        
        self.assertEqual(notification.user, self.user)
        self.assertEqual(notification.title, 'Test Title')
        self.assertEqual(notification.message, 'Test Message')
        self.assertFalse(notification.is_read)
    
    def test_mark_as_read(self):
        notification = Notification.objects.create(
            user=self.user,
            type=Notification.NotificationType.EMAIL,
            title='Test Title',
            message='Test Message'
        )
        
        self.assertFalse(notification.is_read)
        notification.mark_as_read()
        notification.refresh_from_db()
        self.assertTrue(notification.is_read)
    
    def test_notification_service_create(self):
        notification = NotificationService.create_notification(
            user=self.user,
            type=Notification.NotificationType.EMAIL,
            title='Service Test',
            message='Service Message'
        )
        
        self.assertIsNotNone(notification)
        self.assertEqual(notification.title, 'Service Test')