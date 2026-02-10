from rest_framework import serializers
from .models import Order, Buyer
from farmers.models import Produce
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['order_id', 'buyer', 'produce', 'quantity_ordered_kg', 'total_price', 'status']

class OrderCreateSerializer(serializers.Serializer):
    produce_id = serializers.IntegerField()
    quantity_kg = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    # Buyer Details
    buyer_name = serializers.CharField(max_length=100)
    buyer_phone = serializers.CharField(max_length=15)
    buyer_location = serializers.CharField(max_length=100)
    buyer_type = serializers.ChoiceField(choices=[('SCHOOL', 'School'), ('HOSPITAL', 'Hospital'), ('WHOLESALER', 'Wholesaler'), ('NGO', 'NGO')])

    def create(self, validated_data):
        # 1. Get or Create Buyer
        buyer, created = Buyer.objects.get_or_create(
            phone_number=validated_data['buyer_phone'],
            defaults={
                'name': validated_data['buyer_name'],
                'location_name': validated_data['buyer_location'],
                'organization_type': validated_data['buyer_type']
            }
        )

        # 2. Get Produce
        state_produce = Produce.objects.get(id=validated_data['produce_id'])
        
        # 3. Calculate Total Price
        total_price = state_produce.price_per_kg * validated_data['quantity_kg']

        # 4. Create Order
        order = Order.objects.create(
            buyer=buyer,
            produce=state_produce,
            quantity_ordered_kg=validated_data['quantity_kg'],
            total_price=total_price,
            status='PENDING'
        )
        return order
