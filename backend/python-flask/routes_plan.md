# SupplyIQ — API Routes Specification Plan (Day 39 & Day 40)

## 📌 Project Overview
**SupplyIQ** is an AI-driven logistics intelligence system that predicts delivery delay exposures and route risk factors based on shipment characteristics, distance, weather conditions, and carrier telemetry.

---

## 🗺️ API Route Design Matrix

| Method | Endpoint Route | Purpose | Auth Required (`login_required`) | Uses ML Model? | Stage | Status |
|---|---|---|---|---|---|---|
| `GET` | `/` | Backend Server Health Check & ML Status | ❌ Public | ❌ No | Day 39 | ✅ **Active** |
| `POST` | `/register` | User Registration with Werkzeug Hashing | ❌ Public | ❌ No | Day 37 | ✅ **Active** |
| `POST` | `/login` | User Login & Session Establishment | ❌ Public | ❌ No | Day 38 | ✅ **Active** |
| `POST` | `/logout` | User Logout & Session Invalidation | ❌ Public | ❌ No | Day 38 | ✅ **Active** |
| `GET` | `/profile` | User Profile & Active Session Metadata | ✅ `@login_required` | ❌ No | Day 38 | ✅ **Active** |
| `POST` | `/predict` | Public ML Prediction Endpoint | ❌ Public | ✅ **Yes (Random Forest)** | Day 40 | ✅ **Active** |
| `POST` | `/api/predict` | Protected ML Prediction & MySQL Persistence | ✅ `@login_required` | ✅ **Yes (Random Forest)** | Day 40 | ✅ **Active** |
| `GET` | `/api/model/metrics` | ML Model Evaluation Metrics (R², MAE, Accuracy) | ❌ Public | ✅ **Yes (Metrics Report)** | Day 40 | ✅ **Active** |
| `GET` | `/api/predictions` | Prediction History from MySQL Database | ❌ Public | ❌ No | Day 40 | ✅ **Active** |
| `POST` | `/api/shipments` | Create & Store Shipment Record | ✅ `@login_required` | ❌ No | Day 40 | ✅ **Active** |
| `GET` | `/api/shipments` | Retrieve History of Tracked Shipments | ✅ `@login_required` | ❌ No | Day 40 | ✅ **Active** |
| `GET` | `/api/shipments/<id>` | Retrieve Single Shipment Details | ✅ `@login_required` | ❌ No | Day 40 | ✅ **Active** |
| `PUT` | `/api/shipments/<id>` | Update Shipment Status / Delay Days | ✅ `@login_required` | ❌ No | Day 40 | ✅ **Active** |
| `DELETE` | `/api/shipments/<id>` | Delete Shipment Record | ✅ `@login_required` | ❌ No | Day 40 | ✅ **Active** |
| `GET/POST` | `/shipments` | Compatibility Endpoints for Web UI | ❌ Public | ❌ No | Day 36 | ✅ **Active** |

---

## 🔐 Authentication & Protection Architecture

- **Public Endpoints**: `/`, `/register`, `/login`, `/logout`, `/predict`, `/shipments`, `/api/model/metrics`, `/api/predictions`.
- **Protected Endpoints**: All `/api/shipments/*` endpoints, `/api/predict`, and `/profile` require an active Flask session cookie established via `/login`.
- **Decorator Enforcement**: Custom `@login_required` decorator checks `session.get('user_id')`. Unauthenticated requests to protected endpoints return `401 Unauthorized`:
  ```json
  { "error": "Login required" }
  ```

---

## 🤖 ML Prediction Route Architecture (`POST /api/predict` & `POST /predict`)

The ML prediction route is powered by a multi-output Random Forest ensemble (`routesense_model.joblib`) trained on 6,000 real-world shipment records.

### Model Evaluation Performance
- **Dataset Rows:** 6,000 (4,800 train / 1,200 test)
- **Delay Regression $R^2$ Score:** 0.902
- **Delay Mean Absolute Error:** 2.14 hours
- **Risk Classification Accuracy:** 81.7%

### Target Endpoint Specifications
- **Routes:** `POST /api/predict` (Protected) and `POST /predict` (Open)
- **Input Features (JSON):**
  ```json
  {
    "shipment_id": "SHP001",
    "origin": "Chennai",
    "destination": "Bangalore",
    "distance": 350.0,
    "weather": "Rainy",
    "transport_mode": "Truck",
    "cargo_weight": 4500,
    "carrier_rating": "A",
    "traffic_congestion": 45
  }
  ```
- **Output Format (JSON):**
  ```json
  {
    "status": "success",
    "shipment_id": "SHP001",
    "predicted_risk": "High",
    "risk_level": "High",
    "risk_score": 73,
    "confidence_score": 0.7794,
    "risk_confidence": 0.7794,
    "estimated_delay_days": 0.21,
    "estimated_delay_hours": 5.09,
    "recommendation": "Monitor telematics along primary transit corridor for unexpected bottlenecks.",
    "recommendations": [
      "Monitor telematics along primary transit corridor for unexpected bottlenecks."
    ],
    "model_info": "RandomForest Multi-Model (Trained on 6,000 shipments, R²=0.902, Acc=81.7%)",
    "persisted_in_database": true,
    "prediction_id": 14
  }
  ```

---

## 📝 Day 40 Implementation Checklist (Completed)

- [x] **Task 1**: Implemented `/api/shipments` CRUD routes with `@login_required` protection.
- [x] **Task 2**: Connected trained SupplyIQ ML model (`routesense_model.joblib`) inside `POST /api/predict` and `POST /predict`.
- [x] **Task 3**: Recorded prediction telemetry into the `predictions` table in MySQL (`id`, `shipment_id`, `predicted_risk`, `prediction_confidence`).
- [x] **Task 4**: Integrated live ML inference into frontend Mission-Control Predictor (`ShipmentRiskForm.jsx`).
- [x] **Task 5**: Added `GET /api/model/metrics` and `GET /api/predictions` endpoints.
- [x] **Task 6**: Performed end-to-end integration testing and verified all automated tests pass.
