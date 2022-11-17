from django.urls import path
from . import views as v
urlpatterns = [
    path('list/', v.subscription_list.as_view(), name="subsciption-list"),
    path('detail/', v.subscription_detail.as_view(), name="subscription-detail"),
    path('subscribers-list/', v.creator_subscribers.as_view(), name='creator-subscribers'),
    path('subscriptions-list/', v.user_subscriptions.as_view(), name='user-subscriptions'),
    path('subscription-cancel/<creatorid>', v.cancel_subscription.as_view(), name='cancel-subscription'),
    
]