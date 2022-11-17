from rest_framework import serializers

from posts.models import postProductId
from users.models import customerId
from subscription.models import subscription_product

class customerId_serializer(serializers.ModelSerializer):
    class Meta:
        model = customerId
        fields = '__all__'
        
class postProductId_serializer(serializers.ModelSerializer):
    class Meta:
        model = postProductId
        fields = '__all__'
        
        
class subscriptionProduct_serializer(serializers.ModelSerializer):
    class Meta:
        model = subscription_product
        fields = '__all__'