from dataclasses import fields
from .models import UserTransactionItem

from subscription.serializers import subscription_serializer
from classPackages.serializers import classPckage_serializer
from users.serializers import prefetch_user_post_serializer
from content.serializers import album_serializer

from posts.models import post
from likeUnlike.models import post_like

from rest_framework import serializers


class purchased_post_serializer(serializers.ModelSerializer):
    liked = serializers.SerializerMethodField()
    purchased = serializers.SerializerMethodField()
    user = prefetch_user_post_serializer()
    album = album_serializer()
    class Meta:
        model = post
        fields = ['id', 'body','user','price_units','price', 
                  'date', 'liked', 'purchased', 'album']
        
    def get_purchased(self, obj):
        return 1
    
    def get_liked(self, obj):
        context = self.context.get('request')
        user = context.user
        liked = post_like.objects.filter(post = obj, user = user).count()
        return liked

class userTransaction_serializer(serializers.ModelSerializer):
    subscription = subscription_serializer(read_only = True)
    classPackage = classPckage_serializer(read_only = True)
    post = purchased_post_serializer(read_only=True)
    class Meta:
        model = UserTransactionItem
        fields = '__all__'
        
        

        
        
    