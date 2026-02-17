from django.db import models
from django.conf import settings


class Notification(models.Model):

    class NotificationType(models.TextChoices):
        EMAIL = 'email', 'Email'
        SMS = 'sms', 'SMS'
        PUSH = 'push', 'Push-уведомление'
        TELEGRAM = 'telegram', 'Telegram'
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name='Пользователь'
    )
    
    type = models.CharField(
        max_length=20,
        choices=NotificationType.choices,
        verbose_name='Тип'
    )
    
    title = models.CharField(
        max_length=255,
        verbose_name='Заголовок'
    )
    message = models.TextField(
        verbose_name='Сообщение'
    )
    
    is_read = models.BooleanField(
        default=False,
        verbose_name='Прочитано'
    )
    
    data = models.JSONField(
        default=dict,
        blank=True,
        verbose_name='Дополнительные данные'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    sent_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Дата отправки'
    )
    
    class Meta:
        verbose_name = 'Уведомление'
        verbose_name_plural = 'Уведомления'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'is_read']),
        ]
    
    def __str__(self):
        return f"{self.type}: {self.title} - {self.user.email}"
    
    def mark_as_read(self):
        self.is_read = True
        self.save(update_fields=['is_read'])