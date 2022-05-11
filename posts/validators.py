from rest_framework import serializers

def validate_user(self, value):
    request = self.context.get('request')
    user_id = request.user.id
    if user_id != value.id:
        raise serializers.ValidationError("Unauthorized")
    return value