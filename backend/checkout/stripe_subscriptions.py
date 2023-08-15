import stripe
from subscription.models import subscription
from .stripe_utils import StripeUtil

from django.conf import settings

ST_PUBLIC = settings.STRIPE_PUBLISHABLE_KEY
ST_SECRET = settings.STRIPE_SECRET_KEY

ST_WEBHOOK_SECRET = settings.STRIPE_WEBHOOK_SECRET

# Default id of basic subscription plan
DEFAULT_SUBSCRIPTION_PLAN_ID = "default"


class StripeUpdateSubscriptions(StripeUtil):
    def __init__(self, st_subscriptionId = None, localSubscriptionObject = None,
                 st_subscriptionObj = None, account = None):
        self.st_subscriptionId = st_subscriptionId
        self.localSubscriptionObj = localSubscriptionObject
        self.st_subscriptionObj= st_subscriptionObj
        self.account = account
        
        return self

    def get_objects(self):
        self.st_subscriptionObj = stripe.Subscription.retrieve(self.st_subscriptionId)
        return self
        
           
class StripeSubscriptionCycles(StripeUtil):
    def __init__(self, subscription = None,
                 st_subscription = None, buyer = None,
                 creator = None, product = None,
                 meta = None):
        # local subscription_product
        self.product = product
        #local subscription object SubscriptionDetail
        self.subscription = subscription
        #Stripe object for stripe subscription
        self.st_subscription = st_subscription
        # Local object of creator
        self.creator = creator
        # Local object of subscriber
        self.buyer = buyer
        #For adding metadata to Stripes objects
        self.meta = meta
        
        return self
        
        
    ###For webhook
    ###If NEW stripe subscription is being created for the first time
    def initial_update_local_accounts_and_subscriptions(self, creatorId, buyerId, stripe_subscription):
        localSubscriptionObj = subscription.objects.filter(subscriber__pk = buyerId, creator__pk = creatorId, st_subscriptionId = stripe_subscription['id']).select_related('subscriber', 'creator')[0]
        
        timestamps = self.get_subscription_timestamps({"beginning":stripe_subscription["current_period_start"],
                                                       "ending":stripe_subscription["current_period_end"]})
        localSubscriptionObj.begin_date = timestamps["beginning"]
        localSubscriptionObj.end_date = timestamps["ending"]
        localSubscriptionObj.is_active = True
        localSubscriptionObj.is_renewed = True
        localSubscriptionObj.save()
        
        if not localSubscriptionObj.subscriber.has_default_payment_method:
            localSubscriptionObj.subscriber.has_default_payment_method = True
            localSubscriptionObj.subscriber.save()
        
        
    ### use with webhook
    ### if billing reason is "subscription create"   
    def webhook_subscription_set_default_payment_method(self, stInvoice):
        
            subscription_id = stInvoice['subscription']
            payment_intent_id = stInvoice['payment_intent']

            # Retrieve the payment intent used to pay the subscription
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            print(payment_intent)
            print(payment_intent['charges']['data'][0]['payment_method'])
            print(payment_intent['payment_method'])
            
            # Set the default payment method for subscription
            stripe.Subscription.modify(
              subscription_id,
              default_payment_method=payment_intent['payment_method']
            )
            
            #set default payment method for customer
            stripe.Customer.modify(
                payment_intent["customer"],
                default_source = payment_intent['payment_method'],
                invoice_settings = {"default_payment_method" : payment_intent['payment_method']}
                )
            
            #retrieve the stripe subscription obj
            st_sub = stripe.Subscription.retrieve(subscription_id)
            creatorId = st_sub['metadata']['creator']
            buyerId = st_sub['metadata']['buyer']
            
            self.initial_update_local_accounts_and_subscriptions(creatorId, buyerId, st_sub)
     
    ### Use with webhook    
    ### for subscription subscription_schedule.created
    ### updates timestamps on local subscription object
    def webhook_update_subscription_active(self, subscription_schedule = None, subscriptionId = None):
        if subscription_schedule:
            subscriptionId = subscription_schedule['object']['id']

        st_subscription = stripe.Subscription.get(subscriptionId)
        st_sub_end = st_subscription["current_period_end"]
        st_sub_beginning = st_subscription["current_period_start"]
        
        creator = st_subscription['metadata']["creator"]
        buyer = st_subscription['metadata']['buyer']
        localSubscription = subscription.objects.filter(creator__pk = creator, subscriber__pk = buyer).select_related('creator', 'subscriber')
        
        timestamps = self.get_subscription_timestamps(stripe_timestamps={"beginning":st_sub_beginning, 
                                                        "ending":st_sub_end})
        
        localSubscription.begin_date = timestamps["beginning"]
        localSubscription.end_date = timestamps["ending"]
        localSubscription.is_active = True
        localSubscription.is_renewed = True
        localSubscription.save()



