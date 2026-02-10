from django.db import models
from market.models import Order

class Carrier(models.Model):
    name = models.CharField(max_length=100)
    vehicle_type = models.CharField(max_length=50, choices=[('BODA', 'Motorcycle'), ('TRUCK', 'Truck'), ('PICKUP', 'Pickup')])
    phone_number = models.CharField(max_length=15)
    license_plate = models.CharField(max_length=20)
    available = models.BooleanField(default=True)
    current_lat = models.FloatField(blank=True, null=True)
    current_lon = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.vehicle_type})"

class Delivery(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    carrier = models.ForeignKey(Carrier, on_delete=models.SET_NULL, null=True, blank=True)
    pickup_time = models.DateTimeField(null=True, blank=True)
    delivery_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, default='ASSIGNING', choices=[('ASSIGNING', 'Assigning Carrier'), ('IN_TRANSIT', 'In Transit'), ('DELIVERED', 'Delivered')])

    def __str__(self):
        return f"Delivery for {self.order.order_id}"
