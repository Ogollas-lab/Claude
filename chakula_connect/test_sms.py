import os
import django
import sys

# Setup Django Environment
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chakula_connect.settings')
django.setup()

from market.models import Order, Buyer
from farmers.models import Produce, Farmer
from market.views import OrderCreateView
from market.serializers import OrderSerializer

# 1. ensure a buyer exists
buyer, _ = Buyer.objects.get_or_create(
    name="Mama Mboga Traders",
    organization_type="WHOLESALER",
    phone_number="0722000000",
    location_name="Nairobi"
)

# 2. ensure a produce exists
farmer, _ = Farmer.objects.get_or_create(name="Juma J.", phone_number="254700000000")
produce, _ = Produce.objects.get_or_create(
    farmer=farmer,
    crop_type="MAIZE",
    defaults={'quantity_kg': 1000, 'price_per_kg': 50, 'harvest_date': '2025-01-01'}
)

# 3. Simulate API Call (Create Order)
data = {
    'buyer': buyer.id,
    'produce': produce.id,
    'quantity_ordered_kg': 100,
    'total_price': 5000,
    'status': 'PENDING'
}

serializer = OrderSerializer(data=data)
if serializer.is_valid():
    view = OrderCreateView()
    view.perform_create(serializer)
    print("Order Created Successfully via Logic.")
else:
    print("Error:", serializer.errors)
