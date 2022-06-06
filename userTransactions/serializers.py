from dataclasses import fields

from subscription.models import subscription
from .models import UserTransactionItem

from subscription.serializers import subscription_serializer
from classPackages.serializers import classPckage_serializer

from rest_framework import serializers

class userTransaction_serializer(serializers.ModelSerializer):
    subscription = subscription_serializer(read_only = True)
    classPackage = classPckage_serializer(read_only = True)
    class Meta:
        model = UserTransactionItem
        fields = '__all__'