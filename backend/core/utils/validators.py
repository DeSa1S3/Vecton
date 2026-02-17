import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_phone(value):

    phone = re.sub(r'\D', '', value)
    
    if len(phone) == 11 and phone.startswith('8'):
        phone = '7' + phone[1:]
    elif len(phone) == 10:
        phone = '7' + phone
    elif len(phone) != 11 or not phone.startswith('7'):
        raise ValidationError(
            _('Телефон должен быть в формате 79991234567')
        )
    
    return phone


def validate_vin(value):

    vin = value.upper()
    if not re.match(r'^[A-HJ-NPR-Z0-9]{17}$', vin):
        raise ValidationError(
            _('Неверный формат VIN-номера')
        )
    return vin


def validate_image_size(file, max_size_mb=5):

    max_size = max_size_mb * 1024 * 1024
    if file.size > max_size:
        raise ValidationError(
            _('Размер файла не должен превышать %(size)s МБ'),
            params={'size': max_size_mb}
        )


def validate_image_extension(file, allowed_extensions=None):

    if allowed_extensions is None:
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.webp']
    
    ext = file.name.split('.')[-1].lower()
    if f'.{ext}' not in allowed_extensions:
        raise ValidationError(
            _('Недопустимый формат файла. Допустимы: %(ext)s'),
            params={'ext': ', '.join(allowed_extensions)}
        )