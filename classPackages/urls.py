from django.urls import path
from . import views as v

urlpatterns =[
    path('list/<str:username>/', v.publicPackage_list.as_view(), name="public-package-list"),
    path('detail/<int:pk>/', v.publicPackage_detail.as_view(), name='public-package-detail'),
]