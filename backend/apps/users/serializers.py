from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
import re
from .models import User


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'phone', 'first_name', 'last_name',
            'patronymic', 'full_name', 'avatar', 'avatar_url',
            'role', 'company_name', 'preferred_notification',
            'date_joined', 'last_activity', 'is_active'
        ]
        read_only_fields = ['id', 'role', 'date_joined', 'last_activity']
    
    def get_full_name(self, obj):
        return obj.full_name
    
    def get_avatar_url(self, obj):
        if obj.avatar and hasattr(obj.avatar, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        label='Подтверждение пароля'
    )
    
    class Meta:
        model = User
        fields = [
            'email', 'phone', 'password', 'password2',
            'first_name', 'last_name', 'patronymic',
            'company_name', 'agreed_to_terms'
        ]
    
    def validate_phone(self, value):
        phone = re.sub(r'\D', '', value)
        
        if len(phone) == 11 and phone.startswith('8'):
            phone = '7' + phone[1:]
        elif len(phone) == 10:
            phone = '7' + phone
        elif len(phone) != 11 or not phone.startswith('7'):
            raise serializers.ValidationError(
                'Телефон должен быть в формате 79991234567'
            )
        
        if User.objects.filter(phone=phone).exists():
            raise serializers.ValidationError(
                'Пользователь с таким телефоном уже существует'
            )
        
        return phone
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                'Пользователь с таким email уже существует'
            )
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                'password': 'Пароли не совпадают'
            })
        
        if not attrs.get('agreed_to_terms'):
            raise serializers.ValidationError({
                'agreed_to_terms': 'Необходимо принять условия'
            })
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        style={'input_type': 'password'},
        trim_whitespace=False
    )
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(request=self.context.get('request'),
                               email=email, password=password)
            
            if not user:
                raise serializers.ValidationError(
                    'Неверный email или пароль',
                    code='authorization'
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    'Учетная запись деактивирована',
                    code='authorization'
                )
        else:
            raise serializers.ValidationError(
                'Необходимо указать email и пароль',
                code='authorization'
            )
        
        attrs['user'] = user
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        required=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    new_password2 = serializers.CharField(
        required=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({
                'new_password': 'Пароли не совпадают'
            })
        return attrs