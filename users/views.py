### Rest Framework imports ###
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics,  mixins, parsers, response

###Additional django imports ###
from django.shortcuts import get_object_or_404
from django.contrib.postgres.search import SearchQuery, SearchVector, SearchRank, TrigramSimilarity
from django.db.models import Q


from checkout.stripe_purchase_subscription import StripeUserSubscription

##Custom Code imports ###
from .models import custom_profile
from .serializers import profile_serializer, private_profile_serializer, create_user_serializer
from .mixins import IsCreatorOrReadOnly_Mixin





class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['user_id'] = user.id
        token['username'] = user.username
        token['is_instructor'] = user.is_instructor
        token['is_verified'] = user.is_verified
        token['email'] = user.email
        token['subscription'] = user.subscription
        token['bio'] = user.bio
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
    

    
### Get or update user ###
### for updating users subscription price: see update_subscription_price further down
class user_detail(IsCreatorOrReadOnly_Mixin, generics.GenericAPIView, mixins.RetrieveModelMixin, 
           mixins.UpdateModelMixin):
    queryset = custom_profile.objects.all()
    serializer_class = profile_serializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    lookup_field = 'username'
    
    def get_serializer_class(self, *args, **kwargs):
        username = self.kwargs['username']
        if self.request.user.username == username:
            return private_profile_serializer
        return profile_serializer
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
    
    
    

 
### get list of all users ###
class user_list(IsCreatorOrReadOnly_Mixin, generics.ListCreateAPIView):
    queryset = custom_profile.objects.all()
    serializer_class = profile_serializer
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return profile_serializer
        if self.request.method == 'POST':
            return create_user_serializer
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


### create a user ###
class create_user(generics.CreateAPIView):
    serializer_class = create_user_serializer
    
    def perform_create(self, serializer):
        if serializer.is_valid(raise_exception = True):
            serializer.save()
            return serializer.data['username']



class SearchUsersComplex(generics.ListAPIView):
    serializer_class = profile_serializer
    
    def get_queryset(self):
        
        q = self.request.GET.get('q', None)
        if not q:
            return custom_profile.objects.none()
        
        query_list = q.split(" ")
        complex_query = SearchQuery(query_list[0])
        trigams = TrigramSimilarity('username', str(query_list[0]))
        if len(query_list) > 1:
            for x in query_list[1:]:
                complex_query |= SearchQuery(x)
                trigams |= TrigramSimilarity(x)
        
        vector = SearchVector('tags__body', weight="C") + SearchVector('username', weight="A") 
        search_rank = SearchRank(vector, complex_query)
        
        users = custom_profile.objects.annotate(similarity = trigams,
            rank = search_rank).filter(Q(rank__gte=.05)| Q(similarity__gte = .01),
                                        is_active = True, is_verified = True, 
                                       is_instructor = True).distinct().order_by("-similarity", "-rank")
        
        return users


### search through all users ###
class SearchUsers(generics.ListAPIView):
    queryset = custom_profile.search.all()
    serializer_class = profile_serializer
    
    def get_queryset(self, *args, **kwargs):
        qs = super().get_queryset(*args,**kwargs)
        q = self.request.GET.get('q')
        if q is not None:
            search_results = qs.search_instructors(q)
            return search_results
        return custom_profile.objects.none()
 
 
#this view is specifically for updating user subscription price   
class update_subscription_price(IsCreatorOrReadOnly_Mixin ,generics.GenericAPIView):
    def put(self, request, *args, **kwargs):
        user = self.kwargs['pk']
        price = int(request.data.get('price', None))
        print(price)
        if type(price) is int and price > 50:
            user = custom_profile.objects.get(pk = user)
            user.subscription_units = price
            user.save()
            stripeSub = StripeUserSubscription(user).findCreateSubProductId().updateStripeProductPrice()
            if stripeSub:
                serializer =  profile_serializer(user, context={'request':request}).data
                return response.Response(serializer, status = 200)
        
        return response.Response(status = 404)
        



