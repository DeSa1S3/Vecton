from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):

    
    class Meta:
        model = Notification
        fields = ['id', 'type', 'title', 'message', 'is_read', 'data', 'created_at']
        read_only_fields = ['id', 'created_at']


class NotificationMarkReadSerializer(serializers.Serializer):

    notification_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )
    mark_all = serializers.BooleanField(default=False)