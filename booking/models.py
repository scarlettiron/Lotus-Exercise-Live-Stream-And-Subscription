from django.db import models
from classPackages.models import dayInt, publicPackage, month, year, hours
from django.conf import settings
User = settings.AUTH_USER_MODEL



class classSessionId(models.Model):
    day = models.ForeignKey(dayInt, on_delete=models.CASCADE)
    month = models.ForeignKey(month, on_delete=models.CASCADE)
    year = models.ForeignKey(year, on_delete=models.CASCADE)
    hours = models.ForeignKey(hours, on_delete=models.CASCADE)
    classPackage = models.ForeignKey(publicPackage, on_delete=models.SET_NULL, null=True)
    instructor_logged_on = models.BooleanField(default=False)
    
@property
def number_of_attendees(self):
    return self.appointment.set_all().count()      
    
class calendar(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    def all_appointments(self):
        return self.appointments.all()


    
class appointment(models.Model):
    calendar = models.ForeignKey(calendar, on_delete=models.CASCADE, related_name="appointments", blank=True, null=True)
    packageSessionId = models.ForeignKey(classSessionId, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="customerpurchases")
    logged_on = models.BooleanField(default=False)
    
    @property
    def instructor(self):
        return self.packageSessionId.classPackage.user.username
    
    @property
    def package_title(self):
        return self.packageSessionId.classPackage.title
    
    @property
    def customer(self):
        return self.user.username
    



