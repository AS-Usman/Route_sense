import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Cpu, Shield, BarChart2, Wifi } from 'lucide-react';

const TIMELINE_EVENTS = [
  { date: 'AUG 15', event: 'Risk Analysis Module', status: 'Available', type: 'Core Engine', Icon: Cpu, color: 'text-orange-600', bg: 'bg-orange-100' },
  { date: 'AUG 15', event: 'Shipment Monitor & Flask Sync', status: 'Active', type: 'REST API', Icon: Wifi, color: 'text-amber-600', bg: 'bg-amber-100' },
  { date: 'AUG 15', event: 'Operations Dashboard', status: 'Online', type: 'Analytics', Icon: BarChart2, color: 'text-green-600', bg: 'bg-green-100' },
  { date: 'AUG 15', event: 'Session Authentication', status: 'Verified', type: 'Security', Icon: Shield, color: 'text-purple-600', bg: 'bg-purple-100' }
];

export function OperationalTimeline() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto" id="timeline">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold uppercase tracking-widest mb-3">
          Operational Milestones
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
          System Launch &amp; Status Timeline
        </h2>
      </motion.div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-orange-200 hidden sm:block" />
        <div className="space-y-6">
          {TIMELINE_EVENTS.map((item, idx) => {
            const { Icon } = item;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex items-start gap-5 sm:pl-20 relative"
              >
                <div className={`hidden sm:flex absolute left-5 top-1 w-6 h-6 rounded-full ${item.bg} items-center justify-center ring-2 ring-white z-10`}>
                  <Icon size={12} className={item.color} />
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-orange-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-orange-500 uppercase tracking-widest">{item.date}</span>
                      <h3 className="text-stone-800 font-semibold mt-0.5">{item.event}</h3>
                      <span className="text-xs text-stone-500 uppercase tracking-wider">{item.type}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      <CheckCircle2 size={12} />
                      {item.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
