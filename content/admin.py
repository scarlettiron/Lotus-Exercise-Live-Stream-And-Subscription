from django.contrib import admin
from .models import album, media, supportedMediaContentTypes

admin.site.register(album)
admin.site.register(supportedMediaContentTypes)
admin.site.register(media)

