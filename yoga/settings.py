
from pathlib import Path
import os
import sys
from decouple import config
import dj_database_url
from storages.backends.s3boto3 import S3Boto3Storage
from datetime import timedelta
from django.core.management.utils import get_random_secret_key


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

NEW_KEY = get_random_secret_key()
SECRET_KEY = config('SECRET_KEY')

DEBUG = config('DEBUG')

ALLOWED_HOSTS = ['*']

SITE_PROTOCOL = config('SITE_PROTOCOL')
SITE_NAME = config('SITE_NAME')

# Application definition

INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.postgres',
    'storages',
    'django.contrib.staticfiles',
    "debug_toolbar",
    "anymail",
    'channels',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'djoser',
    'users.apps.UsersConfig',
    'chat',
    'posts',
    'content.apps.ContentConfig',
    'booking.apps.BookingConfig',
    'classPackages.apps.ClasspackagesConfig',
    'follow.apps.FollowConfig',
    'subscription.apps.SubscriptionConfig',
    'likeUnlike.apps.LikeunlikeConfig',
    'comments.apps.CommentsConfig',
    'notifications.apps.NotificationsConfig',
    'userTransactions.apps.UsertransactionsConfig',
    'siteTally.apps.SitetallyConfig',
    'verification.apps.VerificationConfig',
    'staffNotifications.apps.StaffnotificationsConfig',
    'userNotifications.apps.UsernotificationsConfig',
    'tags',
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "debug_toolbar.middleware.DebugToolbarMiddleware",
]

''' INTERNAL_IPS = [
    # ...
    "127.0.0.1",
    # ...
]
 '''
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_HEADERS = "*"
CORS_ALLOW_CREDENTIALS=True

CSRF_TRUSTED_ORIGINS = [config('API_URL'),]

ROOT_URLCONF = 'yoga.urls'

AUTH_USER_MODEL = 'users.custom_profile'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

#WSGI_APPLICATION = 'yoga.wsgi.application'

ASGI_APPLICATION = 'yoga.asgi.application'
ASGI_THREADS = config('ASGI_THREADS')

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [config('REDIS_URL')],
            "symmetric_encryption_keys":[SECRET_KEY],
        },
    },
}
''' red = os.environ.get('REDIS_URL')
print(f"REDIS URL: {red}")
sys.stdout.flush() '''

### send emails through mail gun
EMAIL_BACKEND = "anymail.backends.mailgun.EmailBackend"
ANYMAIL_MAILGUN_API_KEY = config("MAIL_GUN_DOMAIN_API")
DEFAULT_FROM_EMAIL=config('MAIL_GUN_EMAIL')

DOMAIN = config('FRONTEND_DOMAIN')

''' 
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'yoga2',
        'PASSWORD':config('DATABASE_PASSWORD'),
        'PORT':5432,
        'USER':'postgres',
        'HOST':'localhost',
    }, 

}  ''' 

DATABASE_URL = config('DATABASE_URL')
DATABASES = {"default": dj_database_url.config(default=DATABASE_URL, conn_max_age=int(config('DB_CONNECTION_AGE')))}

''' CONN_MAX_AGE=config('DB_CONNECTION_AGE')
db_from_env = dj_database_url.config(conn_max_age=0)
DATABASES['default'].update(db_from_env) '''

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]




REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
"""     'DEFAULT_PERMISSION_CLASSES':(
        'rest_framework.permissions.IsAuthenticated',
    ), """
     'DEFAULT_PERMISSION_CLASSES':[
        'rest_framework.permissions.IsAuthenticated',
        'users.permissions.IsCreatorOrReadOnly',
    ], 
    'DEFAULT_PAGINATION_CLASS':'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE':6,
    
}

#'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
#    'PAGE_SIZE': 10

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

AWS_S3_ACCESS_KEY_ID = config('AWS_S3_ACCESS_KEY_ID')
AWS_S3_SECRET_ACCESS_KEY = config('AWS_S3_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME')
AWS_S3_FILE_OVERWRITE = False
AWS_S3_REGION_NAME = 'us-east-2'
AWS_S3_CUSTOM_DOMIAN = f"{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com"

#AWS_DEFAULT_ACL = 

# Static and media files (CSS, JavaScript, Images)
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3StaticStorage'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMIAN}/static/'
STATIC_URL = '/static/'
MEDIA_URL = '/media/'


EMAIL_BACKEND = "anymail.backends.mailgun.EmailBackend"
ANYMAIL_MAILGUN_API_KEY = config("MAIL_GUN_DOMAIN_API")
DEFAULT_FROM_EMAIL=config('MAIL_GUN_EMAIL')


SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=90),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    #'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}


### stripe keys ###
STRIPE_SECRET_KEY = config('STRIPE_SECRET_KEY')
STRIPE_PUBLIC_KEY = config('STRIPE_PUBLIC_KEY')
STRIPE_WEBHOOK_SECRET_KEY = config('STRIPE_WEBHOOK_SECRET_KEY')



### for password resets ####
DJOSER = {
    'USER_CREATE_PASSWORD_RETYPE': True,
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION': True,
    'SEND_CONFIRMATION_EMAIL': True,
    'SET_PASSWORD_RETYPE': True,
    'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm/{uid}/{token}',
    'ACTIVATION_URL': 'activate/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': True,
    'SERIALIZERS': {
        'user_create': 'users.serializers.create_user_serializer',
        'user': 'users.serializers.profile_serializer',
        'current_user': 'users.serializers.profile_serializer',
    }
}




