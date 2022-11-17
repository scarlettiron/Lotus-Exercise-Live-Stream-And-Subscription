from django.forms import ValidationError
from rest_framework import serializers
from .models import follow

from users.serializers import prefetch_user_serializer

class follow_serializer(serializers.ModelSerializer):
    class Meta:
        model = follow
        fields = ['pk', 'creator', 'follower']
    
    '''     def validate_follower(self, value):
        request = self.context.get('request')
        user = request.user
        if value == request.user:
            return value
        raise ValidationError('Unauthorized') '''

    
class followers_serializer(serializers.ModelSerializer):
    follower = prefetch_user_serializer(read_only = True)
    
    class Meta:
        model = follow
        fields = ['pk', 'creator', 'follower']
        
        
class following_serializer(serializers.ModelSerializer):
    creator = prefetch_user_serializer(read_only = True)
    
    class Meta:
        model = follow
        fields = ['pk','creator', 'follower']