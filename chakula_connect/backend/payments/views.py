from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from market.models import Order
from .models import Transaction
from chakula_connect.utils.mpesa import trigger_stk_push
import uuid

class InitiatePaymentView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        order_id = request.data.get('order_id')
        phone_number = request.data.get('phone_number')

        if not order_id or not phone_number:
            return Response({"error": "order_id and phone_number are required"}, status=status.HTTP_400_BAD_REQUEST)

        order = get_object_or_404(Order, order_id=order_id)
        
        # 1. Create Pending Transaction
        transaction_ref = f"TX{uuid.uuid4().hex[:8].upper()}"
        Transaction.objects.create(
            order=order,
            transaction_id=transaction_ref,
            amount=order.total_price,
            phone_number=phone_number,
            status='PENDING'
        )

        # 2. Trigger STK Push (Simulation)
        mpesa_res = trigger_stk_push(phone_number, order.total_price, transaction_ref)

        # 3. Simulate Instant Payment Confirmation (Hook logic would go here in prod)
        if mpesa_res['ResponseCode'] == '0':
            # Update Transaction
            trans = Transaction.objects.get(transaction_id=transaction_ref)
            trans.status = 'COMPLETED'
            trans.save()
            
            # Update Order
            order.status = 'PAID'
            order.save()

            return Response({
                "message": "Payment initiated successfully", 
                "checkout_request_id": mpesa_res['CheckoutRequestID'],
                "status": "COMPLETED" # Simulating instant success
            }, status=status.HTTP_200_OK)
        
        return Response({"error": "Failed to initiate payment"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
