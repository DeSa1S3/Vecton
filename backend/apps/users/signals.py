from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group
from .models import User


@receiver(post_save, sender=User)
def assign_default_group(sender, instance, created, **kwargs):

    if created and instance.role == User.Role.CLIENT:
        try:
            clients_group = Group.objects.get(name='Клиенты')
            instance.groups.add(clients_group)
        except Group.DoesNotExist:
            pass  


@receiver(post_save, sender=User)
def create_welcome_notification(sender, instance, created, **kwargs):

    if created:
        from apps.notifications.models import Notification
        Notification.objects.create(
            user=instance,
            type='email',
            title='Добро пожаловать в Vecton!',
            message='Спасибо за регистрацию. Желаем удачных покупок!'
        )