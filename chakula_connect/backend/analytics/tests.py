from django.test import TestCase
from django.urls import reverse
from rest_framework import status
import json

class AnalyticsTest(TestCase):
    def test_price_forecast(self):
        url = reverse('price_forecast')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = json.loads(response.content)
        self.assertIn('datasets', data)
        self.assertIn('labels', data)
        self.assertIn('trend', data)
        self.assertIn('predicted_increase', data)
        
        # Verify forecast logic (simple check)
        # We expect 12 historical + 6 forecast points (18 total for forecast methods, 12 for hist)
        self.assertEqual(len(data['labels']), 18)
        self.assertEqual(len(data['datasets'][0]['data']), 18) # Historical + padding
        self.assertEqual(len(data['datasets'][1]['data']), 18) # Forecasting + padding
