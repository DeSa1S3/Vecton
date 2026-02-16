from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
import re


def validate_phone_format(value):
    if not re.match(r'^7\d{10}$', value):
        raise ValidationError(
            _('Телефон должен быть в формате 79991234567 (11 цифр, начинается с 7)')
        )


class User(AbstractUser):
    
    class Role(models.TextChoices):
        CLIENT = 'client', _('Клиент')
        MANAGER = 'manager', _('Менеджер')
        ADMIN = 'admin', _('Администратор')
    
    class NotificationMethod(models.TextChoices):
        EMAIL = 'email', _('Email')
        SMS = 'sms', _('SMS')
        TELEGRAM = 'telegram', _('Telegram')
    
    username = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        verbose_name=_('Имя пользователя')
    )
    
    email = models.EmailField(
        unique=True,
        verbose_name=_('Email'),
        error_messages={
            'unique': _('Пользователь с таким email уже существует'),
        }
    )
    
    phone = models.CharField(
        max_length=12,
        unique=True,
        validators=[validate_phone_format],
        verbose_name=_('Телефон'),
        help_text=_('Формат: 79991234567'),
        error_messages={
            'unique': _('Пользователь с таким телефоном уже существует'),
        }
    )
    
    first_name = models.CharField(max_length=150, verbose_name=_('Имя'))
    last_name = models.CharField(max_length=150, verbose_name=_('Фамилия'))
    patronymic = models.CharField(
        max_length=150,
        blank=True,
        verbose_name=_('Отчество')
    )
    
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CLIENT,
        verbose_name=_('Роль'),
        db_index=True
    )
    
    avatar = models.ImageField(
        upload_to='avatars/',
        blank=True,
        null=True,
        verbose_name=_('Аватар')
    )
    
    company_name = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_('Название компании')
    )
    
    preferred_notification = models.CharField(
        max_length=20,
        choices=NotificationMethod.choices,
        default=NotificationMethod.EMAIL,
        verbose_name=_('Способ уведомлений')
    )
    
    agreed_to_terms = models.BooleanField(
        default=False,
        verbose_name=_('Согласие с условиями')
    )
    
    last_activity = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Последняя активность')
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone', 'first_name', 'last_name']
    
    class Meta:
        verbose_name = _('Пользователь')
        verbose_name_plural = _('Пользователи')
        indexes = [
            models.Index(fields=['email', 'phone']),
            models.Index(fields=['role', 'is_active']),
            models.Index(fields=['-date_joined']),
        ]
    
    def __str__(self):
        return f"{self.last_name} {self.first_name} - {self.phone}"
    
    @property
    def full_name(self):
        parts = [self.last_name, self.first_name, self.patronymic]
        return ' '.join(filter(None, parts))
    
    @property
    def is_manager(self):
        return self.role in [self.Role.MANAGER, self.Role.ADMIN]
    
    def get_notification_contact(self):
        if self.preferred_notification == self.NotificationMethod.EMAIL:
            return self.email
        elif self.preferred_notification == self.NotificationMethod.SMS:
            return self.phone
        return self.email
    
    def save(self, *args, **kwargs):
        if self.phone:
            self.phone = re.sub(r'\D', '', self.phone)
            if len(self.phone) == 11 and self.phone.startswith('8'):
                self.phone = '7' + self.phone[1:]
        super().save(*args, **kwargs)