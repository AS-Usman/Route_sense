// Preset Major Global Logistics Corridors
export const ROUTE_PRESETS = [
  {
    id: 'nyc-chi',
    name: 'New York, NY → Chicago, IL',
    origin: { name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
    destination: { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
    waypoints: [
      [40.7128, -74.0060],
      [40.8518, -77.8596],
      [41.2565, -81.2829],
      [41.5055, -84.0531],
      [41.8781, -87.6298]
    ],
    distance: 1280,
    risk: 'Low',
    weather: 'Clear',
    mode: 'truck'
  },
  {
    id: 'la-dal',
    name: 'Los Angeles, CA → Dallas, TX',
    origin: { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
    destination: { name: 'Dallas, TX', lat: 32.7767, lng: -96.7970 },
    waypoints: [
      [34.0522, -118.2437],
      [33.4484, -112.0740],
      [32.2226, -110.9747],
      [31.7619, -106.4850],
      [32.7767, -96.7970]
    ],
    distance: 2300,
    risk: 'Moderate',
    weather: 'Heatwave',
    mode: 'air'
  },
  {
    id: 'sea-den',
    name: 'Seattle, WA → Denver, CO',
    origin: { name: 'Seattle, WA', lat: 47.6062, lng: -122.3321 },
    destination: { name: 'Denver, CO', lat: 39.7392, lng: -104.9903 },
    waypoints: [
      [47.6062, -122.3321],
      [46.8523, -118.5283],
      [45.7833, -111.0333],
      [42.8666, -106.3131],
      [39.7392, -104.9903]
    ],
    distance: 2100,
    risk: 'Severe',
    weather: 'Snow Storm',
    mode: 'truck'
  },
  {
    id: 'chn-blr',
    name: 'Chennai → Bangalore (NH 48)',
    origin: { name: 'Chennai, TN', lat: 13.0827, lng: 80.2707 },
    destination: { name: 'Bangalore, KA', lat: 12.9716, lng: 77.5946 },
    waypoints: [
      [13.0827, 80.2707],
      [12.9249, 79.1352],
      [12.8342, 78.5085],
      [12.8703, 77.8340],
      [12.9716, 77.5946]
    ],
    distance: 350,
    risk: 'High',
    weather: 'Heavy Rain',
    mode: 'truck'
  },
  {
    id: 'mum-del',
    name: 'Mumbai → New Delhi (Freight Corridor)',
    origin: { name: 'Mumbai, MH', lat: 19.0760, lng: 72.8777 },
    destination: { name: 'New Delhi, DL', lat: 28.6139, lng: 77.2090 },
    waypoints: [
      [19.0760, 72.8777],
      [22.3072, 73.1812],
      [24.5854, 73.7125],
      [26.9124, 75.7873],
      [28.6139, 77.2090]
    ],
    distance: 1420,
    risk: 'Moderate',
    weather: 'Fog',
    mode: 'rail'
  }
];

