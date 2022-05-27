### Rest Framework imports ###
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics,  mixins, parsers

###Additional django imports ###
from django.shortcuts import get_object_or_404

##Custom Code imports ###
from .models import custom_profile
from .serializers import profile_serializer, create_user_serializer
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
    
    

    
### Get or update certain user ###
class user_detail(IsCreatorOrReadOnly_Mixin, generics.GenericAPIView, mixins.RetrieveModelMixin, 
           mixins.UpdateModelMixin):
    queryset = custom_profile.objects.all()
    serializer_class = profile_serializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.FileUploadParser]
    lookup_field = 'username'
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        data = self.request.body
        print(data)
        return self.partial_update(request, *args, **kwargs)
    
 
### get list of all users ###
class user_list(IsCreatorOrReadOnly_Mixin, generics.ListAPIView):
    queryset = custom_profile.objects.all()
    serializer_class = profile_serializer
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    """ def perform_create(self, serializer):
        if serializer.is_valid(raise_exception = True):
            serializer.save()
            return serializer.data
        print("Nope") """

    
"""    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return self.create(request, *args, **kwargs)  """


### create a user ###
class create_user(generics.CreateAPIView):
    serializer_class = create_user_serializer
    
    def perform_create(self, serializer):
        if serializer.is_valid(raise_exception = True):
            serializer.save()
            return serializer.data['username']



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
    
             