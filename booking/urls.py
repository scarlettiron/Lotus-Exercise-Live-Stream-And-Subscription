from django.urls import path
from . import views as v

urlpatterns = [
    path('calendar/<int:user>/', v.calendar.as_view(), name='calendar'),
]