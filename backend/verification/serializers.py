from rest_framework import serializers
from .models import Verification

class verification_serializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = '__all__'