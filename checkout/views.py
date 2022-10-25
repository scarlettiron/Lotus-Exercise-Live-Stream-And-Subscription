from rest_framework import generics
from rest_framework.response import Response
from classPackages.models import publicPackage
from subscription.models import subscription
from yoga.stripe_utils import stripeCustomer, buyPost, create_transaction_records, StripeUserSubscription, StripePostProduct, PuchaseLiveClass
from django.http import JsonResponse
import json

from rest_framework.response import Response
from subscription.serializers import subscription_serializer
from users.models import custom_profile 
from posts.models import post

from django.conf import settings
User = settings.AUTH_USER_MODEL

class purchase_post(generics.GenericAPIView):
    
    def post(self, request, *args, **kwargs):
        post_id = self.kwargs['postid']
        try:
            Post = post.objects.get(pk=post_id)
        except:
            return Response(status = 404)
        
        customer = stripeCustomer(request.user).findCreateCustomerId().stripeCustomer

        if customer:
            intent_promise = buyPost(Post, customer)
            if intent_promise:
                return JsonResponse(intent_promise, status=201, safe=False)
            else:
                return Response(status=400)
        else:
            return Response(status=400)
        
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
            return Response('could not find customer id', status=404)
        try:
            creator = custom_profile.objects.get(pk = creatorid)
        except:
            return Response('error finding creator')
        
        try:
            new_sub = StripeUserSubscription(creator=creator, subscriber = customer.stripeCustomer).findCreateSubProductId()
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
            return Response('class not found', statuc=404)
        
        customerInfo = stripeCustomer(request.user).findCreateCustomerId().stripeCustomer
        
        if not customerInfo:
            return Response('cannot find customer info', status=404)
        
        begin_purchase = PuchaseLiveClass(classObj=package, purchaser=request.user, stripeCustomer=customerInfo)
        purchase = begin_purchase.findCreateClassProductId()

        if not purchase:
            return Response('cannot find product', status=404)
        
        intent_promise = purchase.purchaseClass()
        
        if purchase:
            return JsonResponse(intent_promise, status=201, safe=False)
        return Response('error', status = 400)
        
        
    def put(self, request, *args, **kwargs):
        print("starting put request")
        st_intentId = request.data.get('payment_intentId', None)
        if not st_intentId:
            return Response('intent id needed', status = 400)
        
        try:
            Class = publicPackage.objects.get(pk=self.kwargs['classid'])
        except:
            return Response('cannot find class', status=404)
        
        purchase_process = PuchaseLiveClass(purchaser=request.user, st_intentId=st_intentId, classObj=Class)
        purchase = purchase_process.completePurchase()
        if purchase:
            appointments = purchase_process.createAppointment(requestData = request.data)
            print(appointments)
            if appointments:
                return JsonResponse({'status':"success"}, status = 201, safe=False)
            print("problem with appointments")
            return Response(status=400)
        print("no purchase")
        return Response(status=400)
    
    
class stripe_subscription_webhook(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        data = self.request.data
        if data['status'] == 'canceled':
            try:
                subObj = subscription.objects.filter(creator = data['metadata']['creator'], 
                                               subscriber = data['metadata']['subscriber']).select_related(
                                                   'creator', 'subscriber'
                                               )
            except:
                return Response(status = 401)
            
            sub = StripeUserSubscription(creator = subObj.creator, subscriber = subObj.subscriber)
            
            try:
                canceled = sub.cancelSubscriptionWebhook()
                if canceled:
                    return Response(status = 201)
                else:
                    return Response(status = 401)
            except:
                return Response(status = 401)
            
        return Response(status = 200)
        
        