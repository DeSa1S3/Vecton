from celery import shared_task
from django.utils import timezone
from .models import Notification
from .services import NotificationService


@shared_task
def send_notification_task(notification_id):

    try:
        notification = Notification.objects.get(id=notification_id)
        NotificationService.send_notification(notification)
        return f"Notification {notification_id} sent"
    except Notification.DoesNotExist:
        return f"Notification {notification_id} not found"


@shared_task
def clean_old_notifications(days=30):

    cutoff_date = timezone.now() - timezone.timedelta(days=days)
    deleted_count = Notification.objects.filter(
        created_at__lt=cutoff_date,
        is_read=True
    ).delete()[0]
    
    return f"Deleted {deleted_count} old notifications"