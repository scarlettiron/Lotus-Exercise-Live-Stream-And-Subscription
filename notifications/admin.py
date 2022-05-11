from django.contrib import admin
from .models import notification_types, notifications

admin.site.register(notification_types)
admin.site.register(notifications)
