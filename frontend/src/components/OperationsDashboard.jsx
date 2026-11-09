import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE } from '../config/api';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid 
} from 'recharts';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  Activity, 
  Cpu, 
  Search, 
  Trash2, 
  Sparkles,
  Database,
  BarChart3
} from 'lucide-react';

const COLORS = {
  orange: '#F97316',
  lightOrange: '#FB923C',
  peach: '#FED7AA',
  amber: '#D97706',
  green: '#10B981',
  red: '#EF4444',
  stone: '#78716C',
  border: '#FED7AA'
};

const PERFORMANCE_TREND = [
  { day: 'Mon', throughput: 164, onTime: 154, delayed: 10 },
  { day: 'Tue', throughput: 182, onTime: 172, delayed: 10 },
  { day: 'Wed', throughput: 215, onTime: 201, delayed: 14 },
  { day: 'Thu', throughput: 198, onTime: 186, delayed: 12 },
  { day: 'Fri', throughput: 245, onTime: 231, delayed: 14 },
  { day: 'Sat', throughput: 142, onTime: 135, delayed: 7 },
  { day: 'Sun', throughput: 110, onTime: 106, delayed: 4 }
];

const RISK_DONUT = [
  { name: 'Low Risk', value: 58, color: COLORS.green },
  { name: 'Moderate Risk', value: 24, color: COLORS.amber },
  { name: 'High Risk', value: 12, color: COLORS.orange },
  { name: 'Severe Risk', value: 6, color: COLORS.red }
];

const MODAL_STATUS_BAR = [
  { mode: 'Truck', active: 340, delayed: 28 },
  { mode: 'Air', active: 140, delayed: 4 },
  { mode: 'Rail', active: 95, delayed: 9 },
  { mode: 'Maritime', active: 45, delayed: 12 }
];

// Custom Warm Tooltip
function WarmDashboardTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl bg-white border border-orange-200 shadow-warm-lg text-xs">
        <div className="font-mono text-orange-600 font-bold mb-1">{label}</div>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2 text-stone-800">
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

