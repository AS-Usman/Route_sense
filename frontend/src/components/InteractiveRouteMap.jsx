import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Navigation, 
  MapPin, 
  Truck, 
  Plane, 
  Ship, 
  Train, 
  ShieldAlert, 
  Zap, 
  Layers, 
  Compass, 
  Play, 
  Pause, 
  RotateCcw 
} from 'lucide-react';

// Preset Major Global Logistics Corridors with real coordinates
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

// Helper to interpolate position along polyline points
function interpolatePath(points, progress) {
  if (!points || points.length === 0) return [0, 0];
  if (points.length === 1 || progress <= 0) return points[0];
  if (progress >= 1) return points[points.length - 1];

  const totalSegments = points.length - 1;
  const rawIdx = progress * totalSegments;
  const segIdx = Math.min(Math.floor(rawIdx), totalSegments - 1);
  const segProgress = rawIdx - segIdx;

  const p1 = points[segIdx];
  const p2 = points[segIdx + 1];

  const lat = p1[0] + (p2[0] - p1[0]) * segProgress;
  const lng = p1[1] + (p2[1] - p1[1]) * segProgress;
  return [lat, lng];
}

// Calculate bearing/angle for heading rotation
function calculateBearing(p1, p2) {
  if (!p1 || !p2) return 0;
  const dLng = (p2[1] - p1[1]) * (Math.PI / 180);
  const lat1 = p1[0] * (Math.PI / 180);
  const lat2 = p2[0] * (Math.PI / 180);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

// Map pan controller when route changes
function MapViewUpdater({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8, animate: true });
    }
  }, [bounds, map]);
  return null;
}

