from rest_framework import serializers
from .models import thread, message

from users.serializers import prefetch_user_serializer

class create_thread_serializer(serializers.ModelSerializer):
    class Meta:
        model = thread
        fields = '__all__'


class user_threads_serializer(serializers.ModelSerializer):
    user1 = prefetch_user_serializer()
    user2 = prefetch_user_serializer()
    class Meta:
        model = thread
        fields = ['pk', 'user1', 'user2','last_viewed', 'has_unread']
        
              
class thread_messages(serializers.ModelSerializer):
    messages = serializers.SerializerMethodField(read_only = True)
    class Meta:
        model = thread
        fields = ['pk', 'last_viewed', 'has_unread', 'user1', 'user2', 'messages']
    
    
         
class message_serializer(serializers.ModelSerializer):
    class Meta:
        model = message
        fields = '__all__'