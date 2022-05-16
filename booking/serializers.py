from attr import field
from rest_framework import serializers
from .models import calendar, appointment, classSessionId

from classPackages.serializers import publicPackage_serializer



class classSessionId_serializer(serializers.ModelSerializer):
    classPackage = publicPackage_serializer()
    
    class Meta:
        model = classSessionId
        fields = ['pk', 'start_time', 'end_time', 'classPackage', 
                  'instructor_logged_on']
        #read_only_fields = ['number_of_attendees']
        
        
class appointment_serializer(serializers.ModelSerializer):
    packageSessionId = classSessionId_serializer(read_only=True)
    class Meta:
        model = appointment
        fields = ['pk', 'packageSessionId', 'logged_on',
                  'package_title','customer', 'instructor']
        read_only_fields = ['package_title', 'customer', 'instructor']


class calendar_serializer(serializers.ModelSerializer):
    appointments = serializers.SerializerMethodField()
    class Meta:
        model = calendar
        fields = ['pk', 'user', 'appointments']
        
    def get_appointments(self, obj):
        appointments = obj.all_appointments()
        if appointments:
            if appointments.count() == 1:
                print("1 appointment")
                serializer = appointment_serializer(appointments)
            serializer = appointment_serializer(appointments, many=True)
            return serializer.data



        
    