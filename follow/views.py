from cgitb import lookup
from rest_framework import generics, permissions, response

from .models import follow
from .mixins import Follow_Mixin
from .serializers import follow_serializer, followers_serializer, following_serializer
from .permissions import isFollowerOrReadOnly



class user_followers(Follow_Mixin, generics.ListAPIView):
    queryset = follow.objects.filter()
    serializer_class = followers_serializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self, *args, **kwargs):
        qs = follow.objects.filter(creator = self.request.user).select_related('follower')
        return qs


    
class following_users(Follow_Mixin, generics.ListCreateAPIView):
    queryset = follow.objects.all()
    serializer_class = following_serializer
    
    def get_queryset(self, *args, **kwargs):
        qs = follow.objects.filter(follower = self.request.user).select_related('creator')
        return qs
    
    def perform_create(self, serializer):
        data = self.request.data
        Follow = follow.objects.filter(creator = data['creator'], follower = self.request.user)
        if Follow.exists():
            return response.Response("Exists", status=201)
        
        serializer = follow_serializer(data=self.request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()

    


class delete_follow(Follow_Mixin, generics.DestroyAPIView):
    queryset = follow.objects.all()
    serializer_class = following_serializer
    lookup_field = ['creator']
    ## rewrite this
    def get_queryset(self, *args, **kwargs):
        creator = self.kwargs['creator_id']
        user = self.request.user
        try:
            Follow = follow.objects.filter(creator = creator, follower = user)
            return Follow
        except:
            return follow.objects.none()
    
    def perform_destroy(self, instance, *args, **kwargs):
        super().perform_destroy(instance)
        
