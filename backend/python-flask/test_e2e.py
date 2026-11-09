"""Full end-to-end test with Supabase."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from app import app
from db import get_db_connection

client = app.test_client()
passed = 0
failed = 0

def test(method, path, json=None, expected=None, label=""):
    global passed, failed
    if method == 'GET':
        r = client.get(path)
    elif method == 'POST':
        r = client.post(path, json=json, content_type='application/json')
    elif method == 'PUT':
        r = client.put(path, json=json, content_type='application/json')
    elif method == 'DELETE':
        r = client.delete(path)
    ok = r.status_code == expected
    icon = "PASS" if ok else "FAIL"
    if ok:
        passed += 1
    else:
        failed += 1
    print(f"  [{icon}] {method} {path} -> {r.status_code} (expected {expected}) {label}")
    return r

print("=== Frontend Pages ===")
test('GET', '/', expected=200, label="index")
test('GET', '/register.html', expected=200, label="register")
test('GET', '/dashboard.html', expected=200, label="dashboard")
test('GET', '/predictor.html', expected=200, label="predictor")
test('GET', '/shipments.html', expected=200, label="shipments")

print("\n=== Aliases ===")
test('GET', '/register', expected=200)
test('GET', '/login', expected=200)
test('GET', '/dashboard', expected=200)
test('GET', '/predictor', expected=200)

print("\n=== Health ===")
test('GET', '/health', expected=200)

print("\n=== Register ===")
r = test('POST', '/register', json={"username": "e2e_user", "password": "Pass1234!"}, expected=201)
data = r.get_json()
print(f"       id={data.get('id')}, username={data.get('username')}")

# Duplicate register
test('POST', '/register', json={"username": "e2e_user", "password": "Pass1234!"}, expected=409, label="(duplicate)")

print("\n=== Login ===")
test('POST', '/login', json={"username": "e2e_user", "password": "Pass1234!"}, expected=200)
test('GET', '/profile', expected=200, label="(authenticated)")
test('POST', '/logout', expected=200)
test('GET', '/profile', expected=401, label="(logged out)")

# Login with dispatcher
r = test('POST', '/login', json={"username": "dispatcher", "password": "RouteSense2026!"}, expected=200, label="(dispatcher)")
print(f"       {r.get_json().get('message')}")

print("\n=== Shipments ===")
test('GET', '/shipments', expected=200, label="(list)")
test('GET', '/shipments/SHP-1001', expected=200, label="(get)")
test('GET', '/shipments/NONEXISTENT', expected=404, label="(not found)")

print("\n=== ML Prediction ===")
r = test('POST', '/predict', json={
    "distance": 1200, "weather": "Storm", "route_risk": "Severe",
    "delivery_status": "Delayed", "delay_days": 5
}, expected=200)
d = r.get_json()
if d:
    print(f"       Risk: {d.get('risk_level')}, Confidence: {d.get('confidence_score')}")

# Cleanup test user
conn = get_db_connection()
cur = conn.cursor()
cur.execute("DELETE FROM users WHERE username = %s", ('e2e_user',))
cur.close()
conn.close()

print(f"\n{'='*40}")
print(f"Results: {passed} passed, {failed} failed")
print("PASS" if failed == 0 else "FAIL")

