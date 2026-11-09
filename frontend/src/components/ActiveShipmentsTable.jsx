import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Eye, X, Zap, Package, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { ShipmentDeck } from './ShipmentDeck';

const riskBadge = (risk = 'low') => {
  const r = risk.toLowerCase();
  if (r === 'high' || r === 'severe') return 'bg-red-100 text-red-700 border-red-200';
  if (r === 'moderate' || r === 'medium') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-green-100 text-green-700 border-green-200';
};

const FilterBtn = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
      active
        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
        : 'bg-white text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-600'
    }`}
  >
    {children}
  </button>
);

export function ActiveShipmentsTable({ shipments = [], onDeleteShipment, addToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [selectedShipment, setSelectedShipment] = useState(null);

  const filteredShipments = shipments.filter((s) => {
    const code = s.shipment_id || s.shipmentCode || '';
    const origin = s.origin || '';
    const destination = s.destination || '';
    const matchesSearch =
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.toLowerCase().includes(searchTerm.toLowerCase());

    const risk = (s.route_risk || s.riskAnalysis?.riskLevel || 'low').toLowerCase();
    if (filterLevel === 'all') return matchesSearch;
    if (filterLevel === 'high') return matchesSearch && (risk === 'high' || risk === 'severe');
    return matchesSearch && risk === filterLevel;
  });

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="shipments">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold uppercase tracking-widest mb-3">
          <Package size={12} />
          Live Operations Deck
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 tracking-tight">
          Active Tracked Shipments
        </h2>
        <p className="text-stone-500 mt-2 max-w-xl mx-auto text-sm">
          Drag the cards below or use the table to manage and monitor all shipments in real time.
        </p>
      </motion.div>

      {/* Card Deck */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-16"
      >
        <ShipmentDeck shipments={shipments} />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="relative min-w-[260px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
              placeholder="Search code, origin, destination…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <FilterBtn active={filterLevel === 'all'} onClick={() => setFilterLevel('all')}>All ({shipments.length})</FilterBtn>
            <FilterBtn active={filterLevel === 'low'} onClick={() => setFilterLevel('low')}>Low Risk</FilterBtn>
            <FilterBtn active={filterLevel === 'moderate'} onClick={() => setFilterLevel('moderate')}>Moderate</FilterBtn>
            <FilterBtn active={filterLevel === 'high'} onClick={() => setFilterLevel('high')}>High / Severe</FilterBtn>
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto rounded-2xl border border-orange-100 shadow-sm bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-orange-50 text-stone-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-5 py-3.5 text-left rounded-tl-2xl">Shipment</th>
                <th className="px-5 py-3.5 text-left">Route Corridor</th>
                <th className="px-5 py-3.5 text-left">Distance</th>
                <th className="px-5 py-3.5 text-left">Weather</th>
                <th className="px-5 py-3.5 text-left">Risk Level</th>
                <th className="px-5 py-3.5 text-left">Status</th>
                <th className="px-5 py-3.5 text-left">Delay</th>
                <th className="px-5 py-3.5 text-right rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-stone-400">
                      <Package size={36} className="text-orange-200" />
                      <span className="text-sm font-medium">No shipments match your criteria</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredShipments.map((s) => {
                  const code = s.shipment_id || s.shipmentCode || `#${s.id}`;
                  const risk = s.route_risk || s.riskAnalysis?.riskLevel || 'Low';
                  const weather = s.weather || s.weatherCondition || 'clear';
                  const delayDisplay =
                    s.delay_days !== undefined && s.delay_days !== null
                      ? `+${s.delay_days} days`
                      : `+${s.riskAnalysis?.estimatedDelayHours || 0} hrs`;

                  return (
                    <motion.tr
                      key={s.id || code}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-orange-50/60 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-orange-500">{code}</td>
                      <td className="px-5 py-4 font-medium text-stone-700">
                        {s.origin} <span className="text-orange-400 mx-1">→</span> {s.destination}
                      </td>
                      <td className="px-5 py-4 text-stone-500">{s.distance} km</td>
                      <td className="px-5 py-4 capitalize text-stone-600">{weather}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${riskBadge(risk)}`}>
                          {risk}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold capitalize ${
                          s.delivery_status?.toLowerCase().includes('delay') ? 'text-red-500'
                          : s.delivery_status?.toLowerCase().includes('deliver') ? 'text-green-600'
                          : 'text-orange-500'
                        }`}>
                          {s.delivery_status || 'In Transit'}
                        </span>
                      </td>
                      <td className={`px-5 py-4 font-bold text-sm ${
                        parseInt(s.delay_days) > 0 ? 'text-red-500' : 'text-green-600'
                      }`}>
                        {delayDisplay}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all"
                            onClick={() => setSelectedShipment(s)}
                            title="View details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:border-red-300 hover:bg-red-50 transition-all"
                            onClick={() => {
                              if (onDeleteShipment) onDeleteShipment(s.id || s.shipment_id);
                              if (addToast) addToast(`Shipment ${code} removed`, 'info');
                            }}
                            title="Remove shipment"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedShipment && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setSelectedShipment(null)} />
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl border border-orange-100 max-w-md w-full p-6 z-10"
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Modal header */}
              <div className="flex items-start justify-between mb-5 pb-4 border-b border-orange-100">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-orange-500">Case File Detail</span>
                  <h3 className="text-lg font-bold text-stone-800 mt-0.5">
                    {selectedShipment.shipmentCode || selectedShipment.shipment_id}
                  </h3>
                </div>
                <button
                  className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors"
                  onClick={() => setSelectedShipment(null)}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-orange-50 rounded-xl p-3">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Route</span>
                  <p className="text-sm font-semibold text-stone-700 mt-0.5">
                    {selectedShipment.origin} → {selectedShipment.destination}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Risk Score</span>
                  <p className="text-lg font-bold text-orange-600 mt-0.5">
                    {selectedShipment.riskAnalysis?.riskScore || 45}%
                  </p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Distance</span>
                  <p className="text-sm font-semibold text-stone-700 mt-0.5">{selectedShipment.distance} km</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Weather</span>
                  <p className="text-sm font-semibold text-stone-700 mt-0.5 capitalize">{selectedShipment.weather || 'Clear'}</p>
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2 text-orange-600">
                  <Zap size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">Action Mitigation</span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {selectedShipment.riskAnalysis?.recommendations?.[0] ||
                    'Maintain scheduled corridor speed and standard monitoring alerts.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
