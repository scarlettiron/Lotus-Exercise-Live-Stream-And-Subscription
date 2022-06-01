from django.urls import path
from rest_framework_simplejwt.views import (TokenRefreshView)
from .views import MyTokenObtainPairView
from . import views as v

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('detail/<str:username>/', v.user_detail.as_view(), name="user-detail"),
    path('list/', v.user_list.as_view(), name="user-list"),
    path('create/', v.create_user.as_view(), name='user-create'),
    path('search/', v.SearchUsers.as_view(), name='active-user-search'),
    path('subscription-price-update/<int:pk>/', v.update_subscription_price.as_view(), name='updateSubscriptionPrice'),
]
