from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL


class days(models.Model):
    day = models.CharField(max_length=15)
    

class dayInt(models.Model):
    day = models.IntegerField()
    
class hours(models.Model):
    hour = models.IntegerField()
    

class month(models.Model):
    monthStr = models.CharField(max_length=50)
    monthInt = models.IntegerField()
    
class year(models.Model):
    year = models.IntegerField()
    
    
class package_days(models.Model):
    monday = models.BooleanField(default=False)
    tuesday = models.BooleanField(default=False)
    wednesday = models.BooleanField(default=False)
    thursday = models.BooleanField(default=False)
    friday = models.BooleanField(default=False)
    saturday = models.BooleanField(default=False)
    sunday = models.BooleanField(default=False)
    

            
        
    

class publicPackage(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=2000)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    price_units = models.IntegerField(default=0)
    duration = models.IntegerField(default=0)
    from_time = models.ForeignKey(hours, null=True, on_delete=models.CASCADE, related_name='earliest')
    to_time = models.ForeignKey(hours, null=True, on_delete=models.CASCADE, related_name='latest')
    days_available = models.ForeignKey(package_days, null=True, blank=True,  on_delete=models.CASCADE)
    is_active = models.BooleanField(default=False)
    
    
    @property
    def price(self):
        units = int(self.price_units)
        if units != 0:
            return round(units / 100, 2)
        return self.price_units


class publicPackageProductId(models.Model):
    package = models.ForeignKey(publicPackage, on_delete=models.CASCADE)
    st_productId = models.CharField(max_length=300)
    st_priceId = models.CharField(max_length=300)