from sys import meta_path
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




#requires the user object
class stripeCustomer:
    
    def __init__(self, user, stripeCustomer=None, stripePaymentMethodId=None):
        if not user:
            raise Exception("user object required")
        self.user = user
        self.stripeCustomer = stripeCustomer
        self.stripePaymentMethodId = stripePaymentMethodId 
    #finds if user has stripe customer id
    #if found returns local customerId object
    #if not found creates stripe customer object, then local customerId object
    #returns local customerId object if successful, False otherwise       
    def findCreateCustomerId(self):
        try:
            custId = customerId.objects.get(user = self.user)
            self.stripeCustomer = custId
            return self
        except:
            try:
                customer = stripe.Customer.create(
                    description = f'{self.user.id}', 
                    email = self.user.email,
                    name = f"{self.user.first_name} {self.user.last_name}",
                    metadata = {
                        'site':settings.SITE_NAME,
                        'user_id':self.user.pk,
                    }
                    )

                #add default source of payment somehow default_source='payment source'
                newCustomer = customerId.objects.create(user=self.user, 
                                                        customerEmail=self.user.email, 
                                                        customerId=customer['id'])
                self.stripeCustomer = newCustomer
                return self
            except:
                return False

    def addCustomerPaymentMethod(self):
        ''' if not self.stripeCustomer or not self.stripePaymentMethodId:
                       methods = stripe.PaymentMethod.list(customer = self.stripeCustomer, type='card')
            print(methods)
            raise Exception('customerId db object and stripe payment method id required')
        modifiedCustomer = stripe.Customer.modify(self.stripeCustomer.st_customerId,
                                                  'invoice_settings':{default_payment_method:self.stripePaymentMethodId}) '''

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
        
def buyPost(post, customerInfo):
    try:
        intent = stripe.PaymentIntent.create(
            amount = post.price_units,
            currency = 'usd',
            customer = customerInfo.customerId,
            receipt_email = customerInfo.customerEmail,
            metadata = {
                'purchase_type': 'post',
                'obj_id':post.pk
            }
            )      
        return intent
    except:
        return False    

def create_transaction_records(payment_intentId, user):
    if not payment_intentId or not user:
        raise Exception('need payment intent id, user obj and post obj')
    try:
        intent = stripe.PaymentIntent.retrieve(payment_intentId)
        if intent['metadata']['purchase_type'] == 'post': 
            Post = post.objects.filter(pk=intent['metadata']['obj_id']).select_related('user')[0]
        else:
            return False
        CustomerId = stripeCustomer(user).findCreateCustomerId()
    except:
        return False
    if intent['status'] == 'succeeded': 
        try:
            price = int(intent['amount'])
            UserTransactionItem.objects.create(
                user = user,
                units = price,
                is_payment = False,
                is_purchase = True,
                is_refund = False,
                post = Post
            )
        
            #create record for creator
            UserTransactionItem.objects.create(
                user = Post.user,
                units = price,
                is_payment = True,
                is_purchase = False,
                is_refund = False,
                post = Post
            )
        except:
           return False
        
        try:
            siteTransaction.objects.create(
                st_transaction_id = intent['id'],
                customerId = CustomerId.stripeCustomer,
                units = price,
                is_payment = True,
                is_refund = False,
                post = Post
            )
            return True
        except:
           return False
        
        

#Requires post object#
class StripeUserSubscription:
    #creator: required creator(User) db object which the user is subscribing to
    #subscriber: optional subscriber(User) db object of the subscriber
    #local subscriptionProductId obj, see findCreateSubProductId
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
    
    
    #updates stripe price of post
    #post price has to be updated first
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

        CustomerId = stripeCustomer(self.subscriber).findCreateCustomerId()
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
        
        
        
