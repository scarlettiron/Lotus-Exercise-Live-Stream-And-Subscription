from django.db.models import Q
from rest_framework import serializers
from .models import custom_profile

from subscription.models import subscription
from follow.models import follow 
from classPackages.models import publicPackage
from classPackages.serializers import publicPackage_serializer
from chat.models import thread

from django.conf import settings
User = settings.AUTH_USER_MODEL


### used for viewing full user profile page
class profile_serializer(serializers.ModelSerializer):
    subscribed = serializers.SerializerMethodField('get_subscribed', read_only=True)
    following = serializers.SerializerMethodField(read_only=True)
    existing_thread = serializers.SerializerMethodField(read_only = True)

    class Meta:
        model = custom_profile

        fields = ['id','username','is_instructor','is_verified','pic','banner', 'bio', 
                  'first_name', 'last_name','subscribed', 'following','slug',
                  'subscription_units', 'subscription', 'existing_thread']
        read_only_fields  = ['id','username','is_instructor','is_verified', 
                             'subscribed','following', 'slug', 'existing_thread']

        
    def get_subscribed(self, obj):
        request = self.context.get('request')
        user = request.user
        if obj == user:
            return True
        try:
            sub = subscription.objects.get(creator = obj, subscriber = user)
            if sub.is_active == True:
                return True
            return False
        except:
            return False
    
    def get_following(self, obj):
        request = self.context.get('request')
        user = request.user
        if obj == user:
            return True

        try:
            Follow = follow.objects.get(follower = user, creator = obj)
            return True
        except:
            return False


    def get_is_owner(self, obj):
        request = self.context.get('request')
        user = request.user
        if obj == user:
            return True
        return False 
    
    def get_existing_thread(self, obj):
        request = self.context.get('request')
        user = request.user  
        if obj == user:
            return None
        
        try:
            Thread = thread.objects.filter(Q(user1 = user, user2 = obj) |
                                           Q(user1 = obj, user2 = user))[0]
            return Thread.pk
        except:
            return None
                  


class create_user_serializer(serializers.ModelSerializer):
    class Meta:
        model = custom_profile
        fields = ['username', 'password', 'email']
        
    def create(self, validated_data):
        username = validated_data['username'].lower()
        email = validated_data['email']
        query = custom_profile.objects.filter(username__iexact=username)
        if query:
            raise serializers.ValidationError(f"Username taken")
        user = custom_profile(username=username, email=email)
        user.set_password(validated_data['password'])
        user.save()
        return user
 
 
    
class prefetch_user_serializer(serializers.ModelSerializer):
    class Meta:
        model = custom_profile
        fields = ['pk','username','pic','banner', 'first_name','last_name','subscription', 'slug']
        


### used for displaying comments on posts
class prefetch_user_post_serializer(serializers.ModelSerializer):
    subscribed = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()
    class Meta:
        model = custom_profile
        fields = ['pk', 'username', 'slug', 'pic', 'subscribed', 'following']
        read_only_fields = ['subscribed', 'following']       
        
    def get_subscribed(self, obj):
        request = self.context.get('request')
        user = request.user
        if obj == user:
            return True
        try:
            sub = subscription.objects.get(creator = obj, subscriber = user)
            if sub.is_active == True:
                return True
            return False
        except:
            return False
    
    def get_following(self, obj):
        request = self.context.get('request')
        user = request.user
        if obj == user:
            return True

        try:
            Follow = follow.objects.get(follower = user, creator = obj)
            return True
        except:
            return False
        
        
class search_users_serializer(serializers.ModelSerializer):
    publicPackage = publicPackage_serializer()
    class Meta:
        model = custom_profile
        fields = ['pk', 'username', 'bio', 'banner', 'pic', 'slug', publicPackage]
        
    #def get_classes(self, obj):
        #classes = publicPackage.objects.filter()



class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    redirect_url = serializers.CharField(max_length=500, required=False)

    class Meta:
        fields = ['email']
