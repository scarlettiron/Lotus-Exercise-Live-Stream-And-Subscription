from django.contrib import admin
from .models import hours, package_days, publicPackage, days, month, dayInt, year, publicPackageProductId 

admin.site.register(publicPackage)
admin.site.register(package_days)
admin.site.register(hours)
admin.site.register(days)
admin.site.register(month)
admin.site.register(year)
admin.site.register(dayInt)
admin.site.register(publicPackageProductId)
