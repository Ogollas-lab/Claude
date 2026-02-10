import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chakula_connect.settings')
django.setup()

from market.models import Buyer, Order
from logistics.models import Carrier, Delivery
from farmers.models import Produce, Farmer

def populate_market():
    print("Populating Market & Logistics...")
    
    # 1. Create Buyers
    buyers = [
        {"name": "Nairobi Primary School", "type": "SCHOOL", "phone": "+254722000001"},
        {"name": "Mama Lucy Hospital", "type": "HOSPITAL", "phone": "+254722000002"},
        {"name": "Bidco Wholesalers", "type": "WHOLESALER", "phone": "+254722000003"},
    ]
    
    db_buyers = []
    for b in buyers:
        buyer, created = Buyer.objects.get_or_create(
            name=b['name'],
            defaults={'organization_type': b['type'], 'phone_number': b['phone'], 'location_name': 'Nairobi'}
        )
        db_buyers.append(buyer)
        if created: print(f"Added Buyer: {b['name']}")

    # 2. Create Carriers
    carriers = [
        {"name": "Swift Boda", "type": "BODA", "plate": "KMD 123A"},
        {"name": "TransHaul Trucks", "type": "TRUCK", "plate": "KCA 456B"},
    ]
    
    db_carriers = []
    for c in carriers:
        carrier, created = Carrier.objects.get_or_create(
            name=c['name'],
            defaults={'vehicle_type': c['type'], 'license_plate': c['plate'], 'phone_number': "+254733000001"}
        )
        db_carriers.append(carrier)
        if created: print(f"Added Carrier: {c['name']}")

    # 3. Create Orders from existing Produce
    produces = Produce.objects.filter(available=True)[:3]
    for i, produce in enumerate(produces):
        buyer = random.choice(db_buyers)
        qty = float(produce.quantity_kg) / 2 # Buy half
        price = qty * float(produce.price_per_kg)
        
        order = Order.objects.create(
            order_id=f"ORD-{random.randint(1000,9999)}",
            buyer=buyer,
            produce=produce,
            quantity_ordered_kg=qty,
            total_price=price,
            status='PENDING'
        )
        print(f"Created Order {order.order_id} for {buyer.name}")
        
        # Create Delivery
        Delivery.objects.create(
            order=order,
            status='ASSIGNING'
        )
        print(f" - Delivery request created.")

if __name__ == '__main__':
    populate_market()
