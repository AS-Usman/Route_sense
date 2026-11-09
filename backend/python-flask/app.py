import os
import json
from functools import wraps
from flask import Flask, request, jsonify, session, send_from_directory
try:
    from flask_cors import CORS
    HAS_CORS = True
except ImportError:
    HAS_CORS = False
try:
    from mysql.connector import Error as DBError
except ImportError:
    DBError = Exception
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db_connection, init_db

# Load ML prediction model
try:
    from predict import predict_shipment
    HAS_ML_MODEL = True
except Exception as e:
    HAS_ML_MODEL = False
    print(f"Notice: Could not import predict_shipment: {e}")

METRICS_PATH = os.path.join(os.path.dirname(__file__), 'evaluation_metrics.json')
if not os.path.exists(METRICS_PATH):
    METRICS_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'evaluation_metrics.json')

POSSIBLE_DIST_DIRS = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'frontend', 'dist')),
    os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist')),
    os.path.abspath(os.path.join(os.path.dirname(__file__), 'frontend', 'dist')),
    os.path.abspath('frontend/dist'),
    os.path.abspath('../frontend/dist'),
    os.path.abspath('/app/frontend/dist')
]
DIST_DIR = next((p for p in POSSIBLE_DIST_DIRS if os.path.exists(p)), POSSIBLE_DIST_DIRS[0])

app = Flask(__name__, static_folder=DIST_DIR if os.path.exists(DIST_DIR) else None)
app.secret_key = os.getenv('SECRET_KEY', 'supplyiq_secret_key_day38_2026')

if HAS_CORS:
    allowed_origins = [
        "http://localhost:3000", "http://127.0.0.1:3000",
        "http://localhost:5000", "http://127.0.0.1:5000",
        "http://localhost:5173", "http://127.0.0.1:5173"
    ]
    frontend_env = os.getenv('FRONTEND_URL')
    if frontend_env:
        for u in frontend_env.split(','):
            if u.strip():
                allowed_origins.append(u.strip())
    
    CORS(app, supports_credentials=True, origins=allowed_origins if not os.getenv('CORS_ALLOW_ALL') else "*")

# Initialize database schema on startup
with app.app_context():
    init_db()


def login_required(f):
    """
    Decorator to restrict access to authenticated users with active Flask sessions.
    Returns HTTP 401 if user_id is not present in session.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Login required"}), 401
        return f(*args, **kwargs)
    return decorated


def format_shipment(row):
    """Formats a database row tuple into a structured dictionary."""
    if not row:
        return None
    return {
        "id": row[0],
        "shipment_id": row[1],
        "origin": row[2],
        "destination": row[3],
        "distance": float(row[4]),
        "weather": row[5],
        "route_risk": row[6],
        "delivery_status": row[7],
        "delay_days": int(row[8]),
        "created_at": row[9].isoformat() if row[9] else None,
        "updated_at": row[10].isoformat() if row[10] else None
    }


def get_identifier_condition(identifier):
    """
    Returns SQL WHERE clause and parameter tuple depending on whether
    identifier is an integer PK or a string shipment_id.
    Prevents MySQL type casting warning/error 1292.
    """
    ident_str = str(identifier).strip()
    if ident_str.isdigit():
        return "(id = %s OR shipment_id = %s)", (int(ident_str), ident_str)
    else:
        return "shipment_id = %s", (ident_str,)


# ==========================================================
# HEALTH CHECK ENDPOINT → GET /health or /api/health
# ==========================================================
@app.route('/health', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health-check endpoint confirming SupplyIQ Flask backend & ML status."""
    return jsonify({
        "status": "running",
        "message": "SupplyIQ backend is running",
        "version": "1.0.0",
        "project": "SupplyIQ — Delivery Delay & Route Risk Predictor",
        "stage": "Day 40 — ML Model Integration & API Architecture",
        "ml_model_loaded": HAS_ML_MODEL
    }), 200


# ==========================================================
# DAY 40: ML PREDICTION ENGINE & PERSISTENCE
# ==========================================================

