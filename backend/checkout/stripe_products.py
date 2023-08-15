import stripe
from subscription.models import subscription_product
from django.conf import settings

ST_PUBLIC = settings.STRIPE_PUBLISHABLE_KEY
ST_SECRET = settings.STRIPE_SECRET_KEY

ST_WEBHOOK_SECRET = settings.STRIPE_WEBHOOK_SECRET

# Default id of basic subscription plan
DEFAULT_SUBSCRIPTION_PLAN_ID = "default"


class StripeProducts:
    def __init__(self, creatorObj = None, type = None,
                 st_subscriptionId = None, creatorSubscriptionObj = None):
        self.creatorObj = creatorObj
        self.creatorSubscriptionObj = creatorSubscriptionObj
        self.type = type
        self.st_subscriptionId = st_subscriptionId
        
        self.meta = {
            'type':type,
            'creator_id':creatorObj.pk
        }
    
    #Find creators subscription product id
    # if user does not have subscription product id, create one 
    def findCreateSubProductId(self):
        try:
            productObj = subscription_product.objects.filter(user=self.creatorObj)
            self.localSubscriptionProduct = productObj
            return self
        
        except:
            try:
                #create stripe product object
                if self.creatorObj.subscription_units > 50:
                    product = stripe.Product.create(
                        description = f'userId: {self.creator.pk} | type:creator subscription', 
                        name = f"userId: {self.creator.pk}",
                        shippable = False,
                        metadata = self.meta
                        )
                else:
                    raise Exception("user subscription units must be greater than 50")
               
                try:
                    #create stripe price object for stripe product
                    price = stripe.Price.create(
                        product = product['id'],
                        unit_amount = self.creatorObj.subscription_units,
                        currency = 'usd',
                        recurring = {
                            'interval':'month',
                            'interval_count':1
                            },
                        metadata = self.meta
                    )
                    
                    #create local db record for product and price id's
                    newProduct = subscription_product.objects.create( 
                                st_productId = product['id'],
                                st_priceId = price['id'],
                                user = self.creatorObj
                                )
                    self.localSubscriptionProduct = newProduct
                    return self
                except:
                    print('error creating new price or db product')
                    return False
            except:
                print('error creating st product')
                return False