export function OperationsDashboard({ shipments = [], onDeleteShipment }) {
  const [dbShipments, setDbShipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch actual saved shipments from MySQL backend
  useEffect(() => {
    fetch(`${API_BASE}/shipments`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDbShipments(data);
        }
      })
      .catch((err) => console.log('Using local shipments state:', err));
  }, []);

  const effectiveShipments = dbShipments.length > 0 ? dbShipments : shipments;

  // KPI Calculations
  const totalCount = effectiveShipments.length > 0 ? effectiveShipments.length : 1280;
  const highRiskCount = effectiveShipments.filter(
    (s) => (s.route_risk || '').toLowerCase() === 'high' || (s.route_risk || '').toLowerCase() === 'severe'
  ).length;
  const delayedCount = effectiveShipments.filter((s) => Number(s.delay_days) > 0).length;
  const onTimeCount = totalCount - delayedCount;
  const onTimeRate = ((onTimeCount / totalCount) * 100).toFixed(1);

  const kpiCards = [
    {
      title: 'TOTAL SHIPMENTS',
      value: totalCount.toLocaleString(),
      change: '+8.4%',
      sub: 'Active Corridors',
      icon: Truck,
      bgIcon: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'ON-TIME DELIVERIES',
      value: `${onTimeRate}%`,
      change: '+4.2%',
      sub: `${onTimeCount.toLocaleString()} On-Schedule`,
      icon: CheckCircle2,
      bgIcon: 'bg-emerald-100 text-emerald-600'
    },
    {
      title: 'DELAYED SHIPMENTS',
      value: delayedCount.toLocaleString(),
      change: '-12.0%',
      sub: 'Weather & Congestion',
      icon: Clock,
      bgIcon: 'bg-amber-100 text-amber-600'
    },
    {
      title: 'HIGH-RISK ROUTES',
      value: highRiskCount > 0 ? highRiskCount.toString() : '3',
      change: '-5 Alerts',
      sub: 'Active Reroute Alerts',
      icon: AlertTriangle,
      bgIcon: 'bg-rose-100 text-rose-600'
    }
  ];

  const filteredShipments = effectiveShipments.filter((s) => {
    const code = s.shipment_id || s.shipmentCode || '';
    const origin = s.origin || '';
    const dest = s.destination || '';
    return (
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="dashboard">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-700 text-xs font-mono font-bold tracking-wide uppercase mb-3 shadow-warm-sm">
            <Activity size={13} />
            LOGISTICS OPERATIONS MONITOR
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-stone-900 tracking-tight">
            Fleet Operations Dashboard
          </h2>
          <p className="text-stone-600 text-base mt-2 max-w-2xl">
            Real-time throughput metrics, route risk distributions, and empirical delivery telemetry.
          </p>
        </div>
      </div>

      {/* 4 Animated KPI Cards (Section 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-6 border border-orange-200/80 shadow-warm-md hover:shadow-warm-xl hover:border-orange-400 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-stone-500 uppercase font-bold tracking-wider">{kpi.title}</span>
                <div className={`p-2.5 rounded-2xl ${kpi.bgIcon} group-hover:scale-105 transition-transform shadow-sm`}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="text-3xl sm:text-4xl font-display font-black text-stone-900 tracking-tight">
                {kpi.value}
              </div>

              <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-orange-100">
                <span className="text-stone-500 font-medium">{kpi.sub}</span>
                <span className="font-mono text-emerald-600 font-bold flex items-center gap-0.5">
                  <ArrowUpRight size={13} /> {kpi.change}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Delivery Performance Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-orange-200/80 shadow-warm-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono text-orange-600 uppercase font-bold tracking-wider">7-DAY THROUGHPUT TREND</span>
              <h3 className="text-xl font-display font-bold text-stone-900 mt-1">Delivery Performance vs Delays</h3>
            </div>
            <div className="text-xs font-mono text-stone-500 font-semibold">Volume Scale: 0-300</div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERFORMANCE_TREND}>
                <defs>
                  <linearGradient id="warmOrangeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.orange} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={COLORS.orange} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#FED7AA" vertical={false} opacity={0.6} />
                <XAxis dataKey="day" stroke="#78716C" tick={{ fill: '#78716C', fontSize: 11 }} />
                <YAxis stroke="#78716C" tick={{ fill: '#78716C', fontSize: 11 }} />
                <Tooltip content={<WarmDashboardTooltip />} />
                <Area type="monotone" dataKey="throughput" name="Total Dispatches" stroke={COLORS.orange} strokeWidth={3} fill="url(#warmOrangeGradient)" />
                <Area type="monotone" dataKey="onTime" name="On-Time Delivery" stroke={COLORS.green} strokeWidth={2.5} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Route Risk Distribution Donut */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 sm:p-7 border border-orange-200/80 shadow-warm-xl flex flex-col justify-between"
        >
          <div>
            <span className="text-xs font-mono text-orange-600 uppercase font-bold tracking-wider">CORRIDOR RISK SPLIT</span>
            <h3 className="text-xl font-display font-bold text-stone-900 mt-1">Risk Exposure Ratio</h3>
          </div>

          <div className="h-48 relative my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RISK_DONUT}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {RISK_DONUT.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip content={<WarmDashboardTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-display font-black text-stone-900">{onTimeRate}%</span>
              <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase">ON-TIME SAFETY</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-orange-100 text-xs">
            {RISK_DONUT.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-orange-50/70 border border-orange-100">
                <span className="flex items-center gap-1.5 text-stone-700 font-medium">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name.split(' ')[0]}
                </span>
                <span className="font-mono font-bold text-stone-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Shipment Activity Table (Section 5) */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-warm-xl"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-orange-600 uppercase font-bold tracking-wider">LIVE TELEMETRY LOG</span>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-mono font-bold border border-orange-200">
                LIVE SYNCHRONIZED
              </span>
            </div>
            <h3 className="text-xl font-display font-bold text-stone-900 mt-1">Recent Shipment Activity</h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shipment, corridor..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-orange-50/60 border border-orange-200 text-xs text-stone-900 font-medium focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-orange-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-orange-50/80 text-stone-600 uppercase font-mono text-[10px] font-bold border-b border-orange-100">
              <tr>
                <th className="py-3.5 px-4">SHIPMENT CODE</th>
                <th className="py-3.5 px-4">CORRIDOR</th>
                <th className="py-3.5 px-4">DISTANCE</th>
                <th className="py-3.5 px-4">WEATHER</th>
                <th className="py-3.5 px-4">RISK LEVEL</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4">DELAY</th>
                <th className="py-3.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {filteredShipments.slice(0, 8).map((s, idx) => {
                const code = s.shipment_id || s.shipmentCode || `RS-${1000 + idx}`;
                const risk = s.route_risk || (s.riskAnalysis && s.riskAnalysis.riskLevel) || 'Low';
                const delay = s.delay_days || 0;

                const riskBadge = {
                  Low: 'bg-emerald-50 text-emerald-700 border-emerald-300',
                  Moderate: 'bg-amber-50 text-amber-700 border-amber-300',
                  High: 'bg-orange-50 text-orange-700 border-orange-300',
                  Severe: 'bg-rose-50 text-rose-700 border-rose-300'
                }[risk] || 'bg-orange-50 text-orange-700 border-orange-300';

                return (
                  <tr key={idx} className="hover:bg-orange-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      {code}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-800">
                      {s.origin} → {s.destination}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-600">
                      {s.distance} km
                    </td>
                    <td className="py-3.5 px-4 capitalize text-stone-700">
                      {s.weather || 'Clear'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${riskBadge}`}>
                        {risk.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1.5 text-stone-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {s.delivery_status || 'In Transit'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-orange-600 font-bold">
                      +{delay}d
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {onDeleteShipment && (
                        <button
                          onClick={() => onDeleteShipment(s.id || code)}
                          className="p-1.5 rounded-xl bg-orange-50 hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors border border-orange-100"
                          title="Delete Shipment"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}

export default OperationsDashboard;
