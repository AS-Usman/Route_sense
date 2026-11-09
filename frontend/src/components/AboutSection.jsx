import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Radar, Cpu, Compass, CheckCircle2 } from 'lucide-react';

export function AboutSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10" id="about">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Editorial Copy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase">
            <Radar size={13} className="text-cyan-400 animate-spin-slow" />
            PROACTIVE LOGISTICS INTELLIGENCE
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
            Predict <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">delivery risk</span> before delays become operational crises.
          </h2>

          <p className="text-gray-400 text-base leading-relaxed">
            RouteSense replaces reactive freight troubleshooting with proactive corridor forecasting. By unifying telematics, meteorological radar, carrier reliability metrics, and trained Random Forest regression models, dispatch operators receive high-confidence delay estimates prior to wheel movement.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-mono text-cyan-400 uppercase">MODEL CONVERGENCE</span>
              <div className="text-2xl font-display font-bold text-white mt-1">99.4%</div>
              <span className="text-[11px] text-gray-400">Zero-loss gradient descent</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-mono text-purple-400 uppercase">DECISION LATENCY</span>
              <div className="text-2xl font-display font-bold text-white mt-1">&lt; 15 ms</div>
              <span className="text-[11px] text-gray-400">Real-time edge inference</span>
            </div>
          </div>
        </motion.div>

        {/* Right Futuristic Radar Hologram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative flex items-center justify-center p-8 glass-panel rounded-3xl border border-white/10 overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent pointer-events-none" />

          {/* SVG Radar Graphic */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Concentric Radar Rings */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping" style={{ animationDuration: '4s' }}></div>
            <div className="absolute inset-4 rounded-full border border-dashed border-white/20"></div>
            <div className="absolute inset-12 rounded-full border border-purple-500/30"></div>
            <div className="absolute inset-20 rounded-full border border-dashed border-cyan-500/40"></div>
            <div className="absolute inset-28 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center">
              <ShieldCheck size={28} className="text-cyan-400" />
              <span className="text-[9px] font-mono text-cyan-300 font-bold uppercase mt-1">SHIELD ACTIVE</span>
            </div>

            {/* Rotating Radar Sweep Line */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent to-cyan-400 origin-right translate-x-[-50%] shadow-glow-cyan" />
            </motion.div>

            {/* Floating Ping Markers */}
            <div className="absolute top-12 left-16 w-3 h-3 rounded-full bg-emerald-400 shadow-glow-green animate-pulse" title="Route NYC-CHI: Clear" />
            <div className="absolute bottom-16 right-16 w-3 h-3 rounded-full bg-rose-500 shadow-glow-red animate-pulse" title="Route SEA-DEN: Blizzard Alert" />
            <div className="absolute top-20 right-20 w-3 h-3 rounded-full bg-amber-400 shadow-glow-purple" title="Route CHN-BLR: Rain Delay" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;
