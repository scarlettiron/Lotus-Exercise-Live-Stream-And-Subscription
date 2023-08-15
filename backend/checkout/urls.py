from django.urls import path
from . import views as v

urlpatterns = [
    path('purchase-post/<postid>', v.PurchasePost.as_view(), name="purchase-post"),
    path('purchase-subscription/<creatorid>', v.PurchaseSubscription.as_view(), name='purchase-subscription'),
    path('purchase-class/<classid>', v.PurchaseClass.as_view(), name='purchase-live-class'),
    path('webhook-purchases/', v.StripeWebhookEndpoint.as_view(), name='stripe-webhook'),
]