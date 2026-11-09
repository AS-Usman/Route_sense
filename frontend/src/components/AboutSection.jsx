import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Radar, Cpu, Compass, CheckCircle2 } from 'lucide-react';

export function AboutSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-orange-200/50" id="about">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Editorial Copy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-xs font-mono uppercase font-semibold">
            <Radar size={13} className="text-orange-500 animate-spin-slow" />
            PROACTIVE LOGISTICS INTELLIGENCE
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-black text-stone-900 tracking-tight leading-tight">
            Predict <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">delivery risk</span> before delays become operational crises.
          </h2>

          <p className="text-stone-600 text-base leading-relaxed">
            RouteSense replaces reactive freight troubleshooting with proactive corridor forecasting. By unifying telematics, meteorological radar, carrier reliability metrics, and trained Random Forest regression models, dispatch operators receive high-confidence delay estimates prior to wheel movement.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-orange-100">
            <div className="p-4 rounded-2xl bg-white border border-orange-200/60 shadow-sm">
              <span className="text-[10px] font-mono text-orange-600 uppercase font-bold">MODEL CONVERGENCE</span>
              <div className="text-2xl font-display font-bold text-stone-900 mt-1">99.4%</div>
              <span className="text-[11px] text-stone-500">Zero-loss gradient descent</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-orange-200/60 shadow-sm">
              <span className="text-[10px] font-mono text-amber-600 uppercase font-bold">DECISION LATENCY</span>
              <div className="text-2xl font-display font-bold text-stone-900 mt-1">&lt; 15 ms</div>
              <span className="text-[11px] text-stone-500">Real-time edge inference</span>
            </div>
          </div>
        </motion.div>

        {/* Right Radar Hologram in Warm Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative flex items-center justify-center p-8 bg-gradient-to-br from-orange-50/80 via-white to-amber-50/60 rounded-3xl border border-orange-200 shadow-xl overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-amber-500/10 to-transparent pointer-events-none" />

          {/* SVG Radar Graphic */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Concentric Radar Rings */}
            <div className="absolute inset-0 rounded-full border border-orange-300/40 animate-ping" style={{ animationDuration: '4s' }}></div>
            <div className="absolute inset-4 rounded-full border border-dashed border-orange-200"></div>
            <div className="absolute inset-12 rounded-full border border-orange-300/40"></div>
            <div className="absolute inset-20 rounded-full border border-dashed border-orange-400/50"></div>
            <div className="absolute inset-28 rounded-full border border-orange-200 bg-white/90 backdrop-blur-md shadow-md flex flex-col items-center justify-center">
              <ShieldCheck size={28} className="text-orange-500" />
              <span className="text-[9px] font-mono text-orange-600 font-bold uppercase mt-1">SHIELD ACTIVE</span>
            </div>

            {/* Rotating Radar Sweep Line */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent to-orange-500 origin-right translate-x-[-50%]" />
            </motion.div>

            {/* Floating Ping Markers */}
            <div className="absolute top-12 left-16 w-3 h-3 rounded-full bg-emerald-500 shadow-md animate-pulse" title="Route NYC-CHI: Clear" />
            <div className="absolute bottom-16 right-16 w-3 h-3 rounded-full bg-rose-500 shadow-md animate-pulse" title="Route SEA-DEN: Blizzard Alert" />
            <div className="absolute top-20 right-20 w-3 h-3 rounded-full bg-amber-500 shadow-md" title="Route CHN-BLR: Rain Delay" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;
