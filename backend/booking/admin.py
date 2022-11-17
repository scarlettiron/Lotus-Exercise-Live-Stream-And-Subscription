from django.contrib import admin

from .models import calendar, appointment, classSessionId

admin.site.register(calendar)
admin.site.register(appointment)
admin.site.register(classSessionId)
