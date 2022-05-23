from dataclasses import fields
from .models import UserTransactionItem

from rest_framework import serializers

class userTransaction_serializer(serializers.ModelSerializer):
    class Meta:
        model = UserTransactionItem
        fields = '__all__'