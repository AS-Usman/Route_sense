"""
Load the saved RouteSense models and predict a shipment.
Run: python predict.py
"""
import os
from pathlib import Path
import joblib
import pandas as pd

# Locate model file across possible locations
POSSIBLE_PATHS = [
    Path(__file__).resolve().parent / "routesense_model.joblib",
    Path(__file__).resolve().parent.parent / "routesense_model.joblib",
    Path(__file__).resolve().parent.parent.parent / "routesense_model.joblib",
    Path("routesense_model.joblib"),
    Path("backend/python-flask/routesense_model.joblib")
]

bundle = None
for path in POSSIBLE_PATHS:
    if path.exists():
        try:
            bundle = joblib.load(path)
            break
        except Exception:
            pass

def normalize_transport_mode(val):
    v = str(val or "truck").strip().lower()
    if any(k in v for k in ["air", "plane", "flight"]):
        return "air"
    if any(k in v for k in ["rail", "train"]):
        return "rail"
    if any(k in v for k in ["sea", "ocean", "maritime", "ship", "boat"]):
        return "maritime"
    return "truck"

def normalize_cargo_category(val):
    v = str(val or "standard").strip().lower()
    if any(k in v for k in ["perish", "food", "cold", "frozen"]):
        return "perishable"
    if any(k in v for k in ["hazard", "chem", "toxic", "explos"]):
        return "hazardous"
    if any(k in v for k in ["elect", "tech", "chip", "comput"]):
        return "electronics"
    if any(k in v for k in ["heavy", "machin", "indust"]):
        return "heavy"
    return "standard"

def normalize_weather(val):
    v = str(val or "clear").strip().lower()
    if "storm" in v or "thunder" in v or "hurricane" in v:
        return "storm"
    if "snow" in v or "ice" in v or "blizzard" in v:
        return "snow"
    if "rain" in v or "drizzle" in v:
        return "rain"
    if "fog" in v or "mist" in v or "smog" in v:
        return "fog"
    if "heat" in v or "hot" in v:
        return "heatwave"
    return "clear"

def normalize_carrier_rating(val):
    v = str(val or "A").strip().upper()
    if v in ["A+", "A", "B", "C", "D"]:
        return v
    if "A+" in v:
        return "A+"
    if "A" in v:
        return "A"
    if "B" in v:
        return "B"
    if "C" in v:
        return "C"
    if "D" in v:
        return "D"
    return "A"

def generate_recommendations(risk, delay_hours, mode, weather, carrier, cargo, traffic):
    recs = []
    if weather in ["storm", "snow"]:
        recs.append(f"Severe {weather} conditions detected. Reroute via safer corridors or hold departure until advisory lifts.")
    if traffic > 60:
        recs.append(f"High traffic congestion ({traffic}%). Shift dispatch window by 2-3 hours to off-peak periods.")
    if carrier in ["C", "D"]:
        recs.append(f"Carrier reliability rating is {carrier}. Upgrading to Tier 1 (A/A+) carrier reduces transit disruption risk significantly.")
    if cargo == "perishable" and (risk in ["High", "Severe"] or delay_hours > 12):
        recs.append("Perishable cargo at risk of spoilage due to delay. Consider expedited reefer transport or modal shift to Air Cargo.")
    if risk == "Low" and not recs:
        recs.append("Optimal transit conditions. Proceed with standard scheduled dispatch.")
    elif not recs:
        recs.append("Monitor telematics along primary transit corridor for unexpected bottlenecks.")
    return recs

def predict_shipment(shipment: dict) -> dict:
    """shipment keys match the RouteSense form/backend field names."""
    global bundle
    if bundle is None:
        for path in POSSIBLE_PATHS:
            if path.exists():
                try:
                    bundle = joblib.load(path)
                    break
                except Exception:
                    pass

    if bundle is None:
        raise RuntimeError("RouteSense ML model bundle not found or could not be loaded.")

    mode = normalize_transport_mode(shipment.get("transport_mode") or shipment.get("transportMode"))
    cargo = normalize_cargo_category(shipment.get("cargo_category") or shipment.get("cargoCategory"))
    weather = normalize_weather(shipment.get("weather_condition") or shipment.get("weatherCondition") or shipment.get("weather"))
    carrier = normalize_carrier_rating(shipment.get("carrier_rating") or shipment.get("carrierRating"))

    try:
        distance = float(shipment.get("distance_km") or shipment.get("distance") or 450)
    except (ValueError, TypeError):
        distance = 450.0

    try:
        weight = float(shipment.get("cargo_weight_kg") or shipment.get("cargoWeight") or 2500)
    except (ValueError, TypeError):
        weight = 2500.0

    try:
        traffic = float(shipment.get("traffic_congestion_pct") or shipment.get("trafficCongestion") or 35)
    except (ValueError, TypeError):
        traffic = 35.0

    row = {
        "transport_mode": mode,
        "cargo_category": cargo,
        "weather_condition": weather,
        "carrier_rating": carrier,
        "distance_km": distance,
        "cargo_weight_kg": weight,
        "traffic_congestion_pct": traffic,
    }
    X = pd.DataFrame([row])
    delay = max(0.0, float(bundle["delay_model"].predict(X)[0]))
    risk_model = bundle["risk_model"]
    risk = str(risk_model.predict(X)[0])
    probabilities = risk_model.predict_proba(X)[0]
    confidence = float(max(probabilities))

    # Calculate risk score 0-100 for gauge visualization
    score_mapping = {"Low": 20, "Moderate": 45, "High": 72, "Severe": 90}
    base_score = score_mapping.get(risk, 50)
    risk_score = min(98, max(5, int(base_score + (confidence - 0.5) * 20)))

    recs = generate_recommendations(risk, delay, mode, weather, carrier, cargo, traffic)

    return {
        "shipment_id": shipment.get("shipment_id") or shipment.get("shipmentCode"),
        "predicted_risk": risk,
        "risk_level": risk,
        "risk_score": risk_score,
        "risk_confidence": round(confidence, 4),
        "confidence_score": round(confidence, 4),
        "estimated_delay_hours": round(delay, 2),
        "estimated_delay_days": round(delay / 24, 2),
        "recommendation": recs[0] if recs else "Proceed with standard scheduled dispatch.",
        "recommendations": recs,
        "model_info": "RandomForest Multi-Model (Trained on 6,000 shipments, R²=0.902, Acc=81.7%)",
        "inputs_normalized": row
    }

if __name__ == "__main__":
    sample = {
        "transportMode": "truck",
        "cargoCategory": "standard",
        "weatherCondition": "rain",
        "carrierRating": "A",
        "distance": 1280,
        "cargoWeight": 4500,
        "trafficCongestion": 45
    }
    print(predict_shipment(sample))
