from .stripe_utils import StripeUtil
import stripe
from .stripe_subscriptions import  CancelStripeSubscription, StripeUpdateSubscriptions, StripeSubscriptionCycles, StripeSubscriptionPurchase
from .stripe_users import StripeCustomer
from .stripe_local_transactions import StripeLocalTransactions
from .stripe_purchase_class import StripePurchaseClass
from .stripe_purchase_post import StripePostProduct
from users.models import custom_profile
from classPackages.models import publicPackage
from posts.models import post

from django.conf import settings

ST_PUBLIC = settings.STRIPE_PUBLISHABLE_KEY
ST_SECRET = settings.STRIPE_SECRET_KEY

ST_WEBHOOK_SECRET = settings.STRIPE_WEBHOOK_SECRET

# Default id of basic subscription plan
DEFAULT_SUBSCRIPTION_PLAN_ID = "default"


class StripeWebhookUtil(StripeUpdateSubscriptions, StripeSubscriptionCycles, StripeSubscriptionPurchase, StripeUtil):
    def __init__(self, request = None):
        self.request = request
        
        
        ### supported events ###
    # invoice.updated (occurs when an invoice is paid or failed)
    # subscription_schedule.created
    # invoice.payment_succeeded (['billing reason] = subscription)
    def webhook_handler(self, request):
        
        if ST_WEBHOOK_SECRET:
            # Retrieve the event by verifying the signature using the raw body and secret if webhook signing is configured.
            signature = request.headers.get('stripe-signature')
            
            try:
                event = stripe.Webhook.construct_event(
                    payload=request.body, sig_header=signature, secret=ST_WEBHOOK_SECRET)
                data = event['data']
            except Exception as e:
                print(e)
                return e
            event_type = event['type']
        else:
            data = request.data['data']
            event_type = request.data['type']

        data_object = data['object']
        meta = data_object['meta']
        print(event_type)
        
        if event['type'] == 'payment_intent.succeeded':
            purchaser = custom_profile.objects.get(pk=meta['purchaser'])
        if(meta['purchase_type'] == 'classPackage'):
            package = publicPackage.objects.get(pk=meta['obj_id'])
            purchase = StripePurchaseClass(purchaser, package, intent=data_object)
            purchase.create_transactions()
        
        if(meta['purchase_type'] == 'post'):
            p = post.objects.get(pk=meta['obj_id'])
            purchase = StripePostProduct(p, purchaser).create_transactions()
        
        ### Subscriptions ###
        if event_type == 'invoice.payment_succeeded':
            print("payment invoice.succeeded")
            #### billing reasons ###
            # subscription_created: when a users subscription is FIRST created
            # subscription_cycle: when a users subscription renews
            # subscription_update: when a new invoice is created due to a subscription being updated
             
            ### for initial purchase of subscription set default payment method
            if data_object['billing_reason'] == 'subscription_create':  
                self.webhook_subscription_set_default_payment_method(data_object)

            ### for updating local db objects when a users subscription renews
            if data_object['billing_reason'] == 'subscription_cycle':
                self.webhook_update_subscription_active(subscriptionId = data_object['subscription'])
                StripeLocalTransactions().create_transaction_webhook_subscription_cycle(data_object)

                

        if event_type == 'invoice.payment_failed':
            if data_object['billing_reason'] == 'subscription_cycle':
                canceled = CancelStripeSubscription(st_subscription_id = data_object['subscription']['id']).cancel_stripe_subscription_payment_failure()


        if event_type == 'customer.subscription.deleted':
            cancelled = CancelStripeSubscription.cancel_stripe_subscription_period_end(data_object['id'])

        # Successfully added users new default payment method
        if event_type == 'checkout.session.completed':
            StripeCustomer().new_default_payment_method(data_object)
            