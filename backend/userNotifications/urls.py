from django.urls import path
from . import views as v

urlpatterns = [
        path('list/', v.notification_list.as_view(), name='notifications-list'), 
]
