from django.contrib import admin
from .models import custom_profile, customerId, creator_balance

admin.site.register(custom_profile)
admin.site.register(customerId)
admin.site.register(creator_balance)
