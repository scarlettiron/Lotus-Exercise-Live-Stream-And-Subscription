
from rest_framework import generics
from rest_framework.response import Response
from checkout.stripe_purchase_subscription import StripeUserSubscription
import json

from django.conf import settings
User = settings.AUTH_USER_MODEL
from users.models import custom_profile

from django.db.models import Count

from subscription.models import subscription

from .serializers import subscription_serializer, subscribers_serializer, subscriptions_serializer
from .mixins import subscriptionMixin

class subscription_list(subscriptionMixin, generics.ListAPIView):
    queryset = subscription.objects.all()
    serializer_class = subscription_serializer
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
        
        
class subscription_detail(subscriptionMixin, generics.GenericAPIView):
    queryset = subscription.objects.all()
    serializer_class = subscription_serializer
    
    def put(self, request, *args, **kwargs):
        data = self.request.data
        creator = data.pop('creator')
        user = self.request.user
        try:
            Subscription = subscription.objects.filter(creator=creator, subscriber = user)[0]
        except:
            return Response(status = 404)    
        serializer = subscription_serializer(Subscription, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = 200)
        print(serializer.errors)
        return Response(serializer.errors)


class creator_subscribers(subscriptionMixin, generics.ListAPIView):
    queryset = subscription.objects.all()
    serializer_class = subscribers_serializer
    
    def get_queryset(self, *args, **kwargs):
        qs = subscription.objects.select_related('subscriber').filter(creator = self.request.user)
        return qs
    
    def get(self, request, *args, **kwargs):
       return self.list(request, *args, **kwargs)
        

class user_subscriptions(subscriptionMixin, generics.ListAPIView):
    queryset = subscription.objects.filter().select_related('creator')
    serializer_class = subscriptions_serializer
    
    def get_queryset(self, *args, **kwargs):
       qs = subscription.objects.filter(subscriber = self.request.user).select_related('creator') 
       return qs
   
   
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class cancel_subscription(generics.GenericAPIView):
    serializer_class = subscription_serializer
    
    def put(self, request, *args, **kwargs):
        creator_id = self.kwargs['creatorid']
        try:
            creator = custom_profile.objects.get(pk=creator_id)
        except:
            return Response('could not find creator', status=401)
        
        sub = StripeUserSubscription(creator=creator, subscriber=request.user).cancelSubscriptionSchedule()
        if sub:
            payload = subscription_serializer(sub).data
            return Response(payload, status=204)
        payload = json.dumps(sub)
        return Response(payload, status=401)

        

        

  