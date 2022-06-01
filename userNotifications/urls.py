from django.urls import path
from . import views as v

urlpatterns = [
        path('list/<int:user>', v.notification_list.as_view(), name='notifications-list'), 
]
