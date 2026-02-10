import requests
import time

URL = "http://127.0.0.1:8000/ussd/"
PHONE = "+254712345678"
SESSION_ID = "12345"
SERVICE_CODE = "*123#"

def send_ussd(text):
    data = {
        'sessionId': SESSION_ID,
        'serviceCode': SERVICE_CODE,
        'phoneNumber': PHONE,
        'text': text
    }
    try:
        response = requests.post(URL, data=data)
        print(f"INPUT: '{text}' => RESPONSE: {response.text}")
        return response.text
    except Exception as e:
        print(f"Error: {e}")
        return None

print("--- Testing USSD Flow ---")

# 1. Main Menu
send_ussd("")

# 2. Register Farmer (Option 1)
send_ussd("1")

# 3. Enter Name (Option 1*John Doe)
send_ussd("1*John Doe")

# 4. Post Harvest (Option 2) - New Session context theoretically, but AT sends full text string history usually
# Actually, Africa's Talking sends the accumulated string e.g. "1*John Doe*2..." if in one go? 
# No, usually "text" parameter is the accumulative input string for the session.
# But for a NEW request after registration, we'd start over. 
# Let's simulate a NEW session for posting harvest.
print("\n--- New Session: Posting Harvest ---")
SESSION_ID = "67890"

# Main Menu
send_ussd("")

# Option 2 (Post Harvest)
send_ussd("2")

# Select Crop (Maize = 1) -> Text: "2*1"
send_ussd("2*1")

# Enter Quantity -> Text: "2*1*50"
send_ussd("2*1*50")

# Enter Price -> Text: "2*1*50*2000"
send_ussd("2*1*50*2000")
