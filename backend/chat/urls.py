from django.urls import path
from . import views as v

urlpatterns = [
    path('user-threads/', v.list_create_thread.as_view()),
    path('thread-messages/<thread>', v.thread_detail.as_view()),
    path('messages/<thread>', v.get_messages.as_view()),
]
