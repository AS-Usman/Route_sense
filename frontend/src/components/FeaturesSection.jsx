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
  TrendingUp,
  Radio,
  Sparkles
} from 'lucide-react';

const FEATURES = [
  {
    num: '01',
    icon: Zap,
    color: 'cyan',
    title: 'SMART DELAY RISK SCORING',
    desc: 'Empirical multi-variate risk scoring assessing weather hazards, traffic density, and carrier reliability in real time.'
  },
  {
    num: '02',
    icon: ShieldAlert,
    color: 'purple',
    title: 'PROACTIVE ALERT MATRIX',
    desc: 'Receive automated risk warnings on supply chain disruptions 6-12 hours prior to corridor departure.'
  },
  {
    num: '03',
    icon: CloudSun,
    color: 'amber',
    title: 'METEOROLOGICAL ROUTING',
    desc: 'Automatically reroute high-priority cargo corridors around severe storms, blizzards, or extreme heat passes.'
  },
  {
    num: '04',
    icon: Activity,
    color: 'emerald',
    title: 'FLEET HEALTH & TELEMETRY',
    desc: 'Monitor carrier reliability ratings, modal transit speeds, fuel burn indices, and driver rest intervals.'
  },
  {
    num: '05',
    icon: Cpu,
    color: 'cyan',
    title: 'RANDOM FOREST ML ENGINE',
    desc: 'Trained on 6,000 real-world shipments achieving 0.902 R² regression accuracy and 81.7% 4-class risk categorization.'
  },
  {
    num: '06',
    icon: Compass,
    color: 'purple',
    title: 'SATELLITE FREIGHT MAPPING',
    desc: 'Visualize live intermodal corridors with dynamic risk color coding and simulated carrier progress tracking.'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="features">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase mb-4">
          <Sparkles size={12} />
          ENTERPRISE-GRADE CAPABILITIES
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
          Logistics Intelligence Architecture
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mt-3">
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
              className="glass-card rounded-2xl p-6 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-400 transition-all shadow-glow-cyan">
                    <Icon size={18} />
                  </div>
                  <span className="font-mono text-xs text-gray-500 font-bold group-hover:text-cyan-400 transition-colors">
                    {feat.num}
                  </span>
                </div>

                <h3 className="text-base font-display font-bold text-white tracking-wide mb-2 group-hover:text-cyan-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>EXPLORE CAPABILITY</span>
                <ArrowRight size={13} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturesSection;
