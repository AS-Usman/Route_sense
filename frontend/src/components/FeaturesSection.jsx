import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ShieldAlert, 
  CloudSun, 
  Activity, 
  Cpu, 
  Compass, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const FEATURES = [
  {
    num: '01',
    icon: Zap,
    title: 'Smart Delay Risk Scoring',
    desc: 'Empirical multi-variate risk scoring assessing weather hazards, traffic density, and carrier reliability in real time.'
  },
  {
    num: '02',
    icon: ShieldAlert,
    title: 'Proactive Alert Matrix',
    desc: 'Receive automated risk warnings on supply chain disruptions 6-12 hours prior to corridor departure.'
  },
  {
    num: '03',
    icon: CloudSun,
    title: 'Meteorological Routing',
    desc: 'Automatically reroute high-priority cargo corridors around severe storms, blizzards, or extreme heat passes.'
  },
  {
    num: '04',
    icon: Activity,
    title: 'Fleet Health & Telemetry',
    desc: 'Monitor carrier reliability ratings, modal transit speeds, fuel burn indices, and driver rest intervals.'
  },
  {
    num: '05',
    icon: Cpu,
    title: 'Random Forest ML Engine',
    desc: 'Trained on 6,000 real-world shipments achieving 0.902 R² regression accuracy and 81.7% 4-class risk categorization.'
  },
  {
    num: '06',
    icon: Compass,
    title: 'Satellite Freight Mapping',
    desc: 'Visualize live intermodal corridors with dynamic risk color coding and simulated carrier progress tracking.'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="features">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-xs font-mono uppercase font-semibold mb-4">
          <Sparkles size={12} />
          ENTERPRISE-GRADE CAPABILITIES
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-black text-stone-900 tracking-tight">
          Logistics Intelligence Architecture
        </h2>
        <p className="text-stone-600 text-sm sm:text-base mt-3">
          Built for modern supply chain dispatch teams requiring microsecond inference, empirical forecasts, and automated risk mitigation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-7 border border-orange-200/70 shadow-sm hover:shadow-xl hover:border-orange-400/80 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-500 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                    <Icon size={20} />
                  </div>
                  <span className="font-mono text-xs text-orange-400 font-bold">
                    {feat.num}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 tracking-tight mb-2 group-hover:text-orange-600 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between text-xs font-mono text-orange-600 font-semibold group-hover:translate-x-1 transition-transform">
                <span>EXPLORE CAPABILITY</span>
                <ArrowRight size={14} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturesSection;
