from rest_framework import serializers
from .models import verification

class verification_serializer(serializers.ModelSerializer):
    class Meta:
        model = verification
        fields = '__all__'