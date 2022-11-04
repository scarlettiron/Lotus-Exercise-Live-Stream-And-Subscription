from rest_framework import generics
from rest_framework.response import Response
from classPackages.models import publicPackage
from django.http import JsonResponse
from decouple import config
import stripe
from .stripe_users import StripeCustomer
from .stripe_purchase_class import StripePurchaseClass
from .stripe_purchase_post import StripePostProduct
from .stripe_purchase_subscription import StripeUserSubscription

from rest_framework.response import Response
from subscription.serializers import subscription_serializer
from users.models import custom_profile 
from posts.models import post
from classPackages.models import publicPackage

from django.conf import settings
User = settings.AUTH_USER_MODEL

intent_success_webhook_secret = config('intent_success_webhook_secret')

class purchase_post(generics.GenericAPIView):
    
    def post(self, request, *args, **kwargs):
        post_id = self.kwargs['postid']
        try:
            Post = post.objects.get(pk=post_id)
        except:
            return Response(status = 404)
        
        intent_promise = StripePostProduct(Post, self.request.user).create_intent()
        if intent_promise:
            return JsonResponse(intent_promise, status=201, safe=False)
        else:
            return Response(status=400)
        

class purchase_subscription(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        creatorid = self.kwargs['creatorid']
        customer = StripeCustomer(request.user).findCreateCustomerId()
        if not customer:
            return Response('could not find customer id', status=404)
        try:
            creator = custom_profile.objects.get(pk = creatorid)
        except:
            return Response('error finding creator')
        
        try:
            new_sub =StripeUserSubscription(creator=creator, subscriber = customer.stripeCustomer).findCreateSubProductId()
            subDetails = new_sub.createUserSubscription()
        except:
            return Response('could not create subscription', status=400)
        

        return JsonResponse({'subscription_id':subDetails.st_subscription.id, 
                             'client_secret': subDetails.st_subscription.latest_invoice.payment_intent.client_secret},
                            status=201)
    
    def put(self, request, *args, **kwargs):
        subscription_id = request.data.get('subscription_id', None)
        intent_id = request.data.get('payment_intentId', None)
        if not subscription_id or not intent_id:
            return Response('subscription id and payment intent id required', status=401)
        
        creatorid = self.kwargs['creatorid']
        try:
            creator = custom_profile.objects.get(pk = creatorid)
        except:
            return Response('error finding creator', status=401)
        
        new_sub = StripeUserSubscription(creator=creator, subscriber=request.user,
                                        st_subscriptionId=subscription_id, 
                                         st_intentId=intent_id).finalizeBuySubscription().localSubscriptionObj
        serializer = subscription_serializer(new_sub).data
        return Response(serializer, status=201)
        


class purchase_class(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        classId = self.kwargs['classid']        
        try:
            package = publicPackage.objects.get(pk=classId)
        except:
            return Response('class not found', status=404)
        
        purchase = StripePurchaseClass(request.user, package)
        intent = purchase.create_intent(self.request.data['start_time'],self.request.data['end_time']).intent_id
        return JsonResponse(intent, status=201)
        
        

class webhook_endpoint(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        event = None
        payload = request.body
        sig_header =  request.META['HTTP_STRIPE_SIGNATURE']

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, intent_success_webhook_secret
            )
        
        except stripe.error.SignatureVerificationError as e:
            event = None
            print('Webhook signature verification failed.' + str(e))

        
        if not event or event['type'] != 'payment_intent.succeeded':
            return Response(status = 400)
        
        intent = event['data']['object']
        meta = intent['metadata']
        
        purchaser = custom_profile.objects.get(pk=meta['purchaser'])
        if(meta['purchase_type'] == 'classPackage'):
            package = publicPackage.objects.get(pk=meta['obj_id'])
            purchase = StripePurchaseClass(purchaser, package, intent=intent)
            purchase.create_transactions()
            purchase.create_appointments()
            return Response(status=201)
        
        if(meta['purchase_type'] == 'post'):
            p = post.objects.get(pk=meta['obj_id'])
            purchase = StripePostProduct(p, purchaser).create_transactions()
            return Response(status = 201)
            
        
        return Response(status=401)
        
        
