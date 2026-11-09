# RouteSense — Smart Route & Delivery Risk Intelligence Platform 🚚✨

[![React](https://img.shields.io/badge/React-18-blue.svg?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.11-yellow.svg?logo=python)](https://python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1-black.svg?logo=flask)](https://flask.palletsprojects.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.9-orange.svg?logo=scikit-learn)](https://scikit-learn.org/)
[![Deployed on Render](https://img.shields.io/badge/Deployed-Render-46E3B7.svg?logo=render)](https://render.com/)

**RouteSense** is a full-stack, AI-powered logistics SaaS platform that predicts delivery delays, evaluates multi-modal freight route risks, and provides actionable mitigation strategies before shipments depart.

Built with a **warm orange visual theme**, modern glassmorphism, Framer Motion animations, interactive Leaflet map telemetry, and a trained **Random Forest Machine Learning model**.

---

## 🚀 Key Features

- 🧠 **AI-Powered Route Prediction**: Live ML model evaluation incorporating distance, carrier rating, traffic congestion, weather hazards, cargo weight, and transport mode (Truck, Air, Rail, Maritime).
- 🗺️ **Interactive Freight Corridor Navigator**: Leaflet-based interactive radar map with animated vehicle telemetry, route risk color coding, and corridor waypoints.
- 📊 **Logistics Operations Dashboard**: Real-time KPI counters, Recharts performance curves, risk distribution donuts, and corridor volume breakdowns.
- 🗂️ **Interactive Physical Card Deck**: Throwable, gesture-friendly shipment card stack with keyboard shortcuts (`←`/`→`) and deep-dive case modals.
- 🔐 **Authentication & Session Security**: Secure registration and session-based login with Werkzeug password hashing and MySQL persistence.
- 🎨 **Warm Modern Design**: Warm cream (`#FFF7ED`), peach (`#FED7AA`), and vibrant orange (`#F97316`) aesthetic, fully responsive across mobile, tablet, and desktop.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS v3, Framer Motion, Lucide Icons, Recharts, Leaflet / React-Leaflet |
| **Backend** | Python Flask, Gunicorn WSGI, Flask-CORS, Werkzeug Security, MySQL Connector |
| **Machine Learning** | Scikit-Learn (Random Forest Regressor & Classifier), Joblib, Pandas, NumPy |
| **Deployment** | Render Web Service (Unified Static + API Server), Docker, Railway |

---

## 📁 Repository Structure

```text
routesense-site/
├── backend/
│   ├── python-flask/
│   │   ├── app.py                     # Flask production server (API & static frontend)
│   │   ├── db.py                      # MySQL database connector & schema runner
│   │   ├── predict.py                 # ML pipeline loader & feature normalizer
│   │   ├── schema.sql                 # MySQL schema (users, shipments, predictions)
│   │   └── requirements.txt           # Python dependencies (Flask, scikit-learn, gunicorn)
│   └── server.js                      # Express API reference
├── frontend/
│   ├── src/
│   │   ├── components/                # React UI components (Hero, Map, Dashboard, Deck)
│   │   ├── config/api.js              # Dynamic API base URL configuration
│   │   └── index.css                  # Custom Tailwind styles & warm utilities
│   ├── dist/                          # Production compiled frontend assets
│   └── package.json
├── routesense_model.joblib            # Trained Random Forest ML pipeline (92 MB)
├── evaluation_metrics.json            # Model benchmark metrics (MAE, R2, Accuracy)
├── render.yaml                        # Render 1-click blueprint deployment
├── Dockerfile                         # Production multi-stage Docker build
├── docker-compose.yml                 # Local stack with MySQL container
├── DEPLOYMENT_GUIDE.md                # Comprehensive deployment instructions
└── package.json                       # Monorepo task runner
```

---

## 🔌 API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Serves production React UI (`index.html`) |
| `POST` | `/predict` | Public | Live ML delay and risk prediction |
| `GET` | `/api/model/metrics`| Public | ML model performance metrics |
| `POST` | `/register` | Public | User registration with password hashing |
| `POST` | `/login` | Public | User authentication & session initialization |
| `POST` | `/logout` | Public | Clears active session |
| `GET` | `/profile` | Protected | Authenticated user profile |
| `GET` | `/shipments` | Public | Retrieves active tracked shipments |
| `POST` | `/shipments` | Public | Creates a new shipment |
| `DELETE`| `/shipments/<id>` | Public | Deletes a tracked shipment |

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+
- (Optional) MySQL Server 8.0+

### 1. Clone the repository
```bash
git clone https://github.com/AS-Usman/Route_sense.git
cd Route_sense
```

### 2. Install dependencies
```bash
# Install frontend packages
npm --prefix frontend install

# Install Python backend packages
pip install -r backend/python-flask/requirements.txt
```

### 3. Start development servers
```bash
# Start Flask backend (port 5000)
python backend/python-flask/app.py

# In a separate terminal, start Vite frontend (port 5173)
npm run dev --prefix frontend
```
Visit `http://localhost:5173` to view the application with hot reloading.

---

## 🐳 Docker Deployment

Run the complete RouteSense stack with MySQL using Docker Compose:

```bash
docker compose up -d --build
```
The application will be live at `http://localhost:5000`.

---

## 🌐 Production Deployment (Render)

RouteSense is optimized for unified deployment on [Render](https://render.com):
- **Build Command**: `pip install -r backend/python-flask/requirements.txt`
- **Start Command**: `cd backend/python-flask && gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 4 --timeout 120 app:app`

For detailed step-by-step instructions across Render, Railway, Vercel, and VPS, see [DEPLOYMENT_GUIDE.md](file:///d:/Intern/routesense-site/DEPLOYMENT_GUIDE.md).

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
