import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  MapPin, 
  Truck, 
  Package, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Compass, 
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Activity
} from 'lucide-react';

export function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const cardY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[95vh] pt-36 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-[#FFF7ED] via-[#FFEDD5]/60 to-[#FFF7ED]"
      id="hero"
    >
      {/* Parallax Ambient Warm Shapes */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[500px] bg-gradient-to-tr from-orange-300/30 via-amber-200/40 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" 
      />
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-orange-200/40 blur-[90px] rounded-full pointer-events-none -z-10" 
      />
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute top-20 right-10 w-[400px] h-[400px] bg-amber-200/40 blur-[100px] rounded-full pointer-events-none -z-10" 
      />

      {/* Floating Animated Logistics Badges & Icons */}
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden md:flex absolute top-36 left-12 p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-orange-200/70 shadow-warm-lg items-center gap-3 z-10"
      >
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
          <Truck size={20} />
        </div>
        <div>
          <div className="text-[10px] font-mono text-stone-500 font-semibold uppercase">CORRIDOR TELEMETRY</div>
          <div className="text-xs font-bold text-stone-800">1,280 km Active Route</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="hidden md:flex absolute top-40 right-14 p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-orange-200/70 shadow-warm-lg items-center gap-3 z-10"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <div className="text-[10px] font-mono text-emerald-700 font-semibold uppercase">AI CONFIDENCE: 81.7%</div>
          <div className="text-xs font-bold text-stone-800">Random Forest Verified</div>
        </div>
      </motion.div>

      {/* Hero Content */}
      <motion.div 
        style={{ y: textY }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        {/* Top Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-orange-300 text-orange-700 text-xs font-mono font-bold tracking-wide mb-6 shadow-warm-sm"
        >
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          <span>AUTONOMOUS ROUTE & DELAY INTELLIGENCE</span>
          <ChevronRight size={13} className="text-orange-500" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.08] text-stone-900"
        >
          Predict Smarter.{' '}
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
            Deliver Faster.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-stone-600 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          AI-powered route intelligence that predicts delivery delays, identifies transportation risks and helps businesses make smarter logistics decisions.
        </motion.p>

        {/* Dual Warm CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="/dashboard.html"
            className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-display font-bold text-sm tracking-wide transition-all shadow-warm-md hover:shadow-warm-lg hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>Explore Dashboard</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="/predictor.html"
            className="group px-8 py-3.5 rounded-full bg-white hover:bg-orange-50/80 text-stone-800 font-display font-bold text-sm tracking-wide border border-orange-200/80 hover:border-orange-400 shadow-warm-sm hover:shadow-warm-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Zap size={16} className="text-orange-500 group-hover:scale-110 transition-transform" />
            <span>Predict Route</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Animated Route Flow & Interactive Preview Card */}
      <motion.div
        style={{ y: cardY }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-14 w-full max-w-4xl"
      >
        <div className="bg-white rounded-3xl border border-orange-200/80 shadow-warm-xl p-5 sm:p-7 relative overflow-hidden">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-orange-100 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-400"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="w-3 h-3 rounded-full bg-stone-300"></span>
              <span className="ml-3 text-xs font-mono text-stone-500 font-semibold">
                RouteSense Mission Dispatch Preview
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-orange-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              LIVE ML FORECAST
            </div>
          </div>

          {/* Animated Route Illustration with Pins & Route Line */}
          <div className="relative py-4 px-2 mb-6 bg-gradient-to-r from-orange-50/50 via-white to-amber-50/50 rounded-2xl border border-orange-100/80">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Origin Hub */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-warm-sm">
                  <MapPin size={20} />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-mono text-orange-600 font-bold uppercase">ORIGIN HUB</span>
                  <div className="text-sm font-bold text-stone-900">New York, NY</div>
                </div>
              </div>

              {/* Animated Route Line */}
              <div className="flex-1 max-w-xs w-full flex flex-col items-center px-4">
                <div className="flex items-center justify-between w-full text-[11px] font-mono text-stone-500 mb-1">
                  <span>1,280 KM</span>
                  <span className="text-emerald-600 font-bold">ON-SCHEDULE</span>
                </div>
                <div className="w-full relative h-2 bg-orange-100 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-1/2 h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full shadow-sm"
                  />
                </div>
                <div className="text-[10px] font-mono text-stone-400 mt-1">Intermodal Freight Corridor</div>
              </div>

              {/* Destination Terminal */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-warm-sm">
                  <MapPin size={20} />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-mono text-stone-500 font-bold uppercase">DESTINATION</span>
                  <div className="text-sm font-bold text-stone-900">Chicago, IL</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Metric Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-100">
              <span className="text-[10px] font-mono text-orange-700 font-bold uppercase">RISK LEVEL</span>
              <div className="text-lg font-display font-bold text-emerald-600 mt-0.5">LOW RISK (96% Safe)</div>
              <span className="text-[11px] text-stone-500">Optimal transit conditions</span>
            </div>

            <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-100">
              <span className="text-[10px] font-mono text-orange-700 font-bold uppercase">PREDICTED DELAY</span>
              <div className="text-lg font-display font-bold text-stone-900 mt-0.5">0.0 HOURS</div>
              <span className="text-[11px] text-stone-500">Zero weather backlog</span>
            </div>

            <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-100">
              <span className="text-[10px] font-mono text-orange-700 font-bold uppercase">ML MODEL CONFIDENCE</span>
              <div className="text-lg font-display font-bold text-orange-600 mt-0.5">81.7% ACCURACY</div>
              <span className="text-[11px] text-stone-500">Trained on 6,000 shipments</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;
