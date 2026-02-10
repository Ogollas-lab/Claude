from django.contrib import admin
from django.urls import path
from farmers.views import ussd_callback, FarmerCreateView
from analytics.views import drought_map_data, price_forecast
from market.views import order_list, OrderCreateView, RegisterView, ProduceListView
from payments.views import InitiatePaymentView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='auth_register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('ussd/', ussd_callback, name='ussd_callback'),
    path('api/farmers/', FarmerCreateView.as_view(), name='farmer_list_create'),
    path('api/heatmap/', drought_map_data, name='drought_map'),
    path('api/analytics/forecast/', price_forecast, name='price_forecast'),
    path('api/orders/', order_list, name='order_list'),
    path('api/orders/create/', OrderCreateView.as_view(), name='order_create'),
    path('api/products/', ProduceListView.as_view(), name='product_list'),
    path('api/payments/initiate/', InitiatePaymentView.as_view(), name='initiate_payment'),
]
