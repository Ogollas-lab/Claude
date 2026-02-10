from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from market.models import Order, Buyer
from farmers.models import Farmer, Produce
from payments.models import Transaction
import datetime

class PaymentFlowTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.farmer = Farmer.objects.create(
            name="Test Farmer", phone_number="+254700000000"
        )
        self.produce = Produce.objects.create(
            farmer=self.farmer, crop_type="MAIZE", quantity_kg=100,
            price_per_kg=10, harvest_date=datetime.date.today()
        )
        self.buyer = Buyer.objects.create(
            name="Test Buyer", phone_number="+254711111111"
        )
        self.order = Order.objects.create(
            buyer=self.buyer, produce=self.produce, quantity_ordered_kg=10,
            total_price=100, status='PENDING', order_id="ORD123"
        )
        self.url = reverse('initiate_payment')

    def test_initiate_payment_success(self):
        data = {
            'order_id': self.order.order_id,
            'phone_number': self.buyer.phone_number
        }
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'COMPLETED')
        
        # Verify Transaction Created
        self.assertEqual(Transaction.objects.count(), 1)
        trans = Transaction.objects.first()
        self.assertEqual(trans.status, 'COMPLETED')
        self.assertEqual(trans.amount, 100)
        
        # Verify Order Updated
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, 'PAID')

    def test_initiate_payment_invalid_order(self):
        data = {
            'order_id': 'INVALID',
            'phone_number': self.buyer.phone_number
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
