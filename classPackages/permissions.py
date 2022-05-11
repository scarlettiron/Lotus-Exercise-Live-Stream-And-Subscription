from rest_framework import permissions

class isPackageOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        pass
        ''' if request.method in permissions.SAFE_methods:
            return True
        
        return obj.user.username == request.user.username '''
            