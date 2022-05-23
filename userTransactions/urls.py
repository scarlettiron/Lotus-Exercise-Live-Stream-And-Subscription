from django.urls import path
from . import views as v

urlpatterns = [
    path('list/', v.user_transaction_list.as_view(), name='user-transaction-list'),
]