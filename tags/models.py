from django.db import models

from posts.models import post

class tag(models.Model):
    body = models.CharField(max_length=100)


class tags(models.Model):
    post = models.ForeignKey(post, on_delete=models.CASCADE, related_name='posttag')
    tag = models.ForeignKey(tag, on_delete=models.CASCADE)


