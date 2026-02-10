# Chakula Connect

Chakula Connect is a digital marketplace designed to bridge the gap between farmers and bulk buyers (schools, hospitals, wholesalers) in Kenya. It streamlines the agricultural supply chain by providing a platform for direct trade, logistics coordination, and market analytics.

## 🚀 Features

-   **Marketplace**: Direct-to-consumer listings for farmers. Buyers can browse crops by type, price, and location.
-   **Farmer Management**: Profile management for farmers, including location geotagging and produce listing.
-   **Logistics**: Tools for coordinating transport and delivery of produce.
-   **Analytics**: Dashboard for tracking market trends, prices, and supply levels.
-   **Digital Payments**: Integration with MPESA (stk push) for secure transactions.
-   **Localization**: Full support for English and Swahili (Kiswahili) to ensure accessibility for all users.
-   **USSD Integration**: (Planned) Offline access for farmers via feature phones.

## 🛠 Tech Stack

### Backend
-   **Framework**: Django 4.2+ & Django REST Framework (DRF)
-   **Database**: SQLite (Development) / PostgreSQL (Production)
-   **Authentication**: JWT (JSON Web Tokens) via `djangorestframework-simplejwt`
-   **External APIs**: Africa's Talking (SMS/USSD/Payments)

### Frontend
-   **Framework**: React 19 (via Vite)
-   **Styling**: TailwindCSS 4.0
-   **State Management**: React Context API
-   **Maps**: Leaflet & React-Leaflet
-   **Charts**: Chart.js
-   **Icons**: Lucide React

## 📦 Installation & Setup

### Prerequisites
-   Python 3.8+
-   Node.js 18+
-   Git

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/macOS
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run migrations and create a superuser:
```bash
python manage.py migrate
python create_user.py  # Or: python manage.py createsuperuser
```

Start the development server:
```bash
python manage.py runserver
```
The API will be available at `http://127.0.0.1:8000/`.

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The application will launch at `http://localhost:5173/`.

## 📂 Project Structure

```
chakula_connect/
├── backend/                # Django Project
│   ├── chakra_connect/     # Project settings & URL config
│   ├── farmers/            # App: Farmer profiles & produce
│   ├── market/             # App: Marketplace & Orders
│   ├── logistics/          # App: Transport tracking
│   ├── analytics/          # App: Data visualization endpoints
│   ├── payments/           # App: MPESA integration
│   ├── manage.py           # Django CLI utility
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React Project (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page views (Dashboard, Marketplace, etc.)
│   │   ├── context/        # Global state (Auth, Language)
│   │   └── App.jsx         # Main application component
│   ├── package.json        # Node dependencies
│   └── vite.config.js      # Vite configuration
│
└── README.md               # Project Documentation
```

## 🤝 Contributing
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License
Distributed under the MIT License.
