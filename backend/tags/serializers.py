from dataclasses import fields
from rest_framework import serializers
from posts.models import post

class post_serializer(serializers.ModelSerializer):
    class Meta:
        model = post
        fields = '__all__'