def execute_prediction(data):
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid or missing JSON payload"}), 400

    if not HAS_ML_MODEL:
        return jsonify({"error": "RouteSense ML model is not available on server"}), 503

    try:
        prediction = predict_shipment(data)
    except Exception as e:
        return jsonify({"error": "ML model inference failed", "details": str(e)}), 500

    shipment_code = data.get("shipment_id") or data.get("shipmentCode")
    persisted = False
    prediction_id = None

    # Link to shipments table if shipment_id exists
    if shipment_code:
        try:
            where_clause, params = get_identifier_condition(shipment_code)
            connection = get_db_connection()
            cursor = connection.cursor()
            cursor.execute(f"SELECT id FROM shipments WHERE {where_clause}", params)
            match = cursor.fetchone()

            if match:
                target_id = match[0]
                cursor.execute("""
                    INSERT INTO predictions (shipment_id, predicted_risk, prediction_confidence)
                    VALUES (%s, %s, %s)
                """, (target_id, prediction["predicted_risk"], prediction["confidence_score"]))
                prediction_id = cursor.lastrowid
                persisted = True

            cursor.close()
            connection.close()
        except Exception as e:
            print(f"Notice: Could not persist prediction to database: {e}")

    result = {
        "status": "success",
        "shipment_id": shipment_code,
        "predicted_risk": prediction["predicted_risk"],
        "risk_level": prediction["risk_level"],
        "risk_score": prediction["risk_score"],
        "confidence_score": prediction["confidence_score"],
        "risk_confidence": prediction["risk_confidence"],
        "estimated_delay_hours": prediction["estimated_delay_hours"],
        "estimated_delay_days": prediction["estimated_delay_days"],
        "recommendation": prediction["recommendation"],
        "recommendations": prediction["recommendations"],
        "model_info": prediction["model_info"],
        "inputs_normalized": prediction["inputs_normalized"],
        "persisted_in_database": persisted,
        "prediction_id": prediction_id
    }
    return jsonify(result), 200


# 1. Day 40 Protected ML Prediction Endpoint → POST /api/predict
@app.route('/api/predict', methods=['POST'])
@login_required
def api_predict():
    """Predict delivery delay & route risk (Requires active user session)."""
    return execute_prediction(request.get_json(silent=True))


# 2. Public ML Prediction Endpoint → POST /predict
@app.route('/predict', methods=['POST'])
def public_predict():
    """Predict delivery delay & route risk (Open access for web UI & guest usage)."""
    return execute_prediction(request.get_json(silent=True))


# 3. Model Evaluation Metrics Endpoint → GET /api/model/metrics
@app.route('/api/model/metrics', methods=['GET'])
@app.route('/model/metrics', methods=['GET'])
def get_model_metrics():
    """Returns trained RouteSense Random Forest model accuracy & evaluation report."""
    if os.path.exists(METRICS_PATH):
        try:
            with open(METRICS_PATH, 'r', encoding='utf-8') as f:
                metrics = json.load(f)
            return jsonify(metrics), 200
        except Exception as e:
            return jsonify({"error": "Failed to read metrics file", "details": str(e)}), 500
    return jsonify({"error": "Evaluation metrics not found"}), 404


# 4. Predictions History Endpoint → GET /api/predictions
@app.route('/api/predictions', methods=['GET'])
def get_prediction_history():
    """Returns recently recorded ML predictions from the database."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = """
            SELECT p.id, p.shipment_id, s.shipment_id as shipment_code, s.origin, s.destination,
                   p.predicted_risk, p.prediction_confidence, p.created_at
            FROM predictions p
            LEFT JOIN shipments s ON p.shipment_id = s.id
            ORDER BY p.id DESC LIMIT 50
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        cursor.close()
        connection.close()

        results = [
            {
                "id": r[0],
                "shipment_pk": r[1],
                "shipment_code": r[2],
                "origin": r[3],
                "destination": r[4],
                "predicted_risk": r[5],
                "prediction_confidence": float(r[6]) if r[6] is not None else None,
                "created_at": r[7].isoformat() if r[7] else None
            }
            for r in rows
        ]
        return jsonify(results), 200
    except (DBError, Exception) as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500


