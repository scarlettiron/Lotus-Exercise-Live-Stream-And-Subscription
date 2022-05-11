from django.urls import path
from . import views as v

urlpatterns = [
    path('purchase-post/<postid>', v.purchase_post.as_view(), name="purchase-post"),
    path('purchase-subscription/<creatorid>', v.purchase_subscription.as_view(), name='purchase-subscription'),
]