### Rest Framework imports ###
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics,  mixins, parsers, response

###Additional django imports ###
from django.shortcuts import get_object_or_404

from yoga.stripe_utils import StripeUserSubscription

##Custom Code imports ###
from .models import custom_profile
from .serializers import profile_serializer, create_user_serializer, ResetPasswordEmailRequestSerializer
from .mixins import IsCreatorOrReadOnly_Mixin

from subscription.models import subscription_product




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
### for updating users subscription price: see update_subscription_price further down
class user_detail(IsCreatorOrReadOnly_Mixin, generics.GenericAPIView, mixins.RetrieveModelMixin, 
           mixins.UpdateModelMixin):
    queryset = custom_profile.objects.all()
    serializer_class = profile_serializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    lookup_field = 'username'
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
    
class updateUserPics(IsCreatorOrReadOnly_Mixin, generics.GenericAPIView):
    pass
 
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
            print('trying to update')
            user = custom_profile.objects.get(pk = user)
            user.subscription_units = price
            user.save()
            stripeSub = StripeUserSubscription(user).findCreateSubProductId().updateStripeProductPrice()
            if stripeSub:
                serializer =  profile_serializer(user, context={'request':request}).data
                return response.Response(serializer, status = 200)
        
        return response.Response(status = 404)
        



''' ### password reset endpoints ####
class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        email = request.data.get('email', '')

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            current_site = get_current_site(
                request=request).domain
            relativeLink = reverse(
                'password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})

            redirect_url = request.data.get('redirect_url', '')
            absurl = 'http://'+current_site + relativeLink
            email_body = 'Hello, \n Use link below to reset your password  \n' + \
                absurl+"?redirect_url="+redirect_url
            data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Reset your passsword'}
            Util.send_email(data)
        return Response({'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK) '''