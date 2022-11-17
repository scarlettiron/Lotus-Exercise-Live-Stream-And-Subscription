from rest_framework import serializers
from .models import post, postProductId
from userTransactions.models import UserTransactionItem

from content.serializers import album_serializer
from users.serializers import prefetch_user_post_serializer
from comments.serializers import get_comment_serializer


class post_list_serializer(serializers.ModelSerializer):
    liked = serializers.IntegerField()
    purchased = serializers.IntegerField()
    user = prefetch_user_post_serializer()
    class Meta:
        model = post
        fields = ['id', 'body','user','price_units','price', 
                  'date', 'liked', 'purchased']
        
    def validate_user(self, value):
        request = self.context.get('request')
        user = request.user
        if user != value:
            raise serializers.ValidationError("Unauthorized")
        return value
    
        

        


class post_detail_serializer(serializers.ModelSerializer):
    album = album_serializer()
    user = prefetch_user_post_serializer()
    is_owner = serializers.SerializerMethodField()
    liked = serializers.IntegerField()
    purchased = serializers.IntegerField()
    comments = get_comment_serializer(many=True)

    class Meta:
        model = post
        fields = ['id', 'user', 'date','price','price_units','body', 
                  'subscription', 'album', 'is_owner',
                  'liked', 'purchased', 'comments']
        read_only_fields = ['id','date', 'is_owner', 'liked', 'purchased', 'comments']
        

    def get_is_owner(self, obj):
        request = self.context.get('request')
        if obj.user == request.user:
            return True
        return False  
    
       


class profile_post_serializer(serializers.ModelSerializer):
    album = album_serializer(read_only=True)
    is_owner = serializers.SerializerMethodField(read_only=True)
    liked = serializers.IntegerField()
    purchased = serializers.IntegerField()
    
    class Meta:
        model = post
        fields = ['id', 'user', 'is_owner', 'date', 'price', 'price_units', 'body', 
                  'subscription', 'album', 'like_count', 'comment_count', 'liked', 
                  'purchased']
        read_only_fields = ['is_owner', 'liked', 'purchased']
        
    def get_is_owner(self, obj):
        request = self.context.get('request')

        if obj.user == request.user:
            return True
        return False
    
        

class create_post_serializer(serializers.ModelSerializer):
    class Meta:
        model = post
        fields = '__all__'
        
    def validate_user(self, value):
        request = self.context.get('request')
        if request.user != value:
            raise serializers.ValidationError('unauthorized')
        return value
 
 
    
class postProductId_serializer(serializers.ModelSerializer):
    class Meta:
        model = postProductId
        fields = '__all__'
        

class prefetchPost_serializer(serializers.ModelSerializer):
    album = album_serializer()
    user = prefetch_user_post_serializer()
    class Meta:
        model = post
        fields = ['id', 'user', 'date','price','price_units','body', 
                  'subscription', 'album']
        read_only_fields = ['id','date']
        