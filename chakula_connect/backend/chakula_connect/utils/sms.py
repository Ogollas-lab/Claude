import os

def send_sms(phone_number, message):
    """
    Simulates sending an SMS via Africa's Talking.
    In production, this would use africastalking SDK.
    """
    print(f"--- SMS SENT ---")
    print(f"TO: {phone_number}")
    print(f"MSG: {message}")
    print(f"----------------")
    
    # Simulating API response
    return {"status": "success", "recipient": phone_number}
