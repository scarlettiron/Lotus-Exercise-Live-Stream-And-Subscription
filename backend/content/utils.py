import boto3
from django.conf import settings

bucket = settings.AWS_STORAGE_BUCKET_NAME
ACCESS_KEY_ID = settings.AWS_S3_ACCESS_KEY_ID
ACCESS_SECRET_KEY = settings.AWS_S3_SECRET_ACCESS_KEY

client = boto3.client('s3', aws_access_key_id=ACCESS_KEY_ID, aws_secret_access_key=ACCESS_SECRET_KEY)
resource = boto3.resource('s3', aws_access_key_id=ACCESS_KEY_ID, aws_secret_access_key=ACCESS_SECRET_KEY)


def delete_s3_object(key):
    #response = client.delete_object(Bucket=bucket, Key=key)
    resource.Object(bucket, key).delete()

    