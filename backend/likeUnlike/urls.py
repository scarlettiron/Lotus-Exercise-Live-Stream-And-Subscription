from django.urls import path

from likeUnlike import views as v

urlpatterns = [
    # get all user likes, create a like, delete a like
    path('list-create/<user>', v.create_list_like.as_view(), name='create-list-like'),
    path('detail-delete/<post>/<user>', v.detail_delete_like.as_view(), name='like-detail-delete'),
]