import stripe
from yoga.settings import SITE_NAME
from django.conf import settings

from users.models import customerId

stripe.api_key = settings.STRIPE_SECRET_KEY


#requires the user object
class StripeCustomer:
    
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
