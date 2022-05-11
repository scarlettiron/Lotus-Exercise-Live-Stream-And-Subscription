from django.dispatch import receiver
import django.dispatch
from django.db.models import signals

from .utils import delete_s3_object

from .models import media


@receiver(signals.pre_delete, sender = media)
def post_media_deleted_handler(sender, instance, *args, **kwargs):
    key = str(instance.media)
    delete_s3_object(key)
    
    

