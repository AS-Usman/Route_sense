import { 
  MODE_FACTORS, 
  WEATHER_WEIGHTS, 
  CARRIER_RATINGS, 
  CARGO_SENSITIVITY 
} from '../config/constants.js';

export function calculateBackendRisk(shipment) {
  const {
    distance = 450,
    transportMode = 'truck',
    cargoCategory = 'standard',
    weatherCondition = 'clear',
    carrierRating = 'A',
    trafficCongestion = 35,
    cargoWeight = 2500
  } = shipment;

  const mode = MODE_FACTORS[transportMode] || MODE_FACTORS.truck;
  const weather = WEATHER_WEIGHTS[weatherCondition] || WEATHER_WEIGHTS.clear;
  const carrier = CARRIER_RATINGS[carrierRating] || CARRIER_RATINGS.A;
  const cargo = CARGO_SENSITIVITY[cargoCategory] || CARGO_SENSITIVITY.standard;

  let weatherFactor = weather.weight * mode.vulnerability;
  let trafficFactor = (trafficCongestion / 100) * 45;
  let carrierFactor = carrier.modifier;
  let distanceFactor = Math.min(30, (distance / 1200) * 20);
  let weightFactor = Math.min(15, (cargoWeight / 20000) * 10);

  let rawScore = (mode.baseRisk + weatherFactor + trafficFactor + carrierFactor + distanceFactor + weightFactor) * cargo.multiplier;
  const riskScore = Math.min(97, Math.max(6, Math.round(rawScore)));

  const baseTravelHours = distance / mode.speed;
  const delayMultiplier = (riskScore / 100) * (weather.weight > 30 ? 1.8 : 1.2);
  const estimatedDelayHours = Math.round((baseTravelHours * delayMultiplier + (trafficCongestion > 60 ? 2.5 : 0.5)) * 10) / 10;

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

  const totalFactorSum = Math.max(1, weatherFactor + trafficFactor + Math.max(0, carrierFactor) + distanceFactor);
  const breakdown = {
    weather: Math.round((weatherFactor / totalFactorSum) * 100),
    traffic: Math.round((trafficFactor / totalFactorSum) * 100),
    carrier: Math.round((Math.max(0, carrierFactor) / totalFactorSum) * 100),
    routeComplexity: Math.round((distanceFactor / totalFactorSum) * 100)
  };

  const recommendations = [];
  if (weatherCondition === 'storm' || weatherCondition === 'snow') {
    recommendations.push(`Reroute shipment via southern corridor to avoid ${weather.label.toLowerCase()} hazards.`);
  }
  if (cargoCategory === 'perishable' && riskScore > 40 && transportMode === 'truck') {
    recommendations.push('High cold-chain risk: Upgrade to Air Cargo Express to prevent spoilage.');
  }
  if (carrierRating === 'C' || carrierRating === 'D') {
    recommendations.push(`Upgrade carrier rating from ${carrierRating} to Tier 1 A+ to reduce delay risk by up to 35%.`);
  }
  if (trafficCongestion > 60) {
    recommendations.push('High road congestion predicted: Shift departure window by -3 hours to off-peak.');
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

export const predictRisk = async (req, res) => {
  let mlPrediction = null;
  try {
    const flaskRes = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    if (flaskRes.ok) {
      mlPrediction = await flaskRes.json();
    }
  } catch (err) {
    // Flask ML service offline, fallback to heuristic
  }

  const analysis = calculateBackendRisk(req.body);
  if (mlPrediction) {
    analysis.mlModel = {
      active: true,
      predictedRisk: mlPrediction.predicted_risk,
      riskConfidence: mlPrediction.confidence_score,
      estimatedDelayHours: mlPrediction.estimated_delay_hours,
      modelInfo: mlPrediction.model_info,
      recommendation: mlPrediction.recommendation
    };
  }

  res.json({
    success: true,
    source: mlPrediction ? 'ml_random_forest' : 'heuristic_rule_engine',
    data: {
      inputs: req.body,
      riskAnalysis: analysis,
      mlPrediction
    }
  });
};
