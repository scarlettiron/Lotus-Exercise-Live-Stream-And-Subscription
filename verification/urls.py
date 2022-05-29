from django.urls import path
from . import views as v

urlpatterns = [
    path('detail/<user>', v.verification_detail.as_view(), name='verification-detail'),
]
