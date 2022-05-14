from django.urls import re_path
from . import groupClassConsumers

websocket_urlpatterns = [
    re_path(r'ws/group-class/(?P<room_name>\w+)/$', groupClassConsumers.group_class_consumer.as_asgi()),
]