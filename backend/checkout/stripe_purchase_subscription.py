import stripe
from yoga.settings import SITE_NAME
from django.conf import settings
from .stripe_users import StripeCustomer
import pendulum

from userTransactions.models import UserTransactionItem
from siteTally.models import siteTransaction
from subscription.models import subscription_product, subscription

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeUserSubscription:
    #creator: required creator(User) db object which the user is subscribing to
    #subscriber: optional subscriber(User) db object of the subscriber
    #local subscriptionProductId obj, see findCreateSubProductId
    def __init__(self, creator=None, subscriber=None, 
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
    
    
    def createUserSubscription(self):
        if not self.subscriber:
            raise Exception('subscriber obj required')
        try:
            new_sub = stripe.Subscription.create(
                customer = self.subscriber.customerId,
                items = [{'price':self.localSubscriptionProduct.st_priceId}],
                payment_behavior='default_incomplete',
                expand=['latest_invoice.payment_intent'],
                metadata={
                    'creater':self.creator.pk,
                    'subscriber':self.subscriber.pk,
                    'site':SITE_NAME,
                }
            )
            self.st_subscription = new_sub
            return self
        except Exception as e:
            print(e)
            return False
        
        
    def create_transaction_records(stripe_subscription, self):
        if not stripe_subscription or not self.creator or not self.subscriber:
            raise Exception('need payment intent id, user obj and post obj')

        CustomerId = StripeCustomer(self.subscriber).findCreateCustomerId()
        invoice = stripe_subscription['latest_invoice']

        if invoice['status'] == 'succeeded': 
            try:
                price = int(invoice['amount'])
                UserTransactionItem.objects.create(
                    user = self.subscriber,
                    units = price,
                    is_payment = False,
                    is_purchase = True,
                    is_refund = False,
                    subscription = invoice['metadata']['subscription']
                )
            
                #create record for creator
                UserTransactionItem.objects.create(
                    user = self.creator,
                    units = price,
                    is_payment = True,
                    is_purchase = False,
                    is_refund = False,
                    subscription = invoice['metadata']['subscription']
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
                    subscription = invoice['metadata']['subscription']
                )
                return True
            except:
                return False
            
    def finalizeBuySubscription(self):
        if not self.stSubscriptionId or not self.stIntentId:
            raise Exception('stripe subscription id and stripe payment intent id required')
        try:
            intent = stripe.PaymentIntent.retrieve(self.stIntentId)
        except:
            return False
        try:
            st_subscription = stripe.Subscription.modify(self.stSubscriptionId, 
                                                      default_payment_method = intent['payment_method'])
        except:
            return False
                       
        begin_date = pendulum.now('utc').to_iso8601_string()
        end_date = pendulum.now('utc').add(months=1).to_iso8601_string()
        
        try:
            localSub = subscription.objects.get(creator = self.creator, subscriber = self.subscriber)
            localSub.begin_date = begin_date
            localSub.end_date =  end_date
            localSub.st_subId= self.stSubscriptionId
            localSub.is_active = True
            localSub.save()
            self.localSubscriptionObj = localSub
            return self
        except:
            try:
                localSub = subscription.objects.create(creator = self.creator, 
                                                    subscriber = self.subscriber,
                                                    begin_date = begin_date,
                                                    end_date = end_date,
                                                    st_subId = self.stSubscriptionId)
                self.localSubscriptionObj = localSub
                return self 
            except:
                print('unable to create local subscription object')
                return False

    def cancelSubscriptionSchedule(self):
        if not self.creator or not self.subscriber:
            raise Exception('creator and subscriber required')
        try:
            sub = subscription.objects.get(creator=self.creator, subscriber=self.subscriber)
        except:
            print('unable to find subscription')
            return False
        
        try:
            st_sub = stripe.Subscription.modify(sub.st_subId, cancel_at_period_end=True)
            print(st_sub)
            
        except:
            print('unable to find stripe subscription object')
            return False
        
        try:
            sub.is_renewed = False
            sub.save()
            return sub
        except:
            return False
        
        
    # for use with webwook when subscription cancelation has been received
    def cancelSubscriptionWebhook(self):
        if not self.creator or not self.subscriber:
            raise Exception('creator and subscriber required')
        try:
            sub = subscription.objects(creator=self.creator, subscriber=self.subscriber)
        except:
            print('unable to find subscription')
            return False
        
        try:
            sub.is_active = False
            sub.save()
            return sub
        except:
            return False
        
    def create_transaction_webhook(self, invoice):
        if invoice['billing_reason'] == 'subscription_cycle':
            
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
            
            