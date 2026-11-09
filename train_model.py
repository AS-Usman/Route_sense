"""
Train RouteSense ML models from routesense_shipments_dataset.csv.
Run: pip install -r requirements.txt
     python train_model.py
"""
from pathlib import Path
import json
import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, accuracy_score, classification_report

BASE = Path(__file__).resolve().parent
DATA_PATH = BASE / "routesense_shipments_dataset.csv"
MODEL_PATH = BASE / "routesense_model.joblib"

FEATURES = [
    "transport_mode", "cargo_category", "weather_condition", "carrier_rating",
    "distance_km", "cargo_weight_kg", "traffic_congestion_pct"
]
CATEGORICAL = FEATURES[:4]
NUMERIC = FEATURES[4:]

def main():
    data = pd.read_csv(DATA_PATH)
    X = data[FEATURES]
    X_train, X_test, y_delay_train, y_delay_test = train_test_split(
        X, data["estimated_delay_hours"], test_size=0.20, random_state=42
    )
    y_risk_train = data.loc[X_train.index, "risk_level"]
    y_risk_test = data.loc[X_test.index, "risk_level"]

    def make_preprocessor():
        return ColumnTransformer([
            ("categorical", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
            ("numeric", "passthrough", NUMERIC)
        ])

    delay_model = Pipeline([
        ("prep", make_preprocessor()),
        ("model", RandomForestRegressor(
            n_estimators=300, min_samples_leaf=2, max_features=0.9,
            n_jobs=-1, random_state=42
        ))
    ])
    risk_model = Pipeline([
        ("prep", make_preprocessor()),
        ("model", RandomForestClassifier(
            n_estimators=300, min_samples_leaf=2, class_weight="balanced",
            n_jobs=-1, random_state=42
        ))
    ])

    delay_model.fit(X_train, y_delay_train)
    risk_model.fit(X_train, y_risk_train)

    delay_predictions = delay_model.predict(X_test)
    risk_predictions = risk_model.predict(X_test)
    metrics = {
        "rows": int(len(data)),
        "train_rows": int(len(X_train)),
        "test_rows": int(len(X_test)),
        "delay_MAE_hours": round(float(mean_absolute_error(y_delay_test, delay_predictions)), 3),
        "delay_RMSE_hours": round(float(mean_squared_error(y_delay_test, delay_predictions) ** 0.5), 3),
        "delay_R2": round(float(r2_score(y_delay_test, delay_predictions)), 4),
        "risk_accuracy": round(float(accuracy_score(y_risk_test, risk_predictions)), 4),
        "risk_classification_report": classification_report(
            y_risk_test, risk_predictions, output_dict=True, zero_division=0
        )
    }

    joblib.dump({
        "delay_model": delay_model,
        "risk_model": risk_model,
        "features": FEATURES
    }, MODEL_PATH)

    (BASE / "evaluation_metrics.json").write_text(json.dumps(metrics, indent=2))
    print(json.dumps(metrics, indent=2))
    print(f"\nSaved trained model to: {MODEL_PATH}")

if __name__ == "__main__":
    main()
