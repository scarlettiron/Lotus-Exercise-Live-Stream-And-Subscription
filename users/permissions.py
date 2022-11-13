
from rest_framework import permissions
from rest_framework.permissions import DjangoModelPermissions

class IsCreatorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return obj == request.user
    
    
class CreateOrRead(permissions.DjangoModelPermissions):
    def has_permission(self, request, view):
        pass
    def has_object_permission(self, request, view):
        pass



##permissions.isAuthenticatedOrReadOnly
    