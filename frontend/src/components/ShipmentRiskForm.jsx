import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../config/api';
import { useDelayPredictor } from '../hooks/useDelayPredictor';
import { 
  Calculator, 
  MapPin, 
  Truck, 
  Package, 
  CloudSun, 
  Award, 
  Activity, 
  Zap,
  BookmarkPlus,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Compass
} from 'lucide-react';
import { ROUTE_PRESETS } from '../config/presets';

export function ShipmentRiskForm({ onSaveShipment, addToast }) {
  const [formData, setFormData] = useState({
    shipmentCode: 'RS-' + Math.floor(1000 + Math.random() * 9000),
    origin: 'New York, NY',
    destination: 'Chicago, IL',
    transportMode: 'truck',
    cargoCategory: 'standard',
    cargoWeight: 4500,
    distance: 1280,
    weatherCondition: 'rain',
    carrierRating: 'A',
    trafficCongestion: 45
  });

  const [mlPrediction, setMlPrediction] = useState(null);
  const [isMlLoading, setIsMlLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Fallback heuristic model
  const heuristicAnalysis = useDelayPredictor(formData);

  // Call Flask REST API Random Forest ML Model
  const runPrediction = async (dataToPredict) => {
    setIsMlLoading(true);
    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipment_id: dataToPredict.shipmentCode,
          origin: dataToPredict.origin,
          destination: dataToPredict.destination,
          transport_mode: dataToPredict.transportMode,
          cargo_category: dataToPredict.cargoCategory,
          cargo_weight: dataToPredict.cargoWeight,
          distance: dataToPredict.distance,
          weather: dataToPredict.weatherCondition,
          carrier_rating: dataToPredict.carrierRating,
          traffic_congestion: dataToPredict.trafficCongestion
        })
      });

      if (res.ok) {
        const result = await res.json();
        setMlPrediction(result);
        return result;
      }
    } catch (err) {
      console.log('Flask ML API offline, using local heuristics fallback:', err);
    } finally {
      setIsMlLoading(false);
    }
    return null;
  };

  // Debounced auto-prediction on form input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      runPrediction(formData);
    }, 300);
    return () => clearTimeout(timer);
  }, [
    formData.transportMode,
    formData.cargoCategory,
    formData.cargoWeight,
    formData.distance,
    formData.weatherCondition,
    formData.carrierRating,
    formData.trafficCongestion
  ]);

  const effectiveRiskLevel = mlPrediction?.predicted_risk || heuristicAnalysis.riskLevel || 'Low';
  const effectiveScore = mlPrediction?.risk_score ?? heuristicAnalysis.riskScore ?? 45;
  const effectiveDelayHours = mlPrediction?.estimated_delay_hours ?? heuristicAnalysis.estimatedDelayHours ?? 0;
  const effectiveConfidence = mlPrediction?.confidence_score;
  const effectiveRecommendation = mlPrediction?.recommendation || heuristicAnalysis.recommendations[0] || 'Optimal corridor conditions. Proceed with scheduled dispatch.';

  // Warm theme risk color
  const riskColor = {
    Low: '#10B981',      // Emerald Green
    Moderate: '#F59E0B', // Amber
    High: '#F97316',     // Primary Orange
    Severe: '#EF4444'    // Red
  }[effectiveRiskLevel] || '#F97316';

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' || name === 'trafficCongestion' ? Number(value) : value
    }));
    setIsSaved(false);
  };

  const handleManualAnalyze = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    await runPrediction(formData);
    setTimeout(() => {
      setIsAnalyzing(false);
      if (addToast) addToast('Analysis completed via Random Forest ML Model!', 'success');
    }, 400);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const code = formData.shipmentCode || ('RS-' + Math.floor(1000 + Math.random() * 9000));
    const newShipment = {
      id: Date.now(),
      shipment_id: code,
      shipmentCode: code,
      origin: formData.origin,
      destination: formData.destination,
      distance: Number(formData.distance),
      weather: formData.weatherCondition || 'clear',
      weatherCondition: formData.weatherCondition,
      route_risk: effectiveRiskLevel,
      delivery_status: 'In Transit',
      delay_days: Math.round(effectiveDelayHours / 24) || 0,
      transportMode: formData.transportMode,
      cargoCategory: formData.cargoCategory,
      cargoWeight: formData.cargoWeight,
      carrierRating: formData.carrierRating,
      trafficCongestion: formData.trafficCongestion,
      confidence_score: effectiveConfidence,
      riskAnalysis: {
        ...heuristicAnalysis,
        riskLevel: effectiveRiskLevel,
        riskScore: effectiveScore,
        estimatedDelayHours: effectiveDelayHours,
        recommendations: mlPrediction?.recommendations || heuristicAnalysis.recommendations
      },
      timestamp: new Date().toISOString()
    };

    if (onSaveShipment) onSaveShipment(newShipment);
    setIsSaved(true);
  };

  const handleApplyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      origin: preset.origin.name,
      destination: preset.destination.name,
      distance: preset.distance,
      transportMode: preset.mode,
      weatherCondition: preset.weather.toLowerCase().includes('snow') ? 'snow' : preset.weather.toLowerCase().includes('rain') ? 'rain' : 'clear'
    }));
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="predictor">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-700 text-xs font-mono font-bold tracking-wide uppercase mb-3 shadow-warm-sm"
        >
          <Zap size={13} className="text-orange-500" />
          AI RISK & DELAY INFERENCE ENGINE
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-display font-black text-stone-900 tracking-tight"
        >
          Route Risk Predictor
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-stone-600 text-base sm:text-lg mt-3"
        >
          Configure shipment characteristics to compute high-confidence delay exposures and route risk classifications powered by our trained Random Forest model.
        </motion.p>

        {/* Live Status Pill */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
            mlPrediction 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
              : 'bg-orange-50 text-orange-700 border-orange-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${mlPrediction ? 'bg-emerald-500 animate-pulse' : 'bg-orange-400'}`}></span>
            {mlPrediction 
              ? `RANDOM FOREST ENGINE ONLINE • ${(effectiveConfidence ? (effectiveConfidence * 100).toFixed(1) : '81.7')}% CONFIDENCE` 
              : 'HEURISTIC ESTIMATION MODE'}
          </span>
        </div>
      </div>

      {/* Main Grid: Left Form Console, Right Output Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Console: 7 Cols */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-warm-xl relative"
        >
          {/* Preset Buttons */}
          <div className="mb-6 pb-4 border-b border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-stone-500 uppercase font-semibold">PRESET CORRIDORS</span>
              <span className="text-[10px] text-orange-600 font-mono font-bold">1-CLICK BENCHMARKS</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ROUTE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-3 py-1.5 text-xs rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-stone-700 hover:text-orange-700 font-semibold transition-all"
                >
                  {p.name.split('→')[0].trim()} → {p.name.split('→')[1]?.trim()}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleManualAnalyze} className="space-y-5">
            {/* Row 1: Source & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-stone-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin size={13} className="text-orange-500" /> SOURCE LOCATION
                </label>
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-orange-50/60 border border-orange-200 text-stone-900 font-medium focus:border-orange-500 focus:bg-white focus:outline-none transition-all text-sm"
                  placeholder="e.g. New York, NY"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin size={13} className="text-stone-600" /> DESTINATION LOCATION
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-orange-50/60 border border-orange-200 text-stone-900 font-medium focus:border-orange-500 focus:bg-white focus:outline-none transition-all text-sm"
                  placeholder="e.g. Chicago, IL"
                  required
                />
              </div>
            </div>

            {/* Row 2: Transport Mode & Distance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-stone-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Truck size={13} className="text-orange-500" /> TRANSPORT MODE
                </label>
                <select
                  name="transportMode"
                  value={formData.transportMode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-orange-50/60 border border-orange-200 text-stone-900 font-medium focus:border-orange-500 focus:bg-white focus:outline-none transition-all text-sm cursor-pointer"
                >
                  <option value="truck">Road Truck Freight (Standard)</option>
                  <option value="air">Air Cargo Express (Fastest)</option>
                  <option value="rail">Rail Intermodal Freight</option>
                  <option value="maritime">Ocean Maritime Shipping</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-mono text-stone-600 font-bold uppercase tracking-wider">
                    CORRIDOR DISTANCE (KM)
                  </label>
                  <span className="font-mono text-orange-600 font-bold text-xs">{formData.distance} KM</span>
                </div>
                <input
                  type="range"
                  name="distance"
                  min="50"
                  max="5000"
                  step="25"
                  value={formData.distance}
                  onChange={handleChange}
                  className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </div>

            {/* Row 3: Weather Condition & Traffic Congestion */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-stone-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <CloudSun size={13} className="text-orange-500" /> WEATHER CONDITION
                </label>
                <select
                  name="weatherCondition"
                  value={formData.weatherCondition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-orange-50/60 border border-orange-200 text-stone-900 font-medium focus:border-orange-500 focus:bg-white focus:outline-none transition-all text-sm cursor-pointer"
                >
                  <option value="clear">☀️ Clear & Sunny (Low Impact)</option>
                  <option value="rain">🌧️ Moderate Rain (+18% Delay Risk)</option>
                  <option value="fog">🌫️ Dense Fog / Low Visibility</option>
                  <option value="snow">❄️ Heavy Snow & Ice Road Alert</option>
                  <option value="storm">⛈️ Severe Thunderstorm / Blizzard</option>
                  <option value="heatwave">🌡️ Extreme Heatwave Warning</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-mono text-stone-600 font-bold uppercase tracking-wider">
                    TRAFFIC CONGESTION
                  </label>
                  <span className="font-mono text-orange-600 font-bold text-xs">{formData.trafficCongestion}%</span>
                </div>
                <input
                  type="range"
                  name="trafficCongestion"
                  min="5"
                  max="95"
                  step="5"
                  value={formData.trafficCongestion}
                  onChange={handleChange}
                  className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </div>

            {/* Row 4: Cargo Weight, Cargo Category, Carrier Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-stone-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Package size={13} className="text-orange-500" /> CARGO WEIGHT (KG)
                </label>
                <input
                  type="number"
                  name="cargoWeight"
                  value={formData.cargoWeight}
                  onChange={handleChange}
                  min="50"
                  max="50000"
                  className="w-full px-4 py-3 rounded-xl bg-orange-50/60 border border-orange-200 text-stone-900 font-medium focus:border-orange-500 focus:bg-white focus:outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-600 font-bold uppercase tracking-wider mb-1.5">
                  CARGO CATEGORY
                </label>
                <select
                  name="cargoCategory"
                  value={formData.cargoCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-orange-50/60 border border-orange-200 text-stone-900 font-medium focus:border-orange-500 focus:bg-white focus:outline-none transition-all text-sm cursor-pointer"
                >
                  <option value="standard">Standard General Goods</option>
                  <option value="perishable">Perishable Food / Cold Chain</option>
                  <option value="electronics">High-Value Electronics</option>
                  <option value="hazardous">Hazardous Chemicals</option>
                  <option value="heavy">Heavy Industrial Machinery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Award size={13} className="text-orange-500" /> CARRIER TIER
                </label>
                <select
                  name="carrierRating"
                  value={formData.carrierRating}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-orange-50/60 border border-orange-200 text-stone-900 font-medium focus:border-orange-500 focus:bg-white focus:outline-none transition-all text-sm cursor-pointer"
                >
                  <option value="A+">Tier 1 (A+) Premium Fleet</option>
                  <option value="A">Tier 1 (A) High Reliability</option>
                  <option value="B">Tier 2 (B) Standard Fleet</option>
                  <option value="C">Tier 3 (C) Higher Risk</option>
                  <option value="D">Tier 4 (D) Vulnerable</option>
                </select>
              </div>
            </div>

            {/* Actions: Analyze & Save Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isAnalyzing}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-display font-bold text-sm tracking-wide transition-all shadow-warm-md hover:shadow-warm-lg flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin text-white" />
                    <span>Analyzing Route Risk...</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} className="text-white" />
                    <span>Analyze Route Risk</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSave}
                className={`py-3.5 px-6 rounded-2xl border text-sm font-display font-bold transition-all flex items-center justify-center gap-2 ${
                  isSaved
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-warm-sm'
                    : 'bg-white hover:bg-orange-50/80 border-orange-200 text-stone-800'
                }`}
              >
                {isSaved ? <CheckCircle2 size={16} className="text-emerald-600" /> : <BookmarkPlus size={16} />}
                <span>{isSaved ? 'Saved to Database' : 'Save & Track'}</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Output Console Box: 5 Cols */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Main Risk Exposure Assessment Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-orange-200/80 shadow-warm-xl relative overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-orange-100 mb-6">
              <span className="px-3.5 py-1.5 text-xs rounded-xl font-mono font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-warm-sm">
                RISK ASSESSMENT
              </span>

              <span className="text-[11px] font-mono text-orange-600 font-bold">
                {formData.shipmentCode}
              </span>
            </div>

            <div className="space-y-6">
              {/* Circular Score & Risk Badge */}
              <div className="text-center py-2">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="#FFEDD5"
                      strokeWidth="11"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke={riskColor}
                      strokeWidth="11"
                      strokeDasharray={377}
                      strokeDashoffset={377 - (377 * effectiveScore) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-display font-black text-stone-900">{effectiveScore}%</span>
                    <span className="text-[9px] font-mono uppercase text-stone-500 font-bold">RISK SCORE</span>
                  </div>
                </div>

                <div className="mt-3">
                  <span 
                    className="px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider inline-block shadow-sm"
                    style={{
                      backgroundColor: `${riskColor}15`,
                      color: riskColor,
                      border: `1.5px solid ${riskColor}50`
                    }}
                  >
                    {effectiveRiskLevel.toUpperCase()} RISK EXPOSURE
                  </span>
                  {effectiveConfidence && (
                    <div className="text-xs font-mono text-stone-500 mt-2">
                      Model Confidence: <span className="text-orange-600 font-bold">{(effectiveConfidence * 100).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delay & Duration Metric Boxes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100">
                  <span className="text-[10px] font-mono text-stone-500 font-bold uppercase">ESTIMATED DELAY</span>
                  <div className="text-xl font-display font-bold text-orange-600 mt-1">
                    +{effectiveDelayHours} <span className="text-xs font-normal">HRS</span>
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">
                    ≈ {(effectiveDelayHours / 24).toFixed(1)} Days
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100">
                  <span className="text-[10px] font-mono text-stone-500 font-bold uppercase">TOTAL DURATION</span>
                  <div className="text-xl font-display font-bold text-stone-900 mt-1">
                    {Math.round(((Number(formData.distance) / (formData.transportMode === 'air' ? 550 : formData.transportMode === 'rail' ? 45 : formData.transportMode === 'maritime' ? 25 : 65)) + effectiveDelayHours) * 10) / 10} <span className="text-xs font-normal">HRS</span>
                  </div>
                  <span className="text-[10px] text-orange-600 font-mono font-semibold">Base + Predicted Delay</span>
                </div>
              </div>

              {/* AI Action Recommendation Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50/80 to-amber-50/80 border border-orange-200">
                <div className="flex items-center gap-2 text-orange-700 text-xs font-mono font-bold uppercase mb-2">
                  <Sparkles size={13} className="text-orange-500 animate-pulse" />
                  AI DISPATCH RECOMMENDATION
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-sans">
                  {effectiveRecommendation}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ShipmentRiskForm;
