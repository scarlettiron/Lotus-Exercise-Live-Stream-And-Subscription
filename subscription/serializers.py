from re import sub
from rest_framework import serializers

from .models import subscription

from users.serializers import prefetch_user_serializer
from datetime import datetime


class subscription_serializer(serializers.ModelSerializer):
    
    class Meta:
        model = subscription
        fields = ['subscriber', 'creator', 'auto_draft', 'is_active']
        
    def validate_subscriber(self, value):
        request = self.context.get('request')
        user = request.user
        if user == value:
            return value
        raise serializers.ValidationError("Unauthorized")
            
        
        
class subscribers_serializer(serializers.ModelSerializer):
    subscriber = prefetch_user_serializer(read_only=True)
    class Meta:
        model = subscription
        fields = ['pk', 'creator','subscriber']
        


class subscriptions_serializer(serializers.ModelSerializer):
    creator = prefetch_user_serializer(read_only = True)
    class Meta:
        model = subscription
        fields = ['pk', 'creator', 'subscriber', 'begin_date', 'end_date', 'auto_draft', 'is_active']
        
        
        