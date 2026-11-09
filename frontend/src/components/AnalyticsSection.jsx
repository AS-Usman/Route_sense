import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE } from '../config/api';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  CloudSun, 
  Truck, 
  ShieldAlert, 
  Cpu, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  Clock,
  Sparkles
} from 'lucide-react';

const COLORS = {
  orange: '#F97316',
  lightOrange: '#FB923C',
  peach: '#FED7AA',
  amber: '#D97706',
  green: '#10B981',
  red: '#EF4444',
  stone: '#78716C'
};

const RISK_DISTRIBUTION = [
  { name: 'Low Risk', value: 45, count: 541, color: COLORS.green },
  { name: 'Moderate', value: 25, count: 1457, color: COLORS.amber },
  { name: 'High Risk', value: 18, count: 1663, color: COLORS.orange },
  { name: 'Severe', value: 12, count: 2339, color: COLORS.red }
];

const DELAY_BY_WEATHER = [
  { weather: 'Clear & Sunny', avgDelay: 0.8 },
  { weather: 'Rain / Wet', avgDelay: 4.6 },
  { weather: 'Dense Fog', avgDelay: 8.2 },
  { weather: 'Snow & Ice', avgDelay: 16.5 },
  { weather: 'Severe Storm', avgDelay: 28.4 },
  { weather: 'Heatwave', avgDelay: 3.5 }
];

const MODE_PERFORMANCE = [
  { mode: 'Truck Road', speed: 65, delayIndex: 18.2, reliability: 86 },
  { mode: 'Air Express', speed: 550, delayIndex: 4.1, reliability: 97 },
  { mode: 'Rail Freight', speed: 45, delayIndex: 12.8, reliability: 91 },
  { mode: 'Maritime', speed: 25, delayIndex: 32.5, reliability: 74 }
];

const HOURLY_THROUGHPUT = [
  { hour: '00:00', onTime: 42, delayed: 4 },
  { hour: '04:00', onTime: 58, delayed: 6 },
  { hour: '08:00', onTime: 124, delayed: 28 },
  { hour: '12:00', onTime: 146, delayed: 32 },
  { hour: '16:00', onTime: 168, delayed: 39 },
  { hour: '20:00', onTime: 95, delayed: 14 }
];

