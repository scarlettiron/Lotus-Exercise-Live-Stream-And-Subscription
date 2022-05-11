from attr import field
from rest_framework import serializers
from .models import post_like

from posts.serializers import post_detail_serializer

class post_like_serializer(serializers.ModelSerializer):
    class Meta:
        model = post_like
        fields = ['pk', 'post', 'user']
        
    def validate_user(self, value):
        request = self.context.get('request')
        user = request.user
        if value != user:
            raise serializers.ValidationError('Unauthorized')
        return value
    
class post_like_prefetch_serializer(serializers.ModelSerializer):
    post = post_detail_serializer(read_only=True)
    class Meta:
        model = post_like
        fields = ['pk', 'post', 'user']