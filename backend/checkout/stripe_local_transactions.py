import stripe
from yoga.settings import SITE_NAME
from django.conf import settings
from .stripe_users import StripeCustomer
import pendulum

from userTransactions.models import UserTransactionItem
from siteTally.models import siteTransaction
from subscription.models import subscription_product, subscription

class StripeLocalTransactions:
    def __init__(self):
        return self
    
    def create_transaction_webhook_subscription_cycle(self, invoice):
        sub_id = invoice['subscription']
        
        st_sub = stripe.Subscription.retrieve(sub_id)
        local_sub = subscription.objects.filter(creator = st_sub['metadata']['creator'], subsciber = st_sub['metadata']['subscriber']).select_related(
        'creator', 'subscriber')[0]  
        
        self.creator = local_sub.creator
        self.subscriber = local_sub.subscriber 
        self.localSubscriptionObj = local_sub  
        
        CustomerId = StripeCustomer(self.subscriber).findCreateCustomerId()
        
        try:
            price = int(invoice['amount'])
            UserTransactionItem.objects.create(
                user = self.subscriber,
                units = price,
                is_payment = False,
                is_purchase = True,
                is_refund = False,
                subscription = self.localSubscriptionObj
            )
        
            #create record for creator
            UserTransactionItem.objects.create(
                user = self.creator,
                units = price,
                is_payment = True,
                is_purchase = False,
                is_refund = False,
                subscription = self.localSubscriptionObj
            )
        except:
            return False
        
        try:
            siteTransaction.objects.create(
                st_transaction_id = invoice['id'],
                customerId = CustomerId.stripeCustomer,
                units = price,
                is_payment = True,
                is_refund = False,
                subscription = self.localSubscriptionObj
            )
            return True
        except:
            return False    