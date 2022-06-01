from rest_framework import serializers
from .models import notifications

class notifications_serializer(serializers.ModelSerializer):
    class Meta:
        model = notifications
        fields = '__all__'