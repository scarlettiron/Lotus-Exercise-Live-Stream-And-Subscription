
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    #path(r'^api/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('auth/', include('djoser.urls')),
    path('api/users/', include('users.urls')),
    path('api/posts/', include('posts.urls')),
    path('api/userv2/', include('yoga.routers')),
    path('api/bookings/', include('booking.urls')),
    path('api/liveclasses/', include('classPackages.urls')),
    path('api/follows/', include('follow.urls')),
    path('api/subscriptions/', include('subscription.urls')),
    path('api/content/', include('content.urls')),
    path('api/likesunlikes/', include('likeUnlike.urls')),
    path('api/comments/', include('comments.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/checkout/', include('checkout.urls')),
    path('api/user-transactions/', include('userTransactions.urls')),
    path('api/verifications/', include('verification.urls')),
    path('api/usernotifications/', include('userNotifications.urls')),
    path('api/tags/', include('tags.urls')),
]
