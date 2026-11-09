import { useMemo } from 'react';

const MODE_FACTORS = {
  truck: { speed: 65, vulnerability: 1.25, baseRisk: 15, label: 'Road Truck Freight' },
  air: { speed: 550, vulnerability: 0.85, baseRisk: 8, label: 'Air Cargo Express' },
  rail: { speed: 45, vulnerability: 0.95, baseRisk: 12, label: 'Rail Freight' },
  maritime: { speed: 25, vulnerability: 1.4, baseRisk: 22, label: 'Ocean Maritime Shipping' }
};

const WEATHER_WEIGHTS = {
  clear: { weight: 2, label: 'Clear & Sunny', icon: '☀️' },
  rain: { weight: 18, label: 'Moderate Rain', icon: '🌧️' },
  fog: { weight: 28, label: 'Dense Fog / Low Visibility', icon: '🌫️' },
  snow: { weight: 42, label: 'Heavy Snow / Ice', icon: '❄️' },
  storm: { weight: 58, label: 'Severe Thunderstorm / Hurricane', icon: '⛈️' },
  heatwave: { weight: 20, label: 'Extreme Heatwave', icon: '🌡️' }
};

const CARRIER_RATINGS = {
  'A+': { modifier: -18, label: 'Tier 1 A+ (Premium Fleet & Drivers)' },
  'A': { modifier: -8, label: 'Tier 1 A (Standard Reliability)' },
  'B': { modifier: 5, label: 'Tier 2 B (Average Reliability)' },
  'C': { modifier: 22, label: 'Tier 3 C (Higher Disruption Rate)' },
  'D': { modifier: 40, label: 'Tier 4 D (High Maintenance Risk)' }
};

const CARGO_SENSITIVITY = {
  perishable: { multiplier: 1.45, label: 'Perishable Food / Cold Chain' },
  hazardous: { multiplier: 1.35, label: 'Hazardous Chemicals / Materials' },
  electronics: { multiplier: 1.15, label: 'High-Value Electronics' },
  heavy: { multiplier: 1.2, label: 'Heavy Industrial Machinery' },
  standard: { multiplier: 1.0, label: 'Standard General Goods' }
};

export function calculateShipmentRisk(shipment = {}) {
  const distance = Number(shipment.distance) || 450;
  const transportMode = shipment.transportMode || shipment.transport_mode || 'truck';
  const cargoCategory = shipment.cargoCategory || shipment.cargo_category || 'standard';
  const weatherCondition = shipment.weatherCondition || shipment.weather || 'clear';
  const carrierRating = shipment.carrierRating || shipment.carrier_rating || 'A';
  const trafficCongestion = Number(shipment.trafficCongestion || shipment.traffic_congestion || 35);
  const cargoWeight = Number(shipment.cargoWeight || shipment.cargo_weight || 2500);

  const mode = MODE_FACTORS[transportMode] || MODE_FACTORS.truck;
  const weather = WEATHER_WEIGHTS[weatherCondition] || WEATHER_WEIGHTS.clear;
  const carrier = CARRIER_RATINGS[carrierRating] || CARRIER_RATINGS.A;
  const cargo = CARGO_SENSITIVITY[cargoCategory] || CARGO_SENSITIVITY.standard;

  // Base Risk from parameters
  let weatherFactor = weather.weight * mode.vulnerability;
  let trafficFactor = (trafficCongestion / 100) * 45;
  let carrierFactor = carrier.modifier;
  let distanceFactor = Math.min(30, (distance / 1200) * 20);
  let weightFactor = Math.min(15, (cargoWeight / 20000) * 10);

  // Total raw risk score
  let rawScore = (mode.baseRisk + weatherFactor + trafficFactor + carrierFactor + distanceFactor + weightFactor) * cargo.multiplier;
  
  // Clamped between 6% and 97%
  const riskScore = Math.min(97, Math.max(6, Math.round(rawScore)));

  // Estimated Delay Calculation
  const baseTravelHours = distance / mode.speed;
  const delayMultiplier = (riskScore / 100) * (weather.weight > 30 ? 1.8 : 1.2);
  const estimatedDelayHours = Math.round((baseTravelHours * delayMultiplier + (trafficCongestion > 60 ? 2.5 : 0.5)) * 10) / 10;

  // Categorize Risk Level
  let riskLevel = 'Low';
  let badgeColor = 'success';
  if (riskScore >= 75) {
    riskLevel = 'Severe';
    badgeColor = 'danger';
  } else if (riskScore >= 52) {
    riskLevel = 'High';
    badgeColor = 'warning';
  } else if (riskScore >= 30) {
    riskLevel = 'Moderate';
    badgeColor = 'info';
  }

  // Factor breakdown for visuals
  const totalFactorSum = Math.max(1, weatherFactor + trafficFactor + Math.max(0, carrierFactor) + distanceFactor);
  const breakdown = {
    weather: Math.round((weatherFactor / totalFactorSum) * 100),
    traffic: Math.round((trafficFactor / totalFactorSum) * 100),
    carrier: Math.round((Math.max(0, carrierFactor) / totalFactorSum) * 100),
    routeComplexity: Math.round((distanceFactor / totalFactorSum) * 100)
  };

  // Generate actionable AI recommendations
  const recommendations = [];
  if (weatherCondition === 'storm' || weatherCondition === 'snow') {
    recommendations.push(`Reroute shipment via southern bypass to avoid ${weather.label.toLowerCase()} hazards.`);
  }
  if (cargoCategory === 'perishable' && riskScore > 40 && transportMode === 'truck') {
    recommendations.push('High perishable risk: Consider upgrading to Air Cargo Express to preserve shelf-life.');
  }
  if (carrierRating === 'C' || carrierRating === 'D') {
    recommendations.push(`Upgrading carrier rating from ${carrierRating} to Tier 1 A+ will reduce delay risk by up to 35%.`);
  }
  if (trafficCongestion > 60) {
    recommendations.push('Heavy traffic congestion predicted: Shift departure time window by -3 hours to off-peak.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Route parameters optimal. Maintain scheduled departure and standard monitoring.');
  }

  return {
    riskScore,
    riskLevel,
    badgeColor,
    estimatedDelayHours,
    baseTravelHours: Math.round(baseTravelHours * 10) / 10,
    totalEstimatedHours: Math.round((baseTravelHours + estimatedDelayHours) * 10) / 10,
    breakdown,
    recommendations,
    modeInfo: mode,
    weatherInfo: weather,
    carrierInfo: carrier,
    cargoInfo: cargo
  };
}

export function useDelayPredictor(shipmentParams) {
  return useMemo(() => {
    return calculateShipmentRisk(shipmentParams);
  }, [
    shipmentParams.distance,
    shipmentParams.transportMode,
    shipmentParams.cargoCategory,
    shipmentParams.weatherCondition,
    shipmentParams.carrierRating,
    shipmentParams.trafficCongestion,
    shipmentParams.cargoWeight
  ]);
}
