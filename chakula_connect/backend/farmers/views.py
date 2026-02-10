from rest_framework import generics
from .serializers import FarmerSerializer
from .models import Farmer

# ... existing ussd_callback ...

class FarmerCreateView(generics.ListCreateAPIView):
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer

from django.views.decorators.csrf import csrf_exempt
from .models import Farmer, Produce
import datetime

@csrf_exempt
def ussd_callback(request):
    if request.method == 'POST':
        session_id = request.POST.get('sessionId')
        service_code = request.POST.get('serviceCode')
        phone_number = request.POST.get('phoneNumber')
        text = request.POST.get('text', '')

        response = ""

        # Logic for USSD menu
        if text == "":
            # Main Menu
            response = "CON Welcome to Chakula-Connect\n"
            response += "1. Register Farmer\n"
            response += "2. Post Harvest (Vuna)\n"
            response += "3. Check Market Prices"
        
        elif text == "1":
            # Register Option
            response = "CON Enter your Full Name:"
        
        elif text.startswith("1*"):
            # Registration Process
            parts = text.split("*")
            if len(parts) == 2:
                name = parts[1]
                # Save farmer logic
                Farmer.objects.get_or_create(phone_number=phone_number, defaults={'name': name})
                response = f"END You have been registered as {name}. Dial *123# to post harvest."
        
        elif text == "2":
            # Post Harvest
            response = "CON Select Crop:\n"
            response += "1. Maize\n"
            response += "2. Beans\n"
            response += "3. Potatoes"

        elif text.startswith("2*"):
            parts = text.split("*")
            if len(parts) == 2: # Selected Crop
                response = "CON Enter Quantity (in Kg):"
            elif len(parts) == 3: # Entered Quantity
                response = "CON Enter Price per Kg (KES):"
            elif len(parts) == 4: # Entered Price
                crop_map = {'1': 'MAIZE', '2': 'BEANS', '3': 'POTATOES'}
                crop_code = parts[1]
                quantity = parts[2]
                price = parts[3]
                
                crop_name = crop_map.get(crop_code, "UNKNOWN")
                
                try:
                    farmer = Farmer.objects.get(phone_number=phone_number)
                    Produce.objects.create(
                        farmer=farmer,
                        crop_type=crop_name,
                        quantity_kg=float(quantity),
                        price_per_kg=float(price),
                        harvest_date=datetime.date.today()
                    )
                    response = f"END Posted {quantity}kg of {crop_name} @ {price} KES/kg. Buyer alerts sent!"
                except Farmer.DoesNotExist:
                    response = "END Please register first (Option 1)."
                except ValueError:
                    response = "END Invalid input. Please try again."

        elif text == "3":
             response = "END Market Prices: Maize 50/kg, Beans 120/kg. Trend: Rising."

        else:
            response = "END Invalid option"

        return HttpResponse(response, content_type='text/plain')

    return HttpResponse("Method Not Allowed", status=405)