class CancelStripeSubscription(StripeUtil):
    def __init__(self, account = None, localSubscriptionObj = None,
                 st_subscription_id = None, st_subscription = None):
        self.account = account
        self.localSubscriptionObj = localSubscriptionObj
        self.st_subscription_id = st_subscription_id
        self.st_subscription = st_subscription
        return self
    
    
        ### for when subscription payments fail
    def handle_local_subscription_error():
        pass
    
    def schedule_stripe_subscription_cancellation(self):
        if not self.st_subscription_id or not self.localSubscriptionObj:
            raise Exception("Stripe Subscription Id and requesting users account object required")
        
        st_subscription = stripe.Subscription.modify(self.st_subscription_id,
                                                     cancel_at_period_end = True)
        
        self.localSubscriptionObj.is_renewed = False
        self.localSubscriptionObj.save()
    
    ### For webhook
    ### when subscription is ended at period end
    def cancel_stripe_subscription_period_end(st_subscriptionId):
        canceled = stripe.Subscription.delete(st_subscriptionId)
        
        if canceled:
            #Update local subscription object to roll back to default
            
            localSubscription = subscription.objects.get(st_subscriptionId = st_subscriptionId)
            localSubscription.st_subscriptionId = None
            localSubscription.is_active = False
            localSubscription.is_renewed = False
            localSubscription.save()
    
    ### Upon payment failure ###
    ### requires users account object and stripe_subscription_id
    def cancel_stripe_subscription_payment_failure(self):
        if not self.st_subscription_id:
            raise Exception("Stripe Subscription Id required")
        
        canceled = stripe.Subscription.delete(self.st_subscription_id)
        print(canceled)
        if canceled:
            #Update local subscription objects
            sub = subscription.objects.get(st_subscriptionId = self.st_subscription_id)
            sub.is_active = False
            sub.is_renewed = False
            sub.st_subscriptionId = None
            sub.save()
            
        self.handle_local_subscription_error()


class StripeSubscriptionPurchase:
    def __init__(self, plan = None, subscription = None,
                 st_subscription = None, account = None,
                 creatorId = None,creatorObj = None,
                 meta = None, localProductObj = None):
        #local object subscription_product
        self.localProductObj = localProductObj
        #local subscription object subscription
        self.subscription = subscription
        #Stripe object for stripe subscription
        self.st_subscription = st_subscription
        # local object custom_profile (Is Purchaser in most instances)
        self.account = account
        # creator object
        self.creatorObj = creatorObj
        
        # creator object id
        if creatorObj:
            self.creatorId = creatorObj
        else:
            self.creatorId = creatorId
            
        #For adding metadata to Stripes objects
        self.meta = {
            'buyer':self.account.pk,
            'creator':self.creatorId,
            'account_id':self.account.pk
        }
        
        return self
  
        
    ## STEP 1 ##
    # Initialize creation of subscription
    # returns a payment intent for stripe subscription   
    def create_subscription_intent(self):
        if not self.account or not self.creatorObj or not self.localProductObj:
            raise Exception('account obj and plan objs required')
        try:
            new_sub = stripe.Subscription.create(
                customer = self.account.customerId,
                items = [{'price':self.localProductObj.st_priceId}],
                payment_behavior='default_incomplete',
                expand=['latest_invoice.payment_intent'],
                metadata=self.meta
            )
            #Create or update local subscription 
            #Update account subscription to be new subscription
            if new_sub:
                ### create new local subscription object
                subscription.objects.create(
                    creator = self.creatorObj,
                    st_subscriptionId = new_sub['id'],
                    account_id = str(self.account.pk),
                    is_active = False,
                    is_renewed = False
                ) 
                
            self.st_subscription = new_sub
            
            return self
        
        except Exception as e:
            print(e)
            return False
    
    