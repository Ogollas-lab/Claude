import uuid
import time

def trigger_stk_push(phone_number, amount, reference):
    """
    Simulates sending an STK Push via MPESA.
    Returns a success response with a simulated CheckoutRequestID.
    """
    print(f"--- MPESA STK PUSH ---")
    print(f"TO: {phone_number}")
    print(f"AMOUNT: {amount}")
    print(f"REF: {reference}")
    print(f"----------------------")
    
    # Simulate API Latency
    # time.sleep(1)
    
    return {
        "status": "success",
        "MerchantRequestID": str(uuid.uuid4()),
        "CheckoutRequestID": f"ws_CO_{int(time.time())}_{uuid.uuid4().hex[:4]}",
        "ResponseCode": "0",
        "ResponseDescription": "Success. Request accepted for processing",
        "CustomerMessage": "Success. Request accepted for processing"
    }
