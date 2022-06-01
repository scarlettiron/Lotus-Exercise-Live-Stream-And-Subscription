from . import views as v
from django.urls import path

urlpatterns = [
   path('list/<int:user>', v.notification_list.as_view(), name='notifications-list'), 
]
