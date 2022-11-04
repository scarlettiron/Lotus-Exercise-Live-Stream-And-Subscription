
import stripe
from django.conf import settings
from datetime import datetime, timedelta
from classPackages.models import hours, month, publicPackage, publicPackageProductId
from booking.models import classSessionId, appointment

from users.models import customerId
from posts.models import  post, postProductId
from subscription.models import subscription, subscription_product
from userTransactions.models import UserTransactionItem
from siteTally.models import siteTransaction

import pendulum
from django.utils.dateparse import parse_datetime
from dateutil.parser import *

from yoga.settings import SITE_NAME

stripe.api_key = settings.STRIPE_SECRET_KEY


#Requires post object#
class StripePostProduct:
    #post: post database object
    #localProductID: postProductId object, not reuired for initializing
    # but required for retreiving or modifying price
    #stPriceObj: stripe price object, not required for initializing, 
    #but is required for updating stripeObjPrice
    def __init__(self, post, localProductID=None, stPriceObj = None):
        if not post:
            raise Exception("post database object required")
        self.post = post
        self.localProductID = localProductID
        self.stPriceObj = stPriceObj
     
    # finds or creates post product id
    # if product does not exist, creates stripe product id and stripe price id based
    # on post information
    # returns postProductId object if successful, False otherwise      
    def findCreatePostProductId(self):
        try:
            productId = postProductId.objects.get(post=self.post)
            self.localProductID = productId
            return self
        
        except:
            try:
                #create stripe product object
                product = stripe.Product.create(
                    description = f'postId: {self.post.pk} | type:post', 
                    name = f"postId: {self.post.pk}",
                    shippable = False,
                    url = self.post.url,
                    metadata = {
                        'site':settings.SITE_NAME,
                        'post_id':self.post.pk,
                        'user_id':self.post.user.pk,
                    }
                    )
               
                try:
                    #create stripe price object for stripe product
                    price = stripe.Price.create(
                        product = product['id'],
                        unit_amount = self.post.price_units,
                        currency = 'usd',
                                            metadata = {
                        'site':settings.SITE_NAME,
                        'post_id':self.post.pk,
                        'user_id':self.post.user.pk,
                        }
                    )
                    
                    #create local db record for product and price id's
                    newProduct = postProductId.objects.create( 
                                st_productId = product['id'],
                                st_priceId = price['id'],
                                creator = self.post.user,
                                post = self.post
                                )
                    self.localProductID = newProduct
                    return self
                except:
                    print('error creating new price or db product')
                    return False
            except:
                print('error creating st product')
                return False
      
    def retreiveStripePriceObj(self, *args, **kwargs):
        productId = self.localProductID.st_priceId
        if not productId:
            raise Exception('local product id object required')
        try:
            self.stPriceObj = stripe.Price.retrieve(productId)
        except:
            return False
        return self.stPriceObj
    
    def updateStripeProductInfo(self):
        productId = self.localProductID.st_priceId
        if not productId:
            raise Exception('local product id object required')
        try:
            newPrice = stripe.Price.modify(productId)
            return True
        except:
            return False
    
    
    #updates stripe price of post
    #post price has to be updated first
    # returns True if successful, False otherwise
    def updateStripeProductPrice(self):
        try:
            productId = postProductId.objects.get(post=self.post)
        except:
            raise Exception("post does not have existing product id")
        try:
            stripe.Price.modify(productId.st_priceId, 
                                unit_amount = self.post.price_units)
            return True
        except:
            return False
        


def buySubscriptionv2(customer, creator):
    try:
        intent = stripe.PaymentIntent.create(
            amount = creator.subscription_units,
            automatic_payment_methods = True,
            currency = 'usd',
            customer = customer.st_customerId,
            receipt_email = creator.user.email,
            setup_future_usage = 'off_session',
            confirm = True,
            metadata = {
                'type' :'subscription',
                'subscriber':customer.user.id,
                'creator': creator.id,
                'site':settings.SITE_NAME,
            }
        )
    
    except stripe.error.CardError as e:
        err = e.error
        # Error code will be authentication_required if authentication is needed
        print("Code is: %s" % err.code)
        payment_intent_id = err.payment_intent['id']
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        
        
