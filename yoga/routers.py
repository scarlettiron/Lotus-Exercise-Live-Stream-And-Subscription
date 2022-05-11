from rest_framework.routers import DefaultRouter
from users.viewsets import profileViewset, profileViewsetGeneric

router = DefaultRouter()
router.register('users-abc', profileViewset, basename='users')
router.register('usersv3', profileViewsetGeneric, basename='usersV3')
urlpatterns = router.urls