from rest_framework import serializers

from .models import user_notification
from users.serializers import prefetch_user_serializer

class notifications_serializer(serializers.ModelSerializer):
    creator = prefetch_user_serializer()
    user = prefetch_user_serializer()
    class Meta:
        model = user_notification
        fields = ['pk', 'type', 'date', 'user', 'creator', 'seen']