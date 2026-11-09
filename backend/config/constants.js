export const PORT = process.env.NODE_PORT || 5001;

export const MODE_FACTORS = {
  truck: { speed: 65, vulnerability: 1.25, baseRisk: 15, label: 'Road Truck Freight' },
  air: { speed: 550, vulnerability: 0.85, baseRisk: 8, label: 'Air Cargo Express' },
  rail: { speed: 45, vulnerability: 0.95, baseRisk: 12, label: 'Rail Freight' },
  maritime: { speed: 25, vulnerability: 1.4, baseRisk: 22, label: 'Ocean Maritime Shipping' }
};

export const WEATHER_WEIGHTS = {
  clear: { weight: 2, label: 'Clear & Sunny', icon: '☀️' },
  rain: { weight: 18, label: 'Moderate Rain', icon: '🌧️' },
  fog: { weight: 28, label: 'Dense Fog / Low Visibility', icon: '🌫️' },
  snow: { weight: 42, label: 'Heavy Snow / Ice', icon: '❄️' },
  storm: { weight: 58, label: 'Severe Thunderstorm / Hurricane', icon: '⛈️' },
  heatwave: { weight: 20, label: 'Extreme Heatwave', icon: '🌡️' }
};

export const CARRIER_RATINGS = {
  'A+': { modifier: -18, label: 'Tier 1 A+ (Premium Fleet)' },
  'A': { modifier: -8, label: 'Tier 1 A (Standard Reliability)' },
  'B': { modifier: 5, label: 'Tier 2 B (Average Reliability)' },
  'C': { modifier: 22, label: 'Tier 3 C (Higher Disruption)' },
  'D': { modifier: 40, label: 'Tier 4 D (High Maintenance Risk)' }
};

export const CARGO_SENSITIVITY = {
  perishable: { multiplier: 1.45, label: 'Perishable Food / Cold Chain' },
  hazardous: { multiplier: 1.35, label: 'Hazardous Materials' },
  electronics: { multiplier: 1.15, label: 'High-Value Electronics' },
  heavy: { multiplier: 1.2, label: 'Heavy Industrial Machinery' },
  standard: { multiplier: 1.0, label: 'Standard General Goods' }
};
