from rest_framework import generics, response
from .models import tag
from .serializers import post_serializer

from posts.models import post

from django.db.models import OuterRef, Subquery, Q, Count


## not in use ###
''' class searchByTags(generics.GenericAPIView):
    serializer_class = post_serializer
    
    def get(self, request, *args, **kwargs):
        search_list = ['purple', 'mountain', 'flowers']
        
        #qs = post.objects.annotate(num_of_tags = Subquery(tags.objects.filter(post__pk = OuterRef('pk'), tag__body__in = search_list))).filter(num_of_tags__gt = 0).order_by('num_of_tags')
        ###semi works
        ###qs = post.objects.annotate(num_of_tags = Count(Subquery(tags.objects.filter(post = OuterRef('pk'), tag__body__in = search_list).only('pk')))).filter(num_of_tags__gt = 0)
    
        subquery = len(tags.objects.filter(post = OuterRef('pk'), tag__body__in = search_list).only('pk').values_list('pk'))
        qs = post.objects.annotate(num_of_tags = Subquery(subquery))
        serializer = post_serializer(qs, many=True)
        return response.Response(serializer.data, status=200) '''