export function InteractiveRouteMap({ 
  currentShipment, 
  activeRisk = 'High',
  onSelectPreset 
}) {
  const [selectedRoute, setSelectedRoute] = useState(ROUTE_PRESETS[0]);
  const [isSimulating, setIsSimulating] = useState(true);
  const [progress, setProgress] = useState(0.25);
  const [simSpeed, setSimSpeed] = useState(1);

  // If a custom shipment origin/destination is provided from outside, override
  useEffect(() => {
    if (currentShipment && currentShipment.origin && currentShipment.destination) {
      const match = ROUTE_PRESETS.find(
        (r) =>
          r.origin.name.toLowerCase().includes(currentShipment.origin.toLowerCase()) ||
          r.destination.name.toLowerCase().includes(currentShipment.destination.toLowerCase())
      );
      if (match) setSelectedRoute(match);
    }
  }, [currentShipment]);

  // Vehicle animation loop along route
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.004 * simSpeed;
        return next >= 1 ? 0 : next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [isSimulating, simSpeed]);

  const currentCoords = interpolatePath(selectedRoute.waypoints, progress);
  const nextTargetCoords = interpolatePath(selectedRoute.waypoints, Math.min(1, progress + 0.05));
  const heading = calculateBearing(currentCoords, nextTargetCoords);

  // Risk Color Mapping in warm theme
  const riskColor = {
    Low: '#10B981',      // Emerald Green
    Moderate: '#F59E0B', // Amber
    High: '#F97316',     // Primary Orange
    Severe: '#EF4444'    // Red
  }[selectedRoute.risk || activeRisk] || '#F97316';

  // Custom Warm HTML DivIcons
  const originIcon = L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: rgba(249, 115, 22, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 16px; height: 16px; border-radius: 50%; background: #F97316; border: 2px solid #FFFFFF; box-shadow: 0 2px 8px rgba(249, 115, 22, 0.5);"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  const destIcon = L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: rgba(41, 37, 36, 0.2); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 16px; height: 16px; border-radius: 50%; background: #292524; border: 2px solid #FFFFFF; box-shadow: 0 2px 8px rgba(41, 37, 36, 0.4);"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  const vehicleIcon = L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div style="transform: rotate(${heading}deg); transition: transform 0.2s ease; position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(249, 115, 22, 0.2); filter: blur(4px);"></div>
        <div style="background: #FFFFFF; border: 2.5px solid ${riskColor}; border-radius: 10px; padding: 6px; box-shadow: 0 4px 12px rgba(194, 65, 12, 0.25); display: flex; align-items: center; justify-content: center;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${riskColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });

  const bounds = selectedRoute.waypoints;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-orange-200/80 bg-white shadow-warm-xl">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-orange-200/80 shadow-warm-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-200 flex items-center justify-center text-orange-600">
            <Compass size={18} className="animate-spin-slow" />
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-widest text-orange-600 font-bold uppercase">
              INTERACTIVE CORRIDOR RADAR
            </div>
            <div className="text-sm font-display font-bold text-stone-900 flex items-center gap-2">
              {selectedRoute.name}
              <span 
                className="text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold"
                style={{ 
                  backgroundColor: `${riskColor}15`,
                  color: riskColor,
                  border: `1px solid ${riskColor}50`
                }}
              >
                {selectedRoute.risk.toUpperCase()} RISK
              </span>
            </div>
          </div>
        </div>

        {/* Corridor Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          {ROUTE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedRoute(preset);
                setProgress(0.1);
                if (onSelectPreset) onSelectPreset(preset);
              }}
              className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                selectedRoute.id === preset.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-warm-sm'
                  : 'bg-orange-50 text-stone-700 border border-orange-200/70 hover:bg-orange-100 hover:text-orange-700'
              }`}
            >
              {preset.id.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Telemetry Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-mono font-bold text-stone-700 transition-colors"
          >
            {isSimulating ? <Pause size={12} className="text-amber-600" /> : <Play size={12} className="text-emerald-600" />}
            {isSimulating ? 'PAUSE' : 'PLAY'}
          </button>
          <button
            onClick={() => setProgress(0)}
            className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-stone-700 transition-colors"
            title="Reset to Origin"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Map Canvas with CartoDB Voyager Warm Tiles */}
      <div className="h-[480px] sm:h-[550px] w-full">
        <MapContainer
          center={selectedRoute.waypoints[0]}
          zoom={5}
          scrollWheelZoom={false}
          className="h-full w-full"
          zoomControl={false}
        >
          {/* CartoDB Voyager Crisp Clean Basemap */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <MapViewUpdater bounds={bounds} />

          {/* Route Polyline - Glow Base */}
          <Polyline
            positions={selectedRoute.waypoints}
            pathOptions={{
              color: riskColor,
              weight: 8,
              opacity: 0.25,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />

          {/* Active Route Polyline */}
          <Polyline
            positions={selectedRoute.waypoints}
            pathOptions={{
              color: riskColor,
              weight: 3.5,
              opacity: 0.95,
              dashArray: '8, 8',
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />

          {/* Origin Marker */}
          <Marker position={[selectedRoute.origin.lat, selectedRoute.origin.lng]} icon={originIcon}>
            <Popup>
              <div className="p-1">
                <div className="text-[10px] font-mono text-orange-600 font-bold uppercase">ORIGIN DISPATCH HUB</div>
                <div className="text-sm font-bold text-stone-900 mt-0.5">{selectedRoute.origin.name}</div>
                <div className="text-xs text-stone-600 mt-1">Weather: {selectedRoute.weather}</div>
              </div>
            </Popup>
          </Marker>

          {/* Destination Marker */}
          <Marker position={[selectedRoute.destination.lat, selectedRoute.destination.lng]} icon={destIcon}>
            <Popup>
              <div className="p-1">
                <div className="text-[10px] font-mono text-stone-700 font-bold uppercase">DESTINATION TERMINAL</div>
                <div className="text-sm font-bold text-stone-900 mt-0.5">{selectedRoute.destination.name}</div>
                <div className="text-xs text-stone-600 mt-1">Corridor Distance: {selectedRoute.distance} km</div>
              </div>
            </Popup>
          </Marker>

          {/* Moving Active Vehicle Marker */}
          <Marker position={currentCoords} icon={vehicleIcon}>
            <Popup>
              <div className="p-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-mono font-bold text-stone-900">CARRIER IN-TRANSIT</span>
                </div>
                <div className="text-xs text-stone-600">
                  Progress: <span className="font-mono text-orange-600 font-bold">{(progress * 100).toFixed(0)}%</span>
                </div>
                <div className="text-xs text-stone-600">
                  Current Speed: <span className="font-mono text-stone-900 font-bold">{selectedRoute.mode === 'air' ? '540 km/h' : '68 km/h'}</span>
                </div>
                <div className="text-[11px] font-mono text-amber-700 mt-1">
                  Risk Status: {selectedRoute.risk} • ETA Synchronized
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Bottom Floating Telemetry Overlay Card */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000] grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-orange-200/80 shadow-warm-md">
        <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-100">
          <div className="text-[10px] font-mono text-stone-500 uppercase font-bold">CORRIDOR DISTANCE</div>
          <div className="text-base font-display font-bold text-stone-900 mt-0.5">
            {selectedRoute.distance.toLocaleString()} <span className="text-xs text-orange-600 font-semibold">KM</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-100">
          <div className="text-[10px] font-mono text-stone-500 uppercase font-bold">TRANSIT MODE</div>
          <div className="text-base font-display font-bold text-stone-900 mt-0.5 flex items-center gap-1.5 capitalize">
            {selectedRoute.mode === 'air' ? <Plane size={14} className="text-orange-500" /> : <Truck size={14} className="text-orange-500" />}
            {selectedRoute.mode} Express
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-100">
          <div className="text-[10px] font-mono text-stone-500 uppercase font-bold">WEATHER RADAR</div>
          <div className="text-base font-display font-bold text-stone-900 mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            {selectedRoute.weather}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-100">
          <div className="text-[10px] font-mono text-stone-500 uppercase font-bold">FLEET PROGRESS</div>
          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="w-full bg-orange-200 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-orange-400 to-amber-500 shadow-sm"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-orange-600">{(progress * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InteractiveRouteMap;
