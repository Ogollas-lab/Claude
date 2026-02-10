from rest_framework import serializers
from .models import Farmer, Produce

class ProduceSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.name', read_only=True)
    location_name = serializers.CharField(source='farmer.location_name', read_only=True)

    class Meta:
        model = Produce
        fields = ['id', 'crop_type', 'quantity_kg', 'price_per_kg', 'farmer_name', 'location_name', 'harvest_date', 'listed_at']

class FarmerSerializer(serializers.ModelSerializer):
    produce = ProduceSerializer(many=True, required=False)

    class Meta:
        model = Farmer
        fields = ['id', 'name', 'phone_number', 'latitude', 'longitude', 'location_name', 'produce']

    def create(self, validated_data):
        produce_data = validated_data.pop('produce', [])
        farmer = Farmer.objects.create(**validated_data)
        for prod in produce_data:
            Produce.objects.create(farmer=farmer, **prod)
        return farmer
