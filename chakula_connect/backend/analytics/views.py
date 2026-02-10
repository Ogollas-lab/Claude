from django.http import JsonResponse
from farmers.models import Produce, Farmer
from django.db.models import Sum
import random
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

def drought_map_data(request):
    """
    Returns data for the Okoa Heatmap.
    Combines:
    1. Real Farmer Produce Locations (Surplus 'Green' Zones)
    2. Mocked Sentinel-2 Satellite Data (Drought 'Red' Zones)
    """

    # 1. Get Food Surplus Data
    surplus_data = []
    farmers_with_produce = Farmer.objects.filter(produce__available=True).distinct()
    
    for farmer in farmers_with_produce:
        total_qty = farmer.produce.filter(available=True).aggregate(Sum('quantity_kg'))['quantity_kg__sum'] or 0
        if farmer.latitude and farmer.longitude:
             surplus_data.append({
                'type': 'surplus',
                'lat': farmer.latitude,
                'lng': farmer.longitude,
                'weight': float(total_qty), # Weight for heatmap
                'details': f"{farmer.name}: {total_qty}kg produce"
            })

    # 2. Mock SentinelHub Data (Simulating drought in Northern Kenya)
    # In production, this would call SentinelHub API
    drought_zones = [
        {'lat': 3.116, 'lng': 35.600, 'severity': 0.9, 'region': 'Turkana'},
        {'lat': 2.500, 'lng': 37.000, 'severity': 0.8, 'region': 'Marsabit'},
        {'lat': 1.000, 'lng': 39.000, 'severity': 0.75, 'region': 'Wajir'},
    ]

    response_data = {
        'surplus_locations': surplus_data,
        'drought_zones': drought_zones,
        'metadata': {
            'source': 'Chakula-Connect Analytics Engine',
            'satellite_source': 'Sentinel-2 (Simulated)'
        }
    }

    return JsonResponse(response_data)

def price_forecast(request):
    """
    Predicts produce prices for the next 6 months using Linear Regression.
    Trains on mock historical data on-the-fly.
    """
    
    # 1. Mock Historical Data (Last 12 months)
    # Seasonal trend simulation: Lower prices in harvest season (Month 6-8)
    data = {
        'month_index': np.arange(1, 13), # Months 1-12
        'price': [45, 48, 52, 55, 60, 40, 35, 38, 42, 45, 50, 55] # Simulating seasonality + inflation
    }
    df = pd.DataFrame(data)

    # 2. Train Model
    model = LinearRegression()
    model.fit(df[['month_index']], df['price'])

    # 3. Forecast Next 6 Months
    future_months = np.arange(13, 19).reshape(-1, 1)
    predictions = model.predict(future_months)

    # 4. Prepare Response Data
    months_labels = []
    current_date = datetime.now()
    
    # Generate labels for past 12 months + future 6 months
    for i in range(12):
        d = current_date - timedelta(days=30 * (11-i))
        months_labels.append(d.strftime("%b"))
        
    for i in range(6):
        d = current_date + timedelta(days=30 * (i+1))
        months_labels.append(d.strftime("%b"))

    # Combine historical and forecast data for charting
    # Historical array needs defaults for future, Forecast needs defaults for past
    historical_series = data['price'] + [None] * 6
    forecast_series = [None] * 11 + [data['price'][-1]] + list(predictions)

    return JsonResponse({
        'labels': months_labels,
        'datasets': [
            {
                'label': 'Historical Market Rate',
                'data': historical_series,
                'borderColor': '#10B981', # Brand Green
                'fill': False,
                'tension': 0.4
            },
            {
                'label': 'AI Forecast (Next 6 Months)',
                'data': forecast_series,
                'borderColor': '#F59E0B', # Brand Accent (Amber)
                'borderDash': [5, 5],
                'fill': False,
                'tension': 0.4
            }
        ],
        'trend': 'UP' if predictions[-1] > data['price'][-1] else 'DOWN',
        'predicted_increase': round(((predictions[-1] - data['price'][-1]) / data['price'][-1]) * 100, 1)
    })
