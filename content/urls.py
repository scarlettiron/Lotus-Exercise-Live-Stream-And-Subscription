from django.urls import path
from . import views as v

urlpatterns = [
    path('album/<user_id>/', v.get_user_albums.as_view(), name ='albums'),
]