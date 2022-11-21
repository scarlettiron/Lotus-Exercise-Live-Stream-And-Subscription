###rest framework imports ###
from xmlrpc.client import boolean
from django.forms import BooleanField
from rest_framework import generics, permissions, parsers
from rest_framework.response import Response
from django.db.models import Prefetch, Case, When,Count, Q, Value

### local imports ###
from .models import post
from .serializers import post_detail_serializer, post_list_serializer, profile_post_serializer, create_post_serializer, postProductId_serializer
from .mixins import IsOwnerOrReadOnly_Mixin

### imports from other apps in projects ###
from content.models import album, media, supportedMediaContentTypes as supportedTypes
from comments.models import comment


#Orders search results based by highest ranking score then trigram similarity
#if no results is found using the complex queries and vectors or trigrams, returns
#results using __icontains
class search_all_posts_complex(generics.ListAPIView):
    model = post
    queryset = post.search.filter()
    serializer_class = post_list_serializer
    
    def get_queryset(self, *args, **kwargs):
        q = self.request.GET.get('q', None)
        if not q:
            return Response(status = 404)
        
        q_list = q.split(" ")

        qs = super().get_queryset(*args, **kwargs)
        if self.request.user.is_authenticated:
            posts = qs.search_all_content_complex(q_list, user = self.request.user.pk)
        else:
            posts = qs.search_all_content_complex(q_list)
        return posts




# Return all posts in database #
class post_list(generics.ListAPIView):
    queryset = post.objects.all().order_by('-date')
    serializer_class = post_list_serializer
    permissions_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    

### User feed showing posts from creators user is following and subscribed to ###    
class post_feed(generics.ListAPIView):
    queryset = post.search.all()
    serializer_class = post_list_serializer
    
    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        if user.is_authenticated:
            qs = super().get_queryset(*args, **kwargs)
            search_results = qs.get_user_feed(user).select_related('user')
        else:
            search_results = post.objects.all().select_related('user').order_by('-date').annotate(liked = Value(0))
        return search_results
    

### Used for getting all of particular users's posts #   
class get_posts_profile(IsOwnerOrReadOnly_Mixin, generics.ListAPIView, generics.GenericAPIView):
    serializer_class = profile_post_serializer
    permissions_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.FileUploadParser]
    lookup_field = 'user'
    
    def get_queryset(self, *args, **kwargs):
        user = self.kwargs['user']
        try:
            qs = post.objects.filter(user__username=user).annotate(
                liked = Count('post_like', filter = Q(post_like__user__username = self.request.user.username))
                ).annotate(
                purchased = Count('usertransactionitem', filter = Q(usertransactionitem__user__username = self.request.user.username))
                ).select_related('user').order_by('-date')
        except:
            qs = post.objects.none() 

        return qs
    
    
    
    def post(self, request, *args, **kwargs):
        fileList = request.FILES.getlist('media', None)
        body = request.data.get('body', None)
        price = request.data.get('price', 0)
        is_subscription = request.data.get('is_subscription', False)
        
        if fileList:
            Album = album.objects.create(user = request.user)
            for file in fileList:
                try:
                    Type = supportedTypes.objects.get(type=file.content_type)
                except:
                    Album.delete()
                    return Response('unsupported file type', status=415)
                try:
                    media.objects.create(media=file, album = Album, media_type = Type)
                except:
                    return Response(status=400)
                
            Post = post(user=request.user, body=body, price_units=price, subscription=is_subscription, album=Album)
        else:
            Post = post(user=request.user, body=body, price_units=price, subscription=is_subscription)           
        try:
            Post.save()
        except:
            return Response(status=400)
        serializer = create_post_serializer(Post)
        return Response(serializer.data, status=201)

    

    
class post_detail_update_delete(IsOwnerOrReadOnly_Mixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = post_detail_serializer

    def get_queryset(self):
        pk = self.kwargs['pk']

        if self.request.user.is_authenticated:
            qs = post.objects.filter(pk=pk).annotate(
                liked = Count('post_like', filter=Q(post_like__user = self.request.user)),
                purchased = Count('usertransactionitem', filter = Q(usertransactionitem__user = self.request.user))
                ).select_related(
                'user', 'album'
                ).prefetch_related(
                Prefetch('comment_set', 
                        queryset = comment.objects.filter(post__pk = pk).select_related('user').order_by('-date'), to_attr='comments'),
                )
                
        else:

            qs = post.objects.filter(pk=pk).annotate(liked = Value(0), purchased = Value(0)).select_related(
                'user', 'album'
            ).prefetch_related(
                Prefetch('comment_set', 
                        queryset = comment.objects.filter(post__pk = pk).select_related('user').order_by('-date'), to_attr='comments'),
                )
            
        return qs
    
    
    def put(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    
    ''' def retrieve(self, request, *args, **kwargs):
        pk = self.kwargs['pk']
        modified_response =  super().retrieve(request, *args, **kwargs)  
        #get all comments on post
        try:     
            comments = comment.objects.filter(post__pk = pk).select_related('user').order_by('-date')
            serializer = get_comment_serializer(comments, many=True).data
        except:
            serializer = []
            
        
        modified_response.data['comments'] = serializer
        return modified_response '''
        
        
        
        

        