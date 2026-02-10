from django.db import models
# from django.contrib.gis.db import models as gis_models

class Farmer(models.Model):
    phone_number = models.CharField(max_length=15, unique=True)
    name = models.CharField(max_length=100)
    # location = gis_models.PointField(srid=4326, blank=True, null=True)  # Geo-tag from USSD/Tower -- Requies GDAL
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    location_name = models.CharField(max_length=100, blank=True, null=True) # Text description
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.phone_number})"

class Produce(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='produce')
    crop_type = models.CharField(max_length=50, choices=[('MAIZE', 'Maize'), ('BEANS', 'Beans'), ('POTATOES', 'Potatoes')])
    quantity_kg = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_kg = models.DecimalField(max_digits=10, decimal_places=2)
    harvest_date = models.DateField()
    listed_at = models.DateTimeField(auto_now_add=True)
    available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.crop_type} - {self.quantity_kg}kg from {self.farmer.name}"
