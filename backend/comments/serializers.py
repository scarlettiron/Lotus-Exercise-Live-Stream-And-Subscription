from rest_framework import serializers 
from .models import comment
from users.serializers import prefetch_user_serializer

class create_comment_serializer(serializers.ModelSerializer):
    class Meta:
        model = comment
        fields = ['pk', 'post', 'user', 'body', 'date']
        read_only_fields = ['pk', 'date']
        
    def validate_user(self, value):
        request = self.context.get('request')
        if request.user != value:
            raise serializers.ValidationError('Unauthorized')
        return value

class get_comment_serializer(serializers.ModelSerializer):
    user  = prefetch_user_serializer(read_only=True)
    class Meta:
        model = comment
        fields = ['pk', 'body', 'post', 'user', 'date']       
