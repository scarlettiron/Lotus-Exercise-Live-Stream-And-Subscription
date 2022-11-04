import stripe
from yoga.settings import SITE_NAME
from django.conf import settings
from .stripe_users import StripeCustomer

from classPackages.models import publicPackage
from userTransactions.models import UserTransactionItem
from siteTally.models import siteTransaction
from booking.models import classSessionId, appointment

stripe.api_key = settings.STRIPE_SECRET_KEY

#Requires post object#
class StripePostProduct:
    #post: post database object
    #localProductID: postProductId object, not reuired for initializing
    # but required for retreiving or modifying price
    #stPriceObj: stripe price object, not required for initializing, 
    #but is required for updating stripeObjPrice
    def __init__(self, post, purchaser, local_product_id=None, 
                 st_price_obj = None, intent = None):
        if not post:
            raise Exception("post database object required")
        self.post = post
        self.purchaser = purchaser
        self.local_product_id = local_product_id
        self.st_price_obj = st_price_obj
        self.intent = intent
        
        
    def create_intent(self):
        try:
            customer_info = StripeCustomer(self.purchaser).findCreateCustomerId()
            intent = stripe.PaymentIntent.create(
                amount = self.post.price_units,
                currency = 'usd',
                customer = customer_info.customerId,
                receipt_email = customer_info.customerEmail,
                metadata = {
                    'purchase_type': 'post',
                    'obj_id':self.post.pk,
                    'purchaser':self.purchaser.pk
                }
            )      
            return intent
        except:
            return False
        
        
        
    def create_transactions(self):
        customer_info = StripeCustomer(self.purchaser).findCreateCustomerId()
        try:
            price = int(self.intent['amount'])
            UserTransactionItem.objects.create(
                user = self.purchaser,
                units = price,
                is_payment = False,
                is_purchase = True,
                is_refund = False,
                post = self.post
            )
        
            #create record for creator
            UserTransactionItem.objects.create(
                user = self.post.user,
                units = price,
                is_payment = True,
                is_purchase = False,
                is_refund = False,
                post = self.post
            )
        except:
           return False
        
        try:
            siteTransaction.objects.create(
                st_transaction_id = self.intent['id'],
                customerId = customer_info.stripeCustomer,
                units = price,
                is_payment = True,
                is_refund = False,
                post = self.post
            )
            return True
        except:
           return False