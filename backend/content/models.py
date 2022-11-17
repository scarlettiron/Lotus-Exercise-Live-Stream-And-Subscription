from distutils.command.upload import upload
from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL


class album(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='albums')
    has_photo = models.BooleanField(default=False)
    has_video = models.BooleanField(default=False)

    
    def get_album_media(self):
        return self.albummedia.all()
    
    
    def __str__ (self):
        return f"obj_id: {self.pk}"
 
 

        
 
class supportedMediaContentTypes(models.Model):
    type = models.CharField(max_length=50)  
    
    
    def __str__(self):
        return self.type 
        

class media(models.Model):
    album = models.ForeignKey(album, on_delete=models.CASCADE, related_name="albummedia")
    media = models.FileField(upload_to='album/media/')
    media_type = models.ForeignKey(supportedMediaContentTypes, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"obj_id: {self.pk} | album_id: {self.album.pk} | content_type: {self.media_type.type}"
    
    @property
    def type(self):
        return self.media_type.type
    

#### POST SIGNALS ####



#signals.pre_delete.connect(post_media_deleted_handler, sender = postMedia)
    