class PuchaseLiveClass:
    def __init__(self, classObj=None, purchaser=None, 
                localClassProductObj=None, 
                st_classId=None, st_intentId=None, stripeCustomer=None):
        
        self.classObj = classObj
        self.purchaser = purchaser
        self.stripeCustomer = stripeCustomer
        self.st_intentId = st_intentId
        
    def findCreateClassProductId(self):
        if not self.classObj:
            raise Exception('need local public package obj')
        try:
            classProductId = publicPackageProductId.objects.get(package=self.classObj)
            self.localClassProductObj = classProductId
            print('found product')
            return self
        except:
            try:
                print('creating product')
                classProductId = stripe.Product.create(
                    description = f'class: {self.classObj.pk} | type:classPackage', 
                    name = f"classId: {self.classObj.pk}",
                    shippable = False,
                    metadata = {
                        'type': 'classPackage',
                        'site':settings.SITE_NAME,
                        'user_id':self.classObj.user
                    }
                )
                print('created product')
                #create stripe price object for stripe product
                print('creating price')
                price = stripe.Price.create(
                    product = classProductId['id'],
                    unit_amount = self.classObj.price_units,
                    currency = 'usd',
                    metadata = {
                    'site':settings.SITE_NAME,
                    'user_id':self.classObj.user.pk,
                    }
                )
                print('created price')
                print('creating local class product obj')
                localClassObj = publicPackageProductId.objects.create(
                package=self.classObj,
                st_productId = classProductId['id'],
                st_priceId = price['id']
                )
                print('created local class obj product id')
                self.localClassProductObj = localClassObj
                return self
            
            except:
                return False

    
    def purchaseClass(self):
        try:
            intent = stripe.PaymentIntent.create(
                amount = self.classObj.price_units,
                currency = 'usd',
                customer = self.stripeCustomer.customerId,
                receipt_email = self.stripeCustomer.customerEmail,
                metadata = {
                    'purchase_type': 'classPackage',
                    'obj_id':self.classObj.pk
                }
                )      
            return intent
        except:
            return False
        
    def completePurchase(self):
        if not self.st_intentId or not self.purchaser:
            raise Exception('need payment intent id and user obj')
        try:
            intent = stripe.PaymentIntent.retrieve(self.st_intentId)

            if intent['metadata']['purchase_type'] == 'classPackage': 
                classPackage = publicPackage.objects.filter(pk=int(intent['metadata']['obj_id'])).select_related('user')[0]
            else:
                return False
            CustomerId = stripeCustomer(self.purchaser).findCreateCustomerId().stripeCustomer

        except:
            return False

        if intent['status'] == 'succeeded':
            try:
                #create record for customer 
                UserTransactionItem.objects.create(
                    user = self.purchaser,
                    units = intent['amount'],
                    is_payment = False,
                    is_purchase = True,
                    is_refund = False,
                    classPackage = classPackage
                )
                
                #create record for creator
                UserTransactionItem.objects.create(
                    user = classPackage.user,
                    units = intent['amount'],
                    is_payment = True,
                    is_purchase = False,
                    is_refund = False,
                    classPackage = classPackage
                )
            except:
                return False
            
            try:
                siteTransaction.objects.create(
                    st_transaction_id = intent['id'],
                    customerId = CustomerId,
                    units = intent['amount'],
                    is_payment = True,
                    is_refund = False,
                    classPackage = self.classObj
                )
                return True
            except:
                return False

    def createAppointment(self, requestData):
        print(requestData)
        try:
            print('getting sessions id')
            sessionId = classSessionId.objects.get(classPackage = self.classObj)
            self.classSessionId = sessionId
            print(self.classSessionId)
        except:
            try:
                print("creating new session id")
                startTime = requestData['start_time']
                endTime = requestData['end_time']
                print(startTime)
                print(endTime)
                print(self.classObj)
                sessionId = classSessionId.objects.create(
                    classPackage = self.classObj,
                    start_time = startTime,
                    end_time = endTime
                )
                print(sessionId)
                self.classSessionId = sessionId
            except:
                return False
            
        try:
            print('creating user appointment')
            userAppointment = appointment.objects.create(
                packageSessionId = self.classSessionId,
                user = self.purchaser
            )
        except:
            return False
        
        try:
            creatorAppointment = appointment.objects.get(user = self.classObj.user, 
                                                            packageSessionId = self.classSessionId,
                                                            is_instructor = True)
            return True
        except:
            try:
                creatorAppointment = appointment.objects.create(user = self.classObj.user, 
                                                                packageSessionId = self.classSessionId,
                                                               is_instructor = True)
                return True
            except:
                return False
            