###rest framework imports ###
from rest_framework import generics, permissions, parsers
from rest_framework.response import Response
from django.db.models import Prefetch

### local imports ###
from .models import post
from .serializers import post_detail_serializer, post_list_serializer, profile_post_serializer, create_post_serializer, postProductId_serializer
from .mixins import IsOwnerOrReadOnly_Mixin

### imports from other apps in projects ###
from content.models import album, media, supportedMediaContentTypes as supportedTypes
from likeUnlike.models import post_like
from comments.serializers import get_comment_serializer
from comments.models import comment
from userTransactions.models import UserTransactionItem


# Return all posts in database #
class post_list(generics.ListAPIView):
    queryset = post.objects.all().order_by('-date')
    serializer_class = post_list_serializer
    permissions_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    



#!!!!!   DEV'S   !!!#
# I understand that using prefetch to search through post likes and purchases
#so that they are added to each individual post is a better solution for larger
#data sets. However I have a smaller dataset and am attempting to save on db 
#queries 

# search through all posts or through specific users posts for key words #   
class post_search(generics.ListAPIView):
    serializer_class = post_detail_serializer
    queryset = post.objects.all()
    
    def get_queryset(self, *args, **kwargs):
        qs = super().get_queryset(*args, **kwargs)
        q = self.request.GET.get('q')
        user = self.request.GET.get('username')

        if user and q:
            search_results = qs.search_users_posts(q, user)
            return search_results 
        elif not user and q:
            search_results = qs.search_all_content(q)
            return search_results 
        return post.objects.none()
    
    def list(self, request, *args, **kwargs):
        modified_response = super().list(request, *args, **kwargs)
        user = self.request.user
        
        q = self.request.GET.get('q')
        modified_response.data['q'] = q
        
        pks = []
        if(modified_response.data['count'] > 0):
            for x in modified_response.data['results']:
                pks.append(x['id'])
            
        try:
            likes = post_like.objects.filter(user = user, pk__in = pks).values_list('pk', flat=True)
        except:
            likes = []
        
        try:
            userPurchases = UserTransactionItem.objects.filter(user = user, pk__in = pks).values_list('post', flat=True)
        except:
            userPurchases = []
            
        modified_response.data['likes'] = likes
        modified_response.data['purchases'] = userPurchases
        
        return modified_response
    


#!!!!!   DEV'S   !!!#
# I understand that using prefetch to search through post likes and purchases
#so that they are added to each individual post is a better solution for larger
#data sets. However I have a smaller dataset and am attempting to save on db 
#queries 

### User feed showing posts from creators user is following and subscribed to ###    
class post_feed(generics.ListAPIView):
    queryset = post.search.all()
    serializer_class = post_detail_serializer
    
    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        if user.is_authenticated:
            qs = super().get_queryset(*args, **kwargs)
            search_results = qs.get_user_feed(user).select_related('user')
        else:
            search_results = post.objects.all().select_related('user').order_by('-date')
        return search_results
    
    def get(self, request, *args, **kwargs):
        modified_response = super().list(request, *args, **kwargs)
        user = self.request.user
        try:
            likes = post_like.objects.filter(user = user).values_list('id', flat=True)
        except:
            likes = []
        try:
            userPurchases = UserTransactionItem.objects.filter(user = user).values_list('post', flat=True)
        except:
            userPurchases = []
         
        modified_response.data['likes'] = likes
        modified_response.data['purchases'] = userPurchases
        return modified_response
    

#!!!!!   DEV'S   !!!#
# I understand that using prefetch to search through post likes and purchases
#so that they are added to each individual post is a better solution for larger
#data sets. However I have a smaller dataset and am attempting to save on db 
#queries 

### final draft    
class get_posts_exp(generics.ListAPIView, generics.GenericAPIView):
    serializer_class = profile_post_serializer
    permissions_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.FileUploadParser]
    lookup_field = 'user'
    
    ## add prefecth related data in here ###
    def get_queryset(self, *args, **kwargs):
        user = self.kwargs['user']
        try:
            qs = post.objects.filter(user__username=user).select_related('user').order_by('-date')
        except:
            qs = post.objects.none()
        return qs
    
    def get(self, request, *args, **kwargs):
        modified_response = self.list(request, *args, **kwargs)
        creator = self.kwargs['user']
        user = self.request.user
        
        #check to see if any user likes creators post
        try:
            likes = post_like.objects.filter(user = user, post__user__username = creator).values_list('post', flat=True)
        except:
            likes = []
        #check to see if user has purchased any of creators posts
        try:
            userPurchases = UserTransactionItem.objects.filter(user = user, post__user__username = creator).values_list('post', flat=True)
        except:
            userPurchases = []
            
        modified_response.data['likes'] = likes
        modified_response.data['purchases'] = userPurchases
        return modified_response
    
    
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

    
 
#!!!!!   DEV'S   !!!#
# I understand that using prefetch to search through post likes and purchases
#so that they are added to each individual post is a better solution for larger
#data sets. However I have a smaller dataset and am attempting to save on db 
#queries 
    
class post_detail_update_delete( IsOwnerOrReadOnly_Mixin,generics.RetrieveUpdateDestroyAPIView):
    serializer_class = post_detail_serializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        qs = post.objects.filter(pk=pk).select_related(
            'user', 'album'
            ).prefetch_related(
            Prefetch('comment_set', 
                     queryset = comment.objects.filter(post__pk = pk).select_related('user').order_by('-date'), to_attr='comments'),
            )
        return qs
    
    def retrieve(self, request, *args, **kwargs):
        pk = self.kwargs['pk']
        modified_response =  super().retrieve(request, *args, **kwargs)  
        
        # get if user has liked the post
        try:
            likes = post_like.objects.filter(user = self.request.user, post__pk = pk).values_list('pk', flat=True)
        except:
            likes = []
            
        #check to see if user purchased post
        try:
            userPurchases = UserTransactionItem.objects.filter(post__pk = pk).values_list('post', flat=True)
        except:
            userPurchases = []

        modified_response.data['likes'] = likes
        modified_response.data['purchases'] = userPurchases
        return modified_response
        
    def put(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
        
        
        

#!!!!!   DEV'S   !!!#
# I understand that using prefetch to search through post likes and purchases
#so that they are added to each individual post is a better solution for larger
#data sets. However I have a smaller dataset and am attempting to save on db 
#queries 
## search through all posts on a site that are not included in subscription
class search_all_posts(generics.ListAPIView):
    queryset = post.search.filter()
    
    def get_queryset(self, request, *args, **kwargs):
        qs = super().get_queryset(*args, **kwargs)
        q = self.request.GET.get('q')
        results = qs.search_all_content(q)
        return results
    
    
    def list(self, request, *args, **kwargs):
        modified_response = super().list(request, *args, **kwargs)
        user = self.request.user
        
        q = self.request.GET.get('q')
        modified_response.data['q'] = q
        
        pks = []
        if(modified_response.data['count'] > 0):
            for x in modified_response.data['results']:
                pks.append(x['id'])
        
        try:
            likes = post_like.objects.filter(user = user, pk__in = pks).values_list('pk', flat=True)
        except:
            likes = []
            
        try:
            userPurchases = UserTransactionItem.objects.filter(user = user, pk__in = pks).values_list('post', flat=True)
        except:
            userPurchases = []
        
        modified_response.data['likes'] = likes
        modified_response.data['purchases'] = userPurchases
        
        return modified_response    
        
        
