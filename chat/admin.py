from django.contrib import admin
from .models import thread, message

admin.site.register(thread)
admin.site.register(message)