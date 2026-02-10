import os
import django
import sys

# Setup Django Environment
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chakula_connect.settings')
django.setup()

from django.contrib.auth.models import User

# Create a test user if it doesn't exist
username = "agent"
password = "password123"
email = "agent@chakula.co.ke"

if not User.objects.filter(username=username).exists():
    User.objects.create_user(username=username, email=email, password=password)
    print(f"User '{username}' created successfully.")
else:
    print(f"User '{username}' already exists.")
