from django.urls import path
from . import views as v
urlpatterns = [
    path('followers/', v.user_followers.as_view(), name='user-followers'),
    path('following/', v.following_users.as_view(), name='user-following'),
    path('detail/<creator_id>', v.delete_follow.as_view(), name='follow-delete'),
]