# ==========================================================
# DAY 37: USER REGISTRATION → POST /register
# ==========================================================
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid or missing JSON payload"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not str(username).strip():
        return jsonify({"error": "Username is required"}), 400

    if not password or not str(password).strip():
        return jsonify({"error": "Password is required"}), 400

    username_clean = str(username).strip()
    raw_password = str(password).strip()

    # Hash password securely using Werkzeug
    password_hash = generate_password_hash(raw_password)

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = "INSERT INTO users (username, password_hash) VALUES (%s, %s)"
        cursor.execute(query, (username_clean, password_hash))
        inserted_id = cursor.lastrowid

        cursor.close()
        connection.close()

        return jsonify({
            "message": "User registered successfully",
            "id": inserted_id,
            "username": username_clean
        }), 201

    except (DBError, Exception) as e:
        if "Duplicate entry" in str(e) or "UNIQUE constraint" in str(e) or getattr(e, 'errno', None) == 1062:
            return jsonify({"error": f"Username '{username_clean}' already exists"}), 409
        return jsonify({"error": "Database error", "details": str(e)}), 500


# ==========================================================
# DAY 38: SESSIONS & LOGIN FLOW
# ==========================================================

# 1. POST /login → Verify credentials & establish Flask session
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid or missing JSON payload"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not str(username).strip() or not password or not str(password).strip():
        return jsonify({"error": "Username and password are required"}), 400

    username_clean = str(username).strip()
    raw_password = str(password).strip()

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = "SELECT id, username, password_hash FROM users WHERE username = %s"
        cursor.execute(query, (username_clean,))
        user_row = cursor.fetchone()

        cursor.close()
        connection.close()

        if not user_row or not check_password_hash(user_row[2], raw_password):
            return jsonify({"error": "Invalid username or password"}), 401

        session['user_id'] = user_row[0]
        session['username'] = user_row[1]

        return jsonify({
            "message": f"Welcome back, {user_row[1]}!",
            "user_id": user_row[0],
            "username": user_row[1]
        }), 200

    except (DBError, Exception) as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500


# 2. GET /profile → Protected Route requiring login session
@app.route('/profile', methods=['GET'])
@login_required
def profile():
    return jsonify({
        "message": "Authenticated",
        "user_id": session.get("user_id"),
        "username": session.get("username")
    }), 200


# 3. POST /logout → Terminate active Flask session
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({
        "message": "Logged out successfully"
    }), 200


# ==========================================================
# DAY 36: SHIPMENT CRUD ENDPOINTS (Preserved)
# ==========================================================

# 1. CREATE → POST /shipments
@app.route('/shipments', methods=['POST'])
def create_shipment():
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid or missing JSON payload"}), 400

    required_fields = ["shipment_id", "origin", "destination", "distance", "weather", "route_risk", "delivery_status"]
    missing_fields = [field for field in required_fields if field not in data or data[field] is None or str(data[field]).strip() == ""]
    if missing_fields:
        return jsonify({
            "error": "Missing required shipment fields",
            "missing": missing_fields
        }), 400

    try:
        shipment_id = str(data["shipment_id"]).strip()
        origin = str(data["origin"]).strip()
        destination = str(data["destination"]).strip()
        distance = float(data["distance"])
        weather = str(data["weather"]).strip()
        route_risk = str(data["route_risk"]).strip()
        delivery_status = str(data["delivery_status"]).strip()
        delay_days = int(data.get("delay_days", 0))

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO shipments 
            (shipment_id, origin, destination, distance, weather, route_risk, delivery_status, delay_days)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (shipment_id, origin, destination, distance, weather, route_risk, delivery_status, delay_days))
        inserted_id = cursor.lastrowid

        # Retrieve created record
        cursor.execute("""
            SELECT id, shipment_id, origin, destination, distance, weather, route_risk, delivery_status, delay_days, created_at, updated_at
            FROM shipments WHERE id = %s
        """, (inserted_id,))
        new_row = cursor.fetchone()

        cursor.close()
        connection.close()

        return jsonify({
            "message": "Shipment created successfully",
            "shipment": format_shipment(new_row)
        }), 201

    except (DBError, Exception) as e:
        if "Duplicate entry" in str(e) or "UNIQUE constraint" in str(e) or getattr(e, 'errno', None) == 1062:
            return jsonify({"error": f"Shipment ID '{data.get('shipment_id')}' already exists"}), 400
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except ValueError as e:
        return jsonify({"error": "Invalid data format for distance or delay_days", "details": str(e)}), 400


