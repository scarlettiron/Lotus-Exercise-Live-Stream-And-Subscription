from . import views as v
from django.urls import path

urlpatterns = [
    path('create-list/', v.comment_list_create.as_view(), name='commentListCreate'),
]