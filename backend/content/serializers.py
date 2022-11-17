from rest_framework import serializers
from .models import album, media
from django.db.models import Count




class media_serializer(serializers.ModelSerializer):
    class Meta:
        model = media
        fields = ['pk', 'media', 'media_type', 'type']
        read_only_fields = ['type']


        
class album_serializer(serializers.ModelSerializer):
    album_media = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = album
        fields = ['pk','album_media']
        read_only_fields = ['album_media']
        
        
    def get_album_media(self, obj):
        media = obj.get_album_media()
        if media.count() == 1:
            serializer = media_serializer(media[0], many=False)
        else:
            serializer = media_serializer(media, many=True)
        return serializer.data
    

        
        