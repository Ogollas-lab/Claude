from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from farmers.models import Farmer, Produce
from market.models import Buyer, Order
import datetime

class ProduceListViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.farmer = Farmer.objects.create(
            name="John Doe",
            phone_number="+254700000000",
            location_name="Nairobi"
        )
        self.produce = Produce.objects.create(
            farmer=self.farmer,
            crop_type="MAIZE",
            quantity_kg=100,
            price_per_kg=50,
            harvest_date=datetime.date.today()
        )
        self.url = reverse('product_list')

    def test_get_product_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if the list contains the product we created
        self.assertTrue(len(response.data) > 0)
        self.assertEqual(response.data[0]['crop_type'], 'MAIZE')
        self.assertEqual(response.data[0]['farmer_name'], 'John Doe')

    def test_filter_by_crop_type(self):
        response = self.client.get(self.url, {'crop_type': 'MAIZE'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        response = self.client.get(self.url, {'crop_type': 'BEANS'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_filter_by_price(self):
        response = self.client.get(self.url, {'max_price': 60})
        self.assertEqual(len(response.data), 1)
        
        response = self.client.get(self.url, {'max_price': 40})
        self.assertEqual(len(response.data), 0)

    def test_create_order_guest(self):
        url = reverse('order_create')
        data = {
            'produce_id': self.produce.id,
            'quantity_kg': 10,
            'buyer_name': 'Test Buyer',
            'buyer_phone': '+254711111111',
            'buyer_location': 'Westlands',
            'buyer_type': 'WHOLESALER'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(Buyer.objects.count(), 1)
        self.assertEqual(Buyer.objects.first().name, 'Test Buyer')
