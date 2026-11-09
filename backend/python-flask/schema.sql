-- ===================================================
-- SupplyIQ — Delivery Delay & Route Risk Predictor
-- Schema Definition (Day 36, Day 37 & Day 39)
-- ===================================================

CREATE DATABASE IF NOT EXISTS supplyiq;
USE supplyiq;

-- Day 36: Shipments Table
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

-- Day 37: Users Table (Authentication Basics)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Day 39: Predictions Table (ML Risk Prediction Persistence)
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shipment_id INT NOT NULL,
    predicted_risk VARCHAR(50) NOT NULL,
    prediction_confidence FLOAT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);
