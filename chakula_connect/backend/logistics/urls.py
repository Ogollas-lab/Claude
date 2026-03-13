from django.urls import path
from .views import DeliveryListView, DeliveryUpdateView

urlpatterns = [
    path('deliveries/', DeliveryListView.as_view(), name='delivery_list'),
    path('deliveries/<int:id>/update/', DeliveryUpdateView.as_view(), name='delivery_update'),
]
