# SupplyIQ — Delivery Delay & Route Risk Predictor

**Full Stack AI Developer Training — Days 36, 37, 38 & 39 Deliverable: Flask + MySQL Backend**

SupplyIQ is an intelligent logistics and supply chain predictor designed to analyze route risks and delivery delay exposures. 

- **Day 36**: Core RESTful CRUD API for managing shipment data (`/shipments`) with MySQL persistence.
- **Day 37**: Authentication Basics featuring user registration (`POST /register`) with secure password hashing (`werkzeug.security.generate_password_hash`) and MySQL `users` table storage.
- **Day 38**: Sessions & Login Flow featuring credential authentication (`POST /login`), password verification (`check_password_hash`), `@login_required` decorator, protected route (`GET /profile`), and session termination (`POST /logout`).
- **Day 39**: Individual Backend Project Kickoff & Scaffolding (`routes_plan.md`, `predictions` table in MySQL `schema.sql`, working `GET /` health-check, and Day 40 TODO placeholders).

---

## 📁 Project Structure

```
RouteSense / SupplyIQ (d:/Intern/routesense-site/)
│
├── backend/
│   ├── server.js                 # Active Node.js / Express REST API server
│   ├── routes/                   # Express routes (shipments, risk, health)
│   ├── controllers/              # Business logic controllers
│   └── python-flask/             # Python Flask reference backend
│       ├── app.py                # Flask app with CRUD, Auth & Scaffolding
│       ├── db.py                 # Centralized MySQL database connection & schema executor
│       ├── schema.sql            # MySQL database schema
│       ├── routes_plan.md        # API Route Architecture Plan
│       └── requirements.txt      # Python dependencies
│
├── frontend/                     # Vite + React frontend application
│   ├── src/                      # Component architecture and hooks
│   └── package.json
│
├── .env                          # Shared environment variables
├── package.json                  # Root monorepo script orchestrator
└── README.md                     # Setup and documentation
```

---

## ⚙️ 1. Configuration & MySQL Schema Setup

> [!WARNING]
> **Security Notice**: If `.env` has been committed to a remote repository (e.g. GitHub), remove it from git tracking immediately (`git rm --cached .env`) and rotate your local MySQL root password to prevent unauthorized access. Use `.env.example` as a template.

Ensure MySQL Server is running on port `3306`. Configure credentials in `.env`:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=Usman@123
MYSQL_DB=supplyiq

FLASK_ENV=development
PORT=5000
SECRET_KEY=supplyiq_secret_key_day38_2026
```

### Complete Database Schema (`schema.sql`)
Running `python app.py` or `python db.py` automatically initializes all three tables:

```sql
CREATE DATABASE IF NOT EXISTS supplyiq;
USE supplyiq;

-- Shipments Table (Day 36)
CREATE TABLE IF NOT EXISTS shipments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shipment_id VARCHAR(50) NOT NULL UNIQUE,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    distance FLOAT NOT NULL,
    weather VARCHAR(50) NOT NULL,
    route_risk VARCHAR(50) NOT NULL,
    delivery_status VARCHAR(50) NOT NULL,
    delay_days INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users Table (Day 37)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Predictions Table (Day 39)
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shipment_id INT NOT NULL,
    predicted_risk VARCHAR(50) NOT NULL,
    prediction_confidence FLOAT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);
```

---

## 🔌 2. API Endpoint Overview

| HTTP Method | Endpoint | Protection | Purpose | Status Code |
|---|---|---|---|---|
| `GET` | `/` | Public | Backend Health Check | `200 OK` |
| `POST` | `/register` | Public | Register user with Werkzeug password hashing | `201 Created` |
| `POST` | `/login` | Public | User login & session creation | `200 OK` |
| `POST` | `/logout` | Public | Clear active session | `200 OK` |
| `GET` | `/profile` | `@login_required` | Protected profile info | `200 OK` / `401` |
| `GET/POST/PUT/DELETE` | `/shipments` | Public | Day 36 Shipment CRUD operations | `200 OK` / `201` |
| `POST` | `/api/predict` | `@login_required` | ML Model Delay Prediction *(Day 40 TODO)* | Scaffolding |

---

## 🧪 3. Day 39 Health Check Endpoint

- **Request:** `GET http://127.0.0.1:5000/`
- **Response (`200 OK`):**
  ```json
  {
    "message": "SupplyIQ backend is running",
    "project": "SupplyIQ — Delivery Delay & Route Risk Predictor",
    "stage": "Day 39 — Individual Backend Project Kickoff & Scaffolding",
    "status": "running",
    "version": "1.0.0"
  }
  ```

---

## ✅ Day 39 Completion Checklist
- [x] API routes planned and documented in [routes_plan.md](file:///d:/Intern/routesense-site/routes_plan.md)
- [x] MySQL schema updated in `schema.sql` with `users`, `shipments`, and `predictions` tables
- [x] `predictions` table created with foreign key referencing `shipments(id)`
- [x] Flask skeleton running with working `GET /` health-check endpoint (`200 OK`)
- [x] Scaffolding placeholders and explicit `# TODO Day 40` comments placed in `app.py`
- [x] Existing Day 36 shipment CRUD, Day 37 user registration, and Day 38 session authentication remain 100% operational
