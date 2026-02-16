from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
from apps.cars.models import Car


class Order(models.Model):
    
    class OrderType(models.TextChoices):
        TEST_DRIVE = 'test_drive', 'Тест-драйв'
        PURCHASE = 'purchase', 'Покупка'
        TRADE_IN = 'trade_in', 'Trade-in'
        CONSULTATION = 'consultation', 'Консультация'
    
    class Status(models.TextChoices):
        NEW = 'new', 'Новая'
        IN_PROGRESS = 'in_progress', 'В обработке'
        COMPLETED = 'completed', 'Завершена'
        CANCELLED = 'cancelled', 'Отменена'
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name='Клиент'
    )
    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name='Автомобиль'
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_orders',
        verbose_name='Ответственный менеджер'
    )
    
    order_type = models.CharField(
        max_length=20,
        choices=OrderType.choices,
        verbose_name='Тип заявки'
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
        db_index=True,
        verbose_name='Статус'
    )
    total_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Итоговая цена'
    )
    
    customer_comment = models.TextField(
        blank=True,
        verbose_name='Комментарий клиента'
    )
    manager_comment = models.TextField(
        blank=True,
        verbose_name='Комментарий менеджера'
    )
    
    desired_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='Желаемая дата'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )
    
    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['assigned_to', 'status']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return f"Заказ #{self.id} - {self.user.full_name} - {self.car.brand} {self.car.model}"
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new:
            from apps.notifications.services import NotificationService
            NotificationService.notify_new_order(self)


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Заказ'
    )
    name = models.CharField(
        max_length=255,
        verbose_name='Название'
    )
    quantity = models.PositiveIntegerField(
        default=1,
        verbose_name='Количество'
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Цена'
    )
    
    class Meta:
        verbose_name = 'Позиция заказа'
        verbose_name_plural = 'Позиции заказа'
    
    def __str__(self):
        return f"{self.name} x{self.quantity}"


class Review(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name='Пользователь'
    )
    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name='Автомобиль'
    )
    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name='review',
        null=True,
        blank=True,
        verbose_name='Заказ'
    )
    
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name='Оценка'
    )
    comment = models.TextField(
        verbose_name='Комментарий'
    )
    pros = models.TextField(
        blank=True,
        verbose_name='Достоинства'
    )
    cons = models.TextField(
        blank=True,
        verbose_name='Недостатки'
    )
    
    is_verified = models.BooleanField(
        default=False,
        verbose_name='Подтверждено'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    
    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        ordering = ['-created_at']
        unique_together = ['user', 'car']  #
    
    def __str__(self):
        return f"Отзыв {self.user.full_name} на {self.car.brand} {self.car.model} - {self.rating}★"


class Payment(models.Model):

    class PaymentStatus(models.TextChoices):
        PENDING = 'pending', 'Ожидает'
        PROCESSING = 'processing', 'В обработке'
        COMPLETED = 'completed', 'Завершен'
        FAILED = 'failed', 'Ошибка'
        REFUNDED = 'refunded', 'Возврат'
    
    class PaymentMethod(models.TextChoices):
        CASH = 'cash', 'Наличные'
        CARD = 'card', 'Банковская карта'
        ONLINE = 'online', 'Онлайн-оплата'
        INSTALLMENT = 'installment', 'Рассрочка'
        CREDIT = 'credit', 'Кредит'
    
    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name='payment',
        verbose_name='Заказ'
    )
    
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        verbose_name='Сумма'
    )
    status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
        verbose_name='Статус'
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        verbose_name='Способ оплаты'
    )
    
    transaction_id = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='ID транзакции'
    )
    payment_data = models.JSONField(
        default=dict,
        blank=True,
        verbose_name='Данные платежа'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    paid_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Дата оплаты'
    )
    
    class Meta:
        verbose_name = 'Платеж'
        verbose_name_plural = 'Платежи'
    
    def __str__(self):
        return f"Платеж #{self.id} - {self.amount} руб. - {self.status}"