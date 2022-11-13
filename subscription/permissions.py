from rest_framework import permissions

class isSubscriberOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.subscriber == request.user or obj.user == request.user
    
