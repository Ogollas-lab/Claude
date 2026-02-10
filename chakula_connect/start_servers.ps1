$currDir = Get-Location

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$currDir'; .\venv\Scripts\activate; cd backend; python manage.py runserver"

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$currDir'; cd frontend; npm run dev"

Write-Host "Servers are starting in separate windows..."
