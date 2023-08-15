from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from classPackages.models import publicPackage

from .stripe_users import StripeCustomer
from .stripe_purchase_class import StripePurchaseClass
from .stripe_purchase_post import StripePostProduct
from .stripe_subscriptions import StripeSubscriptionPurchase
from .stripe_products import StripeProducts
from .stripe_webhooks import StripeWebhookUtil

from rest_framework.response import Response
from users.models import custom_profile
from posts.models import post
from classPackages.models import publicPackage

from django.conf import settings
User = settings.AUTH_USER_MODEL


class purchase_post(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        post_id = self.kwargs['postid']
        try:
            Post = post.objects.get(pk=post_id)
        except:
            return Response(status = 404)
        
        intent_promise = StripePostProduct(Post, self.request.user).create_intent()
        if intent_promise:
            return Response(intent_promise, status=201)
        else:
            return Response(status=400)
        

class purchase_subscription(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
        
    def post(self, request, *args, **kwargs):
        creatorid = self.kwargs['creatorid']
       
        #find or create stripe customer id of subscriber
        buyer = custom_profile.objects.get(user = self.request.user)
        customer = StripeCustomer(buyer).findCreateCustomerId()
        
        if not customer:
            return Response('could not find customer id', status=404)
        
        try:
            creator = custom_profile.objects.get(pk = creatorid)
        except:
            return Response('error finding creator', status=404)
        
    
        try:
            # Find creator's stripe id for subscriptions
            # If creator does not already have one, create it
            #local object of creators subscription product
            new_subscription_product = StripeProducts(creatorObj = creator, type="subscription").findCreateSubProductId().localSubscriptionProduct
            
            # Create payment intent for subscription
            payment_intent = StripeSubscriptionPurchase(account = customer.account,
                                                       localProductObj = new_subscription_product,
                                                       creatorObj = creator).create_subscription_intent().st_subscription
        except:
            return Response('could not create subscription', status=400)
        
        # Return intent client secret to frontend for use with purchasing a subscription
        return Response({'client_secret': payment_intent.latest_invoice.payment_intent.client_secret},
                            status=201)
        


class purchase_class(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        classId = self.kwargs['classid']        
        try:
            package = publicPackage.objects.get(pk=classId)
        except:
            return Response('class not found', status=404)
        
        purchase = StripePurchaseClass(request.user, package)
        intent = purchase.create_intent(self.request.data['start_time'],self.request.data['end_time']).intent_id
        return Response(intent, status=201)
        
        
class StripeWebhookEndpoint(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        try:
            st = StripeWebhookUtil().webhook_handler(request)
        except:
            st = None
        return Response(status = 200)

        
