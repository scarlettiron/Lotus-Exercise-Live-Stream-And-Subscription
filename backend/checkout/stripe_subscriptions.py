import stripe
from yoga.settings import SITE_NAME
from django.conf import settings
from .stripe_users import StripeCustomer
import pendulum

from userTransactions.models import UserTransactionItem
from siteTally.models import siteTransaction
from subscription.models import subscription_product, subscription

stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeSubscription:
    def __init__(self, creator, subscriber=None, 
                 localSubscriptionProduct=None, 
                 subscriptionObj = None, st_subscriptionId=None, st_intentId=None):

        self.creator = creator
        self.subscriber = subscriber
        self.localSubscriptionProduct = localSubscriptionProduct
        self.stSubscriptionId = st_subscriptionId
        self.localSubscriptionObj = subscriptionObj  
        self.stIntentId = st_intentId
        
        
    def findCreateSubProductId(self):
        try:
            productObj = subscription_product.objects.filter(user=self.creator).select_related('creator', 'subscriber')[0]
            self.localSubscriptionProduct = productObj
            return self
        
        except:
            try:
                #create stripe product object
                if self.creator.subscription_units > 50:
                    product = stripe.Product.create(
                        description = f'userId: {self.creator.pk} | type:creator subscription', 
                        name = f"userId: {self.creator.pk}",
                        shippable = False,
                        metadata = {
                            'type': 'subscription',
                            'site':settings.SITE_NAME,
                            'user_id':self.creator.pk
                        }
                        )
                else:
                    raise Exception("user subscription units must be greater than 50")
               
                try:
                    #create stripe price object for stripe product
                    price = stripe.Price.create(
                        product = product['id'],
                        unit_amount = self.creator.subscription_units,
                        currency = 'usd',
                        recurring = {
                            'interval':'month',
                            'interval_count':1
                            },
                        metadata = {
                        'site':settings.SITE_NAME,
                        'user_id':self.creator.pk,
                        }
                    )
                    #create local db record for product and price id's
                    newProduct = subscription_product.objects.create( 
                                st_productId = product['id'],
                                st_priceId = price['id'],
                                user = self.creator
                                )
                    self.localSubscriptionProduct = newProduct
                    return self
                except:
                    print('error creating new price or db product')
                    return False
            except:
                print('error creating st product')
                return False
            
    ### under construction ###     
    def updateStripeProductInfo(self):
            #under construction
        productId = self.creator.st_productId
        if not productId:
            raise Exception('local product id object required')
        try:
            newPrice = stripe.Product.modify(productId)
            return True
        except:
            return False
        
    #updates stripe price of subscription
    #price has to be updated first
    # returns True if successful, False otherwise
    def updateStripeProductPrice(self):
        try:
            priceId = self.localSubscriptionProduct.st_priceId
        except:
            raise Exception("need stripe price id")   
        try:
            units = self.creator.subscription_units
            newPrice = stripe.Price.modify(priceId, metadata = {'unit_amount':units})
            return True
        except:
            return False
        

        