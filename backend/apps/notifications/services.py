from django.core.mail import send_mail
from django.conf import settings
from .models import Notification


class EmailService:
    
    @staticmethod
    def send_email(recipient, subject, message):
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient],
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False


class SMSService:
    
    @staticmethod
    def send_sms(phone, message):
        print(f"Sending SMS to {phone}: {message}")
        return True


class TelegramService:
    
    @staticmethod
    def send_telegram(chat_id, message):
        print(f"Sending Telegram to {chat_id}: {message}")
        return True


class NotificationService:

    
    @staticmethod
    def create_notification(user, type, title, message, data=None):

        notification = Notification.objects.create(
            user=user,
            type=type,
            title=title,
            message=message,
            data=data or {}
        )
        return notification
    
    @staticmethod
    def send_notification(notification):

        user = notification.user
        success = False
        
        if notification.type == Notification.NotificationType.EMAIL:
            success = EmailService.send_email(
                user.email,
                notification.title,
                notification.message
            )
        elif notification.type == Notification.NotificationType.SMS:
            success = SMSService.send_sms(
                user.phone,
                notification.message
            )
        elif notification.type == Notification.NotificationType.TELEGRAM:
            chat_id = user.telegram_chat_id if hasattr(user, 'telegram_chat_id') else None
            if chat_id:
                success = TelegramService.send_telegram(
                    chat_id,
                    notification.message
                )
        
        if success:
            from django.utils import timezone
            notification.sent_at = timezone.now()
            notification.save(update_fields=['sent_at'])
        
        return success
    
    @classmethod
    def notify_new_order(cls, order):
        cls.create_notification(
            user=order.user,
            type=Notification.NotificationType.EMAIL,
            title='Заказ создан',
            message=f'Ваш заказ #{order.id} на {order.car.brand} {order.car.model} создан и передан в обработку.',
            data={'order_id': order.id}
        )
        
        from apps.users.models import User
        managers = User.objects.filter(role=User.Role.MANAGER)
        for manager in managers:
            cls.create_notification(
                user=manager,
                type=Notification.NotificationType.EMAIL,
                title='Новый заказ',
                message=f'Новый заказ #{order.id} от {order.user.full_name} на {order.car.brand} {order.car.model}',
                data={'order_id': order.id}
            )
    
    @classmethod
    def notify_order_status_changed(cls, order):

        status_messages = {
            'in_progress': 'Заказ передан в обработку',
            'completed': 'Заказ завершен',
            'cancelled': 'Заказ отменен',
        }
        
        message = status_messages.get(order.status, f'Статус заказа изменен на {order.get_status_display()}')
        
        cls.create_notification(
            user=order.user,
            type=Notification.NotificationType.EMAIL,
            title=f'Статус заказа #{order.id} изменен',
            message=message,
            data={'order_id': order.id, 'status': order.status}
        )
    
    @classmethod
    def notify_order_assigned(cls, order):

        if order.assigned_to:
            cls.create_notification(
                user=order.assigned_to,
                type=Notification.NotificationType.EMAIL,
                title='Назначен новый заказ',
                message=f'Вам назначен заказ #{order.id} от {order.user.full_name}',
                data={'order_id': order.id}
            )