# 2. READ ALL → GET /shipments
@app.route('/shipments', methods=['GET'])
def get_all_shipments():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            SELECT id, shipment_id, origin, destination, distance, weather, route_risk, delivery_status, delay_days, created_at, updated_at
            FROM shipments 
            ORDER BY id ASC
        """
        cursor.execute(query)
        rows = cursor.fetchall()

        cursor.close()
        connection.close()

        shipments_list = [format_shipment(row) for row in rows]
        return jsonify(shipments_list), 200

    except (DBError, Exception) as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500


# 3. READ SINGLE → GET /shipments/<id>
@app.route('/shipments/<identifier>', methods=['GET'])
def get_shipment(identifier):
    try:
        where_clause, params = get_identifier_condition(identifier)
        connection = get_db_connection()
        cursor = connection.cursor()

        query = f"""
            SELECT id, shipment_id, origin, destination, distance, weather, route_risk, delivery_status, delay_days, created_at, updated_at
            FROM shipments 
            WHERE {where_clause}
        """
        cursor.execute(query, params)
        row = cursor.fetchone()

        cursor.close()
        connection.close()

        if not row:
            return jsonify({"error": f"Shipment '{identifier}' not found"}), 404

        return jsonify(format_shipment(row)), 200

    except (DBError, Exception) as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500


# 4. UPDATE → PUT /shipments/<id>
@app.route('/shipments/<identifier>', methods=['PUT'])
def update_shipment(identifier):
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid or missing JSON payload"}), 400

    allowed_fields = ["shipment_id", "origin", "destination", "distance", "weather", "route_risk", "delivery_status", "delay_days"]
    update_clause = []
    params = []

    for field in allowed_fields:
        if field in data and data[field] is not None:
            update_clause.append(f"{field} = %s")
            if field == "distance":
                params.append(float(data[field]))
            elif field == "delay_days":
                params.append(int(data[field]))
            else:
                params.append(str(data[field]).strip())

    if not update_clause:
        return jsonify({"error": "No valid fields provided for update"}), 400

    try:
        where_clause, id_params = get_identifier_condition(identifier)

        connection = get_db_connection()
        cursor = connection.cursor()

        # Check if shipment exists
        cursor.execute(f"SELECT id FROM shipments WHERE {where_clause}", id_params)
        existing = cursor.fetchone()
        if not existing:
            cursor.close()
            connection.close()
            return jsonify({"error": f"Shipment '{identifier}' not found"}), 404

        target_id = existing[0]

        sql_update = f"UPDATE shipments SET {', '.join(update_clause)} WHERE id = %s"
        params.append(target_id)
        cursor.execute(sql_update, tuple(params))

        # Retrieve updated shipment record
        cursor.execute("""
            SELECT id, shipment_id, origin, destination, distance, weather, route_risk, delivery_status, delay_days, created_at, updated_at
            FROM shipments WHERE id = %s
        """, (target_id,))
        updated_row = cursor.fetchone()

        cursor.close()
        connection.close()

        return jsonify({
            "message": "Shipment updated successfully",
            "shipment": format_shipment(updated_row)
        }), 200

    except (DBError, Exception) as e:
        if "Duplicate entry" in str(e) or "UNIQUE constraint" in str(e) or getattr(e, 'errno', None) == 1062:
            return jsonify({"error": "Duplicate shipment_id in update"}), 400
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except ValueError as e:
        return jsonify({"error": "Invalid data format for distance or delay_days", "details": str(e)}), 400


# 5. DELETE → DELETE /shipments/<id>
@app.route('/shipments/<identifier>', methods=['DELETE'])
def delete_shipment(identifier):
    try:
        where_clause, id_params = get_identifier_condition(identifier)

        connection = get_db_connection()
        cursor = connection.cursor()

        # Check if shipment exists
        cursor.execute(f"SELECT id, shipment_id FROM shipments WHERE {where_clause}", id_params)
        existing = cursor.fetchone()
        if not existing:
            cursor.close()
            connection.close()
            return jsonify({"error": f"Shipment '{identifier}' not found"}), 404

        target_id = existing[0]
        shipment_code = existing[1]

        delete_query = "DELETE FROM shipments WHERE id = %s"
        cursor.execute(delete_query, (target_id,))

        cursor.close()
        connection.close()

        return jsonify({
            "message": f"Shipment '{identifier}' deleted successfully",
            "deleted_id": target_id,
            "shipment_id": shipment_code
        }), 200

    except (DBError, Exception) as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500


# ==========================================================
# DAY 40: PROTECTED /api/shipments CRUD ENDPOINTS
# ==========================================================
@app.route('/api/shipments', methods=['POST'])
@login_required
def api_create_shipment():
    """Create shipment under /api namespace (Protected by session)."""
    return create_shipment()


@app.route('/api/shipments', methods=['GET'])
@login_required
def api_get_all_shipments():
    """Get all shipments under /api namespace (Protected by session)."""
    return get_all_shipments()


@app.route('/api/shipments/<identifier>', methods=['GET'])
@login_required
def api_get_shipment(identifier):
    """Get single shipment under /api namespace (Protected by session)."""
    return get_shipment(identifier)


@app.route('/api/shipments/<identifier>', methods=['PUT'])
@login_required
def api_update_shipment(identifier):
    """Update shipment under /api namespace (Protected by session)."""
    return update_shipment(identifier)


@app.route('/api/shipments/<identifier>', methods=['DELETE'])
@login_required
def api_delete_shipment(identifier):
    """Delete shipment under /api namespace (Protected by session)."""
    return delete_shipment(identifier)


# Serve built Vite frontend if dist directory exists
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    # API endpoints under /api/ that didn't match return 404 JSON
    if path.startswith('api/'):
        return jsonify({"error": "Resource or endpoint not found"}), 404

    # Friendly page aliases for browser navigation:
    page_aliases = {
        'register': 'register.html',
        'login': 'register.html',
        'signin': 'register.html',
        'signup': 'register.html',
        'predictor': 'predictor.html',
        'predict': 'predictor.html',
        'dashboard': 'dashboard.html',
        'shipments': 'shipments.html',
        'features': 'features.html',
        'contact': 'contact.html'
    }

    if os.path.exists(DIST_DIR):
        # 1. Check page aliases first (e.g. /register -> register.html)
        if path in page_aliases:
            alias_target = page_aliases[path]
            if os.path.exists(os.path.join(DIST_DIR, alias_target)):
                return send_from_directory(DIST_DIR, alias_target)

        # 2. Exact file match (e.g., register.html, predictor.html, assets/main.js, favicon.ico)
        candidate = os.path.join(DIST_DIR, path)
        if path and os.path.exists(candidate) and not os.path.isdir(candidate):
            return send_from_directory(DIST_DIR, path)

        # 3. Path + '.html' match (e.g. /predictor -> predictor.html)
        if path and os.path.exists(candidate + '.html'):
            return send_from_directory(DIST_DIR, path + '.html')

        # 4. Root route
        if not path:
            return send_from_directory(DIST_DIR, 'index.html')

        # 5. Default fallback to index.html for SPA routing
        return send_from_directory(DIST_DIR, 'index.html')

    return jsonify({
        "status": "online",
        "service": "RouteSense Flask API",
        "endpoints": ["/predict", "/shipments", "/login", "/register", "/profile", "/api/model/metrics"]
    })


# Error Handlers
@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0")
    debug = os.environ.get("FLASK_ENV") != "production"
    print("=================================================")
    print(f"Starting RouteSense Flask API Server (Port {port})")
    print(f"Serving frontend from: {DIST_DIR} (exists: {os.path.exists(DIST_DIR)})")
    print("=================================================")
    app.run(host=host, port=port, debug=debug)
