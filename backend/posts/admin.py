from django.contrib import admin
from .models import post, postProductId


class postAdmin(admin.ModelAdmin):
    fields = []
    search_fields = []


admin.site.register(post)
admin.site.register(postProductId)
