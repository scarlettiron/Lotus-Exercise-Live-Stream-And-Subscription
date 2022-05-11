from attr import field
from rest_framework import serializers
from .models import hours, package_days, publicPackage


class hours_serializer(serializers.ModelSerializer):
    class Meta:
        model = hours
        fields = '__all__'

class packageDays_serializer(serializers.ModelSerializer):
    class Meta:
        model = package_days
        fields = '__all__'

class publicPackage_serializer(serializers.ModelSerializer):
    days_available = packageDays_serializer()
    from_time = hours_serializer()
    to_time = hours_serializer()
    
    class Meta:
        model = publicPackage
        fields = ['pk', 'title', 'description', 'price_units','price', 
                  'duration', 'user', 'days_available', 'from_time', 'to_time']
        read_only_fields = ['price']

    
    def validate_user(self, value):
        request = self.context.get('request')
        if request.user.id != value.id:
            raise serializers.ValidationError("Unauthorized")
        return value
        
    def create(self, validated_data, *args, **kwargs):
        packageDays = validated_data.pop('days_available')
        from_time = validated_data.pop('from_time')
        
        fr_time = hours.objects.filter(**from_time)[0]
        to_time = validated_data.pop('to_time')
        t_time = hours.objects.filter(**to_time)[0]
        
        available_days = package_days.objects.create(**packageDays)
        new_class = publicPackage.objects.create(**validated_data, 
                                                 days_available = available_days, 
                                                 from_time=fr_time, to_time=t_time)
        return new_class 
            
            
        
