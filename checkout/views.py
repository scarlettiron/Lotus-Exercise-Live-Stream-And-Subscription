from rest_framework import generics
from rest_framework.response import Response
from classPackages.models import publicPackage
from yoga.stripe_utils import stripeCustomer, buyPost, create_transaction_records, StripeUserSubscription, StripePostProduct, PuchaseLiveClass
from django.http import JsonResponse
import json

from subscription.serializers import subscription_serializer
from users.models import custom_profile 
from posts.models import post


class purchase_post(generics.GenericAPIView):
    
    def post(self, request, *args, **kwargs):
        post_id = self.kwargs['postid']
        try:
            Post = post.objects.get(pk=post_id)
        except:
            return Response(status = 401)
        
        customer = stripeCustomer(request.user).findCreateCustomerId().stripeCustomer

        if customer:
            intent_promise = buyPost(Post, customer)
            if intent_promise:
                return JsonResponse(intent_promise, status=201, safe=False)
            else:
                return Response(status=401)
        else:
            return Response(status=401)
        
    def put(self, request, *args, **kwargs):
        intent = request.data.get('payment_intentId', None)
        if not intent:
            return Response(status=401)
        transaction = create_transaction_records(intent, request.user)
        if transaction:
            return Response(status = 201)
        else:
            return Response(status = 401)
        

class purchase_subscription(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        creatorid = self.kwargs['creatorid']
        customer = stripeCustomer(request.user).findCreateCustomerId()
        if not customer:
            return Response('could not find customer id', status=401)
        try:
            creator = custom_profile.objects.get(pk = creatorid)
        except:
            return Response('error finding creator')
        
        try:
            new_sub = StripeUserSubscription(creator=creator, subscriber = customer.stripeCustomer).findCreateSubProductId()
            subDetails = new_sub.createUserSubscription()
        except:
            return Response('could not create subscription', status=401)
        

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
            return Response('class not found', statuc=401)
        
        customerInfo = stripeCustomer(request.user).findCreateCustomerId()
        
        if not customerInfo:
            return Response('cannot find customer info', status=401)
        
        begin_purchase = PuchaseLiveClass(classObj=package, purchaser=request.user, stripeCustomer=customerInfo)
        purchase = begin_purchase.findCreateClassProductId()
        if not purchase:
            return Response('cannot find product', status=401)
        
        purchase.purchaseClass()
        
        if purchase:
            return Response(purchase, status = 201)
        return Response('error', status = 405)
        
        
    def put(self, request, *args, **kwargs):
        st_intentId = request.data.GET('st_intentId', None)
        
        if not st_intentId:
            return Response('intent id needed', status = 401)
        
        purchase = PuchaseLiveClass(purchaser=request.user, st_intentId=st_intentId).completePurchase()
        if purchase:
            return Response(status = 201)
        return Response(status=405)