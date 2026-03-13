from rest_framework import generics, status
from rest_framework.response import Response
from .models import Delivery, Carrier
from rest_framework import serializers

class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = '__all__'
        depth = 1

class DeliveryUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = ['status', 'carrier', 'pickup_time', 'delivery_time']

class DeliveryListView(generics.ListAPIView):
    """List all active deliveries"""
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer

class DeliveryUpdateView(generics.UpdateAPIView):
    """Update a delivery status (e.g. to IN_TRANSIT or DELIVERED)"""
    queryset = Delivery.objects.all()
    serializer_class = DeliveryUpdateSerializer
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        
        # If marked as delivered, also update the parent Order status
        delivery = self.get_object()
        if delivery.status == 'DELIVERED':
            delivery.order.status = 'DELIVERED'
            delivery.order.save()
            
        return response
