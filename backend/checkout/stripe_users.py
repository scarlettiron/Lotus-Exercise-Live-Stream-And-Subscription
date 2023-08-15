import stripe
from yoga.settings import SITE_NAME
from django.conf import settings

from users.models import customerId

stripe.api_key = settings.STRIPE_SECRET_KEY


#requires the users account object
class StripeCustomer:
    
    def __init__(self, account=None, stripeCustomer=None, stripePaymentMethodId=None):
        if not account:
            raise Exception("user object required")
        self.account = account
        self.stripeCustomer = stripeCustomer
        self.stripePaymentMethodId = stripePaymentMethodId 
    #finds if account has stripe customer id
    #if found returns local customerId object
    #if not found creates stripe customer object, then local customerId object
    #returns local customerId object if successful, False otherwise       
    def findCreateCustomerId(self):
        if not self.account:
            raise Exception("account object required")
            
        
        if self.account.customerId:
            self.stripeCustomer = self.account.customerId
            return self
        
        else:
            try:
                customer = stripe.Customer.create(
                    description = f'{self.account.user.id}', 
                    #email = self.user.email,
                    name = f"account_id:{self.account.user.id}",
                    metadata = {
                        'account_id':self.account.user.id,
                    }
                    )

                #update account to include stripe customer id
                self.account.customerId = customer['id']
                self.account.save()
                self.stripeCustomer = self.account.customerId
                return self
            except:
                return False
            
    #todo  
    # takes in the payment methods id
    # returns last four digits of payment method is successful
    # false otherwise    
    def get_card_last_four(payment_method_id):
        pass
        
     
    ### Step 1 ###
    # returns a checkout session with secret key to be
    # used on the frontend with elements
    def new_card_session(self):
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            mode='setup',
            usage="off_session",
            customer=f'{self.account.customerId}',
            #success_url='https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
            #cancel_url='https://example.com/cancel',
            metadata = {'account':self.account.user.pk}
            )
        
        return session   
    
    ### Step 3 ###
    #webhook: checkout.session.completed
    def new_default_payment_method(self, session):
        if not session:
            raise Exception('Stripe session object required')
        
        try:
            intent = stripe.SetupIntent.retrieve(session['setup_intent'])
            customerId = intent['customer']
            new_payment_method = intent['payment_method']
            customer = stripe.Customer.modify(customerId,
                                            invoice_settings = {'default_payment_method':new_payment_method})
            return True
        except:
            return False  