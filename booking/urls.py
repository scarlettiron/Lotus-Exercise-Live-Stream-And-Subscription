from django.urls import path
from . import views as v

urlpatterns = [
    path('calendar/<int:user>/', v.calendar.as_view(), name='calendar'),
    path('class-session/detail/<pk>/', v.class_session_detail.as_view(), name='class-session-detail'),
    
]