from django.apps import AppConfig


class LikeunlikeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'likeUnlike'

    def ready(self):
        import likeUnlike.signals