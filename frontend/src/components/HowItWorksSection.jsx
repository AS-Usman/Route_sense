import React from 'react';
import { motion } from 'framer-motion';
import { 
  SlidersHorizontal, 
  Cpu, 
  Navigation, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  ShieldCheck,
  Zap
} from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: SlidersHorizontal,
    title: 'Configure Shipment Parameters',
    subtitle: 'Corridor & Telematics Input',
    desc: 'Enter route origin, destination, cargo sensitivity, transit distance, carrier reliability rating, and live meteorological weather conditions into the console.'
  },
  {
    step: '02',
    icon: Cpu,
    title: 'Random Forest Inference Engine',
    subtitle: 'Microsecond Multi-Model Processing',
    desc: 'Our trained Random Forest ensemble analyzes the multi-variate feature matrix against 6,000 historical route records to compute calibrated delay hours and risk levels.'
  },
  {
    step: '03',
    icon: Navigation,
    title: 'Execute Proactive Rerouting',
    subtitle: 'Avoid Costly Supply Chain Bottlenecks',
    desc: 'Receive immediate actionable advice: departure time shifts, modal transfers to Air/Rail, or alternate bypass corridors 6 to 12 hours before wheels move.'
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="how-it-works">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-700 text-xs font-mono font-bold tracking-wide uppercase mb-3 shadow-warm-sm"
        >
          <Sparkles size={12} className="text-orange-500" />
          THREE-STEP OPERATIONAL FLOW
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-display font-black text-stone-900 tracking-tight"
        >
          How RouteSense Works
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-stone-600 text-base sm:text-lg mt-3"
        >
          From dispatch telemetry configuration to AI-backed risk mitigation in three seamless steps.
        </motion.p>
      </div>

      {/* 3 Step Cards with Alternating Motion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {STEPS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-8 border border-orange-200/80 shadow-warm-md hover:shadow-warm-xl transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div>
                {/* Step Top Bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-warm-md group-hover:scale-105 transition-transform">
                    <Icon size={22} />
                  </div>
                  <span className="font-mono text-2xl font-black text-orange-200 group-hover:text-orange-400 transition-colors">
                    {item.step}
                  </span>
                </div>

                <div className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-widest mb-1">
                  {item.subtitle}
                </div>
                <h3 className="text-xl font-display font-bold text-stone-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-orange-100 flex items-center gap-2 text-xs font-mono font-bold text-orange-600">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>INTEGRATED WORKFLOW</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default HowItWorksSection;

