from rest_framework import generics, permissions

from .models import post_like
from .serializers import post_like_serializer, post_like_prefetch_serializer
from .mixins import IsOwnerOrReadOnly_Mixin

from django.shortcuts import get_object_or_404


class create_list_like(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    queryset = post_like.objects.filter().select_related('post').order_by('-id')
    serializer_class = post_like_serializer
    lookup_field = ['user']
    
    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == 'GET':
            return post_like_prefetch_serializer
        return post_like_serializer



class detail_delete_like(IsOwnerOrReadOnly_Mixin, generics.DestroyAPIView):
    queryset = post_like.objects.filter()
    multiple_lookup_fields = ['post', 'user']
    
    def get_object(self):
        queryset = self.get_queryset()
        filter = {}
        for field in self.multiple_lookup_fields:
            filter[field] = self.kwargs[field]

        obj = get_object_or_404(queryset, **filter)
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)

        
        