from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.conf import settings
import os
import re


def car_image_upload_path(instance, filename):

    from datetime import datetime
    
    ext = filename.split('.')[-1].lower()
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    safe_filename = f"{timestamp}_{instance.car.id}.{ext}"
    
    return os.path.join('cars', str(instance.car.id), safe_filename)


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    logo = models.ImageField(upload_to='brands/', blank=True, null=True, verbose_name='Логотип')
    country = models.CharField(max_length=100, blank=True, verbose_name='Страна')
    description = models.TextField(blank=True, verbose_name='Описание')
    is_active = models.BooleanField(default=True, verbose_name='Активна')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Марка'
        verbose_name_plural = 'Марки'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class CarModel(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='models', verbose_name='Марка')
    name = models.CharField(max_length=100, verbose_name='Название')
    generation = models.CharField(max_length=50, blank=True, verbose_name='Поколение')
    year_start = models.IntegerField(verbose_name='Год начала выпуска')
    year_end = models.IntegerField(null=True, blank=True, verbose_name='Год окончания выпуска')
    body_type = models.CharField(max_length=50, blank=True, verbose_name='Тип кузова')
    image = models.ImageField(upload_to='car_models/', blank=True, null=True, verbose_name='Изображение')
    is_active = models.BooleanField(default=True, verbose_name='Активна')
    
    class Meta:
        verbose_name = 'Модель'
        verbose_name_plural = 'Модели'
        unique_together = ['brand', 'name', 'generation']
        ordering = ['brand', 'name']
    
    def __str__(self):
        return f"{self.brand.name} {self.name}"


class Car(models.Model):

    
    class Status(models.TextChoices):
        IN_STOCK = 'in_stock', 'В наличии'
        SOLD = 'sold', 'Продан'
        RESERVED = 'reserved', 'В резерве'
        EXPECTED = 'expected', 'Ожидается'
    
    class FuelType(models.TextChoices):
        PETROL = 'petrol', 'Бензин'
        DIESEL = 'diesel', 'Дизель'
        ELECTRIC = 'electric', 'Электро'
        HYBRID = 'hybrid', 'Гибрид'
    
    class Transmission(models.TextChoices):
        AUTOMATIC = 'automatic', 'Автомат'
        MANUAL = 'manual', 'Механика'
        ROBOT = 'robot', 'Робот'
    
    class Drive(models.TextChoices):
        FRONT = 'front', 'Передний'
        REAR = 'rear', 'Задний'
        AWD = 'awd', 'Полный (постоянный)'
        FOUR_WD = '4wd', 'Подключаемый полный'
    
    class BodyType(models.TextChoices):
        SEDAN = 'sedan', 'Седан'
        HATCHBACK = 'hatchback', 'Хэтчбек'
        SUV = 'suv', 'Внедорожник'
        COUPE = 'coupe', 'Купе'
        WAGON = 'wagon', 'Универсал'
        MINIVAN = 'minivan', 'Минивэн'
        PICKUP = 'pickup', 'Пикап'
        VAN = 'van', 'Фургон'
        CABRIO = 'cabrio', 'Кабриолет'
    
    brand = models.CharField(
        max_length=100,
        db_index=True,
        verbose_name='Марка'
    )
    model = models.CharField(
        max_length=100,
        db_index=True,
        verbose_name='Модель'
    )
    year = models.IntegerField(
        db_index=True,
        validators=[
            MinValueValidator(1900),
            MaxValueValidator(timezone.now().year + 1)
        ],
        verbose_name='Год выпуска'
    )
    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name='Цена'
    )
    mileage = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        verbose_name='Пробег (км)'
    )
    vin = models.CharField(
        max_length=17,
        unique=True,
        null=True,
        blank=True,
        verbose_name='VIN-номер'
    )
    
    color = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='Цвет'
    )
    engine_volume = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True,
        verbose_name='Объем двигателя (л)'
    )
    engine_power = models.IntegerField(
        null=True,
        blank=True,
        verbose_name='Мощность (л.с.)'
    )
    fuel_type = models.CharField(
        max_length=20,
        choices=FuelType.choices,
        blank=True,
        verbose_name='Тип топлива'
    )
    transmission = models.CharField(
        max_length=20,
        choices=Transmission.choices,
        blank=True,
        verbose_name='Коробка передач'
    )
    drive = models.CharField(
        max_length=20,
        choices=Drive.choices,
        blank=True,
        verbose_name='Привод'
    )
    body_type = models.CharField(
        max_length=30,
        choices=BodyType.choices,
        blank=True,
        verbose_name='Тип кузова'
    )
    
    description = models.TextField(
        blank=True,
        verbose_name='Описание'
    )
    equipment = models.JSONField(
        default=dict,
        blank=True,
        verbose_name='Комплектация'
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.IN_STOCK,
        db_index=True,
        verbose_name='Статус'
    )
    views_count = models.PositiveIntegerField(
        default=0,
        verbose_name='Просмотры'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_cars',
        verbose_name='Создал'
    )
    
    class Meta:
        verbose_name = 'Автомобиль'
        verbose_name_plural = 'Автомобили'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['brand', 'model']),
            models.Index(fields=['price', 'year']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"
    
    def clean(self):

        if self.vin:
            if not re.match(r'^[A-HJ-NPR-Z0-9]{17}$', self.vin.upper()):
                raise ValidationError({'vin': 'Неверный формат VIN-номера'})
            self.vin = self.vin.upper()
        
        if self.price <= 0:
            raise ValidationError({'price': 'Цена должна быть положительной'})
        
        current_year = timezone.now().year
        if self.year < 1900 or self.year > current_year + 1:
            raise ValidationError(
                {'year': f'Год должен быть от 1900 до {current_year + 1}'}
            )
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    @property
    def formatted_price(self):
        return f"{int(self.price):,} ₽".replace(",", " ")
    
    @property
    def formatted_mileage(self):
        if self.mileage:
            return f"{self.mileage:,} км".replace(",", " ")
        return "Новый"
    
    @property
    def age(self):
        return timezone.now().year - self.year
    
    def increment_views(self):
        self.views_count += 1
        self.save(update_fields=['views_count'])


class CarImage(models.Model):

    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='Автомобиль'
    )
    image = models.ImageField(
        upload_to=car_image_upload_path,
        verbose_name='Изображение'
    )
    is_primary = models.BooleanField(
        default=False,
        verbose_name='Главное фото'
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Порядок сортировки'
    )
    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата загрузки'
    )
    file_size = models.PositiveIntegerField(
        editable=False,
        null=True,
        verbose_name='Размер файла (байт)'
    )
    
    class Meta:
        verbose_name = 'Изображение автомобиля'
        verbose_name_plural = 'Изображения автомобилей'
        ordering = ['order', '-is_primary', '-uploaded_at']
        constraints = [
            models.UniqueConstraint(
                fields=['car'],
                condition=models.Q(is_primary=True),
                name='unique_primary_per_car'
            )
        ]
    
    def __str__(self):
        return f"Изображение {self.id} для {self.car}"
    
    def save(self, *args, **kwargs):
        if self.is_primary:
            CarImage.objects.filter(car=self.car, is_primary=True).update(is_primary=False)
        
        if self.image and not self.file_size:
            self.file_size = self.image.size
        
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        if self.image:
            storage = self.image.storage
            if storage.exists(self.image.name):
                storage.delete(self.image.name)
        super().delete(*args, **kwargs)