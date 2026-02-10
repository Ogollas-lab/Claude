from rest_framework import generics, status
from rest_framework.response import Response
from .models import Order, Produce
from .serializers import OrderSerializer, UserSerializer, OrderCreateSerializer
from farmers.serializers import ProduceSerializer
from chakula_connect.utils.sms import send_sms
import uuid
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny

def order_list(request):
    orders = Order.objects.all().values(
        'order_id', 'buyer__name', 'produce__crop_type', 'quantity_ordered_kg', 'status'
    )
    return JsonResponse({'orders': list(orders)})

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer


class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderCreateSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = self.perform_create(serializer)
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        # 1. Save (Serializer handles creation logic)
        return serializer.save(order_id=str(uuid.uuid4())[:8].upper())
        
        # 2. Get Farmer Details
        farmer = order.produce.farmer
        
        # 3. Send SMS Alert
        msg = f"Habari {farmer.name}! Order #{order.order_id} placed for {order.quantity_ordered_kg}kg of your {order.produce.crop_type}. Buyer: {order.buyer.name}. Prepare for collection."
        send_sms(farmer.phone_number, msg)




class ProduceListView(generics.ListAPIView):
    serializer_class = ProduceSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        queryset = Produce.objects.filter(available=True)
        crop_type = self.request.query_params.get('crop_type', None)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        location = self.request.query_params.get('location', None)

        if crop_type:
            queryset = queryset.filter(crop_type=crop_type)
        if min_price:
            queryset = queryset.filter(price_per_kg__gte=min_price)
        if max_price:
            queryset = queryset.filter(price_per_kg__lte=max_price)
        if location:
            queryset = queryset.filter(farmer__location_name__icontains=location)
            
        return queryset
