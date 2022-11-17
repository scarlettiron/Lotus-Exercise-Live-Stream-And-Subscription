import stripe
from yoga.settings import SITE_NAME
from django.conf import settings
from .stripe_users import StripeCustomer

from classPackages.models import publicPackage
from userTransactions.models import UserTransactionItem
from siteTally.models import siteTransaction
from booking.models import classSessionId, appointment

stripe.api_key = settings.STRIPE_SECRET_KEY



class StripePurchaseClass:
    def __init__(self, purchaser, package, intent=None, 
                 customer_id=None, intent_id=None):
        self.purchaser = purchaser
        self.package = package
        self.intent = intent
        self.intent_id = intent_id
        self.customer_id = customer_id
    
    def create_intent(self, start_time, end_time):
        self.customer_id = StripeCustomer(self.purchaser).findCreateCustomerId().stripeCustomer
        try:
            intent = stripe.PaymentIntent.create(
                amount = self.package.price_units,
                currency = 'usd',
                customer = self.customer_id.customerId,
                receipt_email = self.customer_id.customerEmail,
                metadata = {
                    'purchase_type': 'classPackage',
                    'obj_id':self.package.pk,
                    'purchaser':self.purchaser.pk,
                    'start_time':start_time,
                    'end_time':end_time
                    
                }
                ) 
            self.intent_id = intent     
            return self
        except:
            return False
        
        
    def create_transactions(self):
        self.customer_id = StripeCustomer(self.purchaser).findCreateCustomerId().stripeCustomer
        try:
                #create record for customer 
            UserTransactionItem.objects.create(
                    user = self.purchaser,
                    units = self.intent['amount'],
                    is_payment = False,
                    is_purchase = True,
                    is_refund = False,
                    classPackage = self.package
                )
                
                #create record for creator
            UserTransactionItem.objects.create(
                    user = self.package.user,
                    units = self.intent['amount'],
                    is_payment = True,
                    is_purchase = False,
                    is_refund = False,
                    classPackage = self.package
                )
        except:
            return False
        
        try:
            siteTransaction.objects.create(
                st_transaction_id = self.intent['id'],
                customerId = self.customer_id,
                units = self.intent['amount'],
                is_payment = True,
                is_refund = False,
                classPackage = self.package
            )
            return self
        except:
            return False
            
            
            
    def create_appointments(self):
        data = self.intent['metadata']
        try:
            sessionId = classSessionId.objects.get(classPackage = self.classObj)
            self.classSessionId = sessionId
        except:
            try:
                startTime = data['start_time']
                endTime = data['end_time']
                sessionId = classSessionId.objects.create(
                    classPackage = self.package,
                    start_time = startTime,
                    end_time = endTime
                )
                self.classSessionId = sessionId
            except:
                return False
        try:
            userAppointment = appointment.objects.create(
                packageSessionId = self.classSessionId,
                user = self.purchaser
            )
        except:
            return False
        
        try:
            creatorAppointment = appointment.objects.get(user = self.package.user, 
                                                            packageSessionId = self.classSessionId,
                                                            is_instructor = True)
            return True
        except:
            try:
                creatorAppointment = appointment.objects.create(user = self.package.user, 
                                                                packageSessionId = self.classSessionId,
                                                               is_instructor = True)
                return True
            except:
                return False
            