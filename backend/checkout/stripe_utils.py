import stripe
import pendulum
from django.conf import settings

ST_PUBLIC = settings.STRIPE_PUBLISHABLE_KEY
ST_SECRET = settings.STRIPE_SECRET_KEY

ST_WEBHOOK_SECRET = settings.STRIPE_WEBHOOK_SECRET



class StripeUtil:
    def __init__(self, plan = None, subscription = None,
                 st_subscription = None, account = None,
                 meta = None):
        #local object SubscriptionPackage
        self.plan = plan
        #local subscription object SubscriptionDetail
        self.subscription = subscription
        #Stripe object for stripe subscription
        self.st_subscription = st_subscription
        # local object MainAccount
        self.account = account
        #For adding metadata to Stripes objects
        self.meta = meta
    
    
    ### for updating local timestamps on Subscriptions 
    ### takes in either timestamps from stripe
    ## or returns default of 1 month difference
    # example {begin_date:begin date, end_date = end_date}
    def get_subscription_timestamps(stripe_timestamps = None):
        if not stripe_timestamps:
            begin_date = pendulum.now('utc').to_iso8601_string()
            end_date = pendulum.now('utc').add(months=1).to_iso8601_string()
        else:
            begin_date = pendulum.from_timestamp(stripe_timestamps["beginning"], "utc").to_iso8601_string()
            end_date = pendulum.from_timestamp(stripe_timestamps["ending"], "utc").to_iso8601_string()
        return {"beginning":begin_date, "ending":end_date}
    
    