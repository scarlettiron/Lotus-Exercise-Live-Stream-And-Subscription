from rest_framework import serializers

from .models import user_notification

class notifications_serializer(serializers.ModelSerializer):
    class Meta:
        model = user_notification
        fields = '__all__'