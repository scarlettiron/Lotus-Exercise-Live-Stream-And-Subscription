from django.contrib import admin

from .models import calendar, appointment

admin.site.register(calendar)
admin.site.register(appointment)
