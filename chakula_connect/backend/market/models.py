from django.db import models
from farmers.models import Produce, Farmer

class Buyer(models.Model):
    name = models.CharField(max_length=100)
    organization_type = models.CharField(max_length=50, choices=[('SCHOOL', 'School'), ('HOSPITAL', 'Hospital'), ('WHOLESALER', 'Wholesaler'), ('NGO', 'NGO')])
    phone_number = models.CharField(max_length=15)
    location_name = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.name} ({self.organization_type})"

class Order(models.Model):
    order_id = models.CharField(max_length=20, unique=True)
    buyer = models.ForeignKey(Buyer, on_delete=models.CASCADE)
    produce = models.ForeignKey(Produce, on_delete=models.CASCADE)
    quantity_ordered_kg = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, default='PENDING', choices=[('PENDING', 'Pending'), ('PAID', 'Paid'), ('DISPATCHED', 'Dispatched'), ('DELIVERED', 'Delivered')])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.order_id} - {self.quantity_ordered_kg}kg"
