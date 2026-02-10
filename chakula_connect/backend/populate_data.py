import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chakula_connect.settings')
django.setup()

from farmers.models import Farmer, Produce

def populate():
    print("Populating data...")
    Farmer.objects.all().delete()
    
    # Farmers around Kitale/Eldoret (Grain Basket)
    farmers_data = [
        {"name": "Kamau Njoroge", "phone": "+254711000001", "lat": 1.0191, "lon": 35.0023}, # Kitale
        {"name": "Wanjiku Kibet", "phone": "+254711000002", "lat": 0.5143, "lon": 35.2698}, # Eldoret
        {"name": "Omondi Juma", "phone": "+254711000003", "lat": 0.0917, "lon": 34.7680}, # Kisumu
    ]

    for f_data in farmers_data:
        farmer = Farmer.objects.create(
            name=f_data['name'],
            phone_number=f_data['phone'],
            latitude=f_data['lat'],
            longitude=f_data['lon']
        )
        
        # Add Produce
        Produce.objects.create(
            farmer=farmer,
            crop_type="MAIZE",
            quantity_kg=random.randint(100, 1000),
            price_per_kg=random.randint(40, 60),
            harvest_date="2024-01-01"
        )
        print(f"Added {farmer.name}")

if __name__ == '__main__':
    populate()