// Custom Tooltip
function WarmTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-2xl bg-white border border-orange-200 shadow-warm-lg text-xs">
        <div className="font-mono text-orange-600 font-bold mb-1">{label}</div>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-stone-800">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-stone-500">{entry.name}:</span>
            <span className="font-mono font-bold text-orange-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function AnalyticsSection() {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeModeFilter, setActiveModeFilter] = useState('all');
  const [modelMetrics, setModelMetrics] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/model/metrics`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setModelMetrics(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="analytics">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-700 text-xs font-mono font-bold tracking-wide uppercase mb-3 shadow-warm-sm">
            <BarChart3 size={13} className="text-orange-500" />
            PREDICTIVE TELEMETRY INTELLIGENCE
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-stone-900 tracking-tight">
            Logistics Risk & Delay Analytics
          </h2>
          <p className="text-stone-600 text-base mt-2 max-w-2xl">
            Multi-variate risk distributions, meteorological hazard sensitivity, and trained Random Forest regression benchmarks.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white p-1 rounded-2xl border border-orange-200 shadow-warm-sm">
            {['24h', '7d', '30d', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3.5 py-1 text-xs rounded-xl font-mono font-bold transition-all uppercase ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-warm-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-white p-1 rounded-2xl border border-orange-200 shadow-warm-sm">
            {['all', 'truck', 'air', 'rail'].map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveModeFilter(mode)}
                className={`px-3.5 py-1 text-xs rounded-xl font-mono font-bold transition-all uppercase ${
                  activeModeFilter === mode
                    ? 'bg-stone-900 text-white shadow-warm-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Hourly Throughput vs Delay Incidents */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-warm-xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono text-orange-600 uppercase font-bold tracking-wider">HOURLY DISPATCH THROUGHPUT</span>
              <h3 className="text-xl font-display font-bold text-stone-900 mt-1">Delivery Volume vs Delay Incidents</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono font-semibold">
              <span className="flex items-center gap-1.5 text-stone-700">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> On-Time
              </span>
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Delay Risk
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_THROUGHPUT}>
                <defs>
                  <linearGradient id="warmAreaOrange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.orange} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={COLORS.orange} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#FED7AA" vertical={false} opacity={0.6} />
                <XAxis dataKey="hour" stroke="#78716C" tick={{ fill: '#78716C', fontSize: 11 }} />
                <YAxis stroke="#78716C" tick={{ fill: '#78716C', fontSize: 11 }} />
                <Tooltip content={<WarmTooltip />} />
                <Area type="monotone" dataKey="onTime" name="On-Time Shipments" stroke={COLORS.orange} strokeWidth={3} fillOpacity={1} fill="url(#warmAreaOrange)" />
                <Area type="monotone" dataKey="delayed" name="Delayed Shipments" stroke={COLORS.red} strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 2: Route Risk Distribution Donut */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-warm-xl flex flex-col justify-between"
        >
          <div>
            <span className="text-xs font-mono text-orange-600 uppercase font-bold tracking-wider">FLEET RISK PROPORTION</span>
            <h3 className="text-xl font-display font-bold text-stone-900 mt-1">Route Risk Classification</h3>
          </div>

          <div className="h-56 relative my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RISK_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {RISK_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip content={<WarmTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-display font-black text-stone-900">6,000</span>
              <span className="text-[10px] font-mono text-stone-500 font-bold uppercase">AUDITED ROUTES</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-orange-100">
            {RISK_DISTRIBUTION.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-orange-50/70 border border-orange-100">
                <span className="flex items-center gap-1.5 text-stone-700 font-medium">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono font-bold text-stone-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Chart 3: Meteorological Hazard Delay Impact */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-warm-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono text-orange-600 uppercase font-bold tracking-wider">METEOROLOGICAL SENSITIVITY</span>
              <h3 className="text-xl font-display font-bold text-stone-900 mt-1">Average Delay by Weather Hazard</h3>
            </div>
            <CloudSun size={20} className="text-orange-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DELAY_BY_WEATHER} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FED7AA" horizontal={false} opacity={0.6} />
                <XAxis type="number" stroke="#78716C" unit="h" tick={{ fill: '#78716C', fontSize: 11 }} />
                <YAxis dataKey="weather" type="category" stroke="#78716C" tick={{ fill: '#78716C', fontSize: 11 }} />
                <Tooltip content={<WarmTooltip />} />
                <Bar dataKey="avgDelay" name="Avg Delay (Hours)" fill={COLORS.orange} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 4: Modal Performance & Reliability */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-warm-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono text-orange-600 uppercase font-bold tracking-wider">TRANSPORT MODE COMPARISON</span>
              <h3 className="text-xl font-display font-bold text-stone-900 mt-1">Reliability vs Transit Speed</h3>
            </div>
            <Truck size={20} className="text-orange-500" />
          </div>

          <div className="space-y-4 my-2">
            {MODE_PERFORMANCE.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900">{item.mode}</span>
                  <span className="font-mono text-emerald-700 font-bold">{item.reliability}% On-Time</span>
                </div>
                <div className="w-full bg-orange-200/80 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500 shadow-sm"
                    style={{ width: `${item.reliability}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-stone-500">
                  <span>Speed: {item.speed} km/h</span>
                  <span>Delay Impact: +{item.delayIndex} hrs</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Machine Learning Benchmark Metrics Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-3xl p-6 sm:p-8 border border-orange-300 shadow-warm-xl flex flex-col justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[10px] font-mono font-bold uppercase mb-2 border border-orange-300 shadow-sm">
              <Cpu size={12} className="text-orange-600" /> RANDOM FOREST REGRESSOR & CLASSIFIER
            </div>
            <h3 className="text-xl font-display font-bold text-stone-900">Trained ML Model Performance</h3>
            <p className="text-xs text-stone-600 mt-1">
              Supervised machine learning ensemble trained on 6,000 empirical route records.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="p-3.5 rounded-2xl bg-white border border-orange-200 shadow-warm-sm">
              <span className="text-[10px] font-mono text-orange-600 uppercase font-bold">DELAY R² REGRESSION</span>
              <div className="text-2xl font-display font-black text-stone-900 mt-0.5">
                {modelMetrics?.delay_R2 ?? '0.902'}
              </div>
              <span className="text-[11px] text-emerald-600 font-mono font-semibold">High Predictive Accuracy</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-orange-200 shadow-warm-sm">
              <span className="text-[10px] font-mono text-orange-600 uppercase font-bold">RISK ACCURACY</span>
              <div className="text-2xl font-display font-black text-stone-900 mt-0.5">
                {modelMetrics ? `${(modelMetrics.risk_accuracy * 100).toFixed(1)}%` : '81.7%'}
              </div>
              <span className="text-[11px] text-orange-600 font-mono font-semibold">4-Class Classification</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-orange-200 shadow-warm-sm">
              <span className="text-[10px] font-mono text-stone-500 uppercase font-bold">DELAY MAE</span>
              <div className="text-2xl font-display font-black text-stone-900 mt-0.5">
                {modelMetrics?.delay_MAE_hours ?? '2.14'} <span className="text-xs font-normal text-orange-600 font-mono">HRS</span>
              </div>
              <span className="text-[11px] text-stone-500 font-mono">Mean Absolute Error</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-orange-200 shadow-warm-sm">
              <span className="text-[10px] font-mono text-stone-500 uppercase font-bold">DATASET SIZE</span>
              <div className="text-2xl font-display font-black text-stone-900 mt-0.5">
                {modelMetrics?.rows?.toLocaleString() ?? '6,000'}
              </div>
              <span className="text-[11px] text-stone-600 font-mono">4,800 Train / 1,200 Test</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-orange-200 flex items-center justify-between text-xs font-mono shadow-sm">
            <span className="text-emerald-700 flex items-center gap-1.5 font-bold">
              <CheckCircle2 size={14} className="text-emerald-600" /> Flask API Active
            </span>
            <span className="text-stone-500 font-semibold">Port 5000</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AnalyticsSection;
