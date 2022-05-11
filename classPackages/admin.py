from django.contrib import admin
from .models import hours, package_days, publicPackage

admin.site.register(publicPackage)
admin.site.register(package_days)
admin.site.register(hours)
