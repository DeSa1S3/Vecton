import re
from django.utils.text import slugify


def format_phone(phone):

    phone = re.sub(r'\D', '', phone)
    
    if len(phone) == 11 and phone.startswith('8'):
        phone = '7' + phone[1:]
    elif len(phone) == 10:
        phone = '7' + phone
    
    return phone


def format_price(price):
    
    return f"{int(price):,} ₽".replace(",", " ")


def generate_slug(text, model, field='slug'):

    slug = slugify(text)
    unique_slug = slug
    num = 1
    
    while model.objects.filter(**{field: unique_slug}).exists():
        unique_slug = f"{slug}-{num}"
        num += 1
    
    return unique_slug


def get_client_ip(request):

    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip