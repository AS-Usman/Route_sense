import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowUp, 
  MapPin, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Github, 
  Twitter, 
  Linkedin,
  Zap
} from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#050811] border-t border-white/10 pt-20 pb-12 overflow-hidden">
      {/* Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-cyan-500/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pre-footer Call to Action */}
        <div className="text-center max-w-3xl mx-auto mb-16 pb-16 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase mb-4">
            <Zap size={12} />
            NEXT-GEN DISPATCH INFRASTRUCTURE
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
            Know the risk before <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              the shipment moves.
            </span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Supercharge fleet dispatch decisions with empirical machine learning forecasts and live weather risk mitigations.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/predictor.html"
              className="px-6 py-3 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-display font-bold text-xs tracking-wider transition-all shadow-glow-cyan flex items-center gap-2"
            >
              <span>ANALYZE ROUTE RISK</span>
              <ArrowRight size={14} />
            </a>
            <a
              href="/dashboard.html"
              className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-display font-semibold text-xs border border-white/10 transition-colors"
            >
              EXPLORE OPERATIONS
            </a>
          </div>
        </div>

        {/* 4 Columns Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {/* Col 1: Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-glow-cyan">
                <MapPin size={16} />
              </div>
              <span className="text-lg font-display font-black text-white tracking-tight">
                ROUTE<span className="text-cyan-400">SENSE</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Empirical route risk analytics, weather-aware dispatch mitigation, and delivery delay regression platform.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ALL SYSTEMS OPERATIONAL
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">PLATFORM</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="/predictor.html" className="hover:text-cyan-400 transition-colors">Risk Predictor</a></li>
              <li><a href="/dashboard.html" className="hover:text-cyan-400 transition-colors">Operations Control</a></li>
              <li><a href="/shipments.html" className="hover:text-cyan-400 transition-colors">Satellite Corridor Map</a></li>
              <li><a href="/dashboard.html#analytics" className="hover:text-cyan-400 transition-colors">Telemetry Analytics</a></li>
            </ul>
          </div>

          {/* Col 3: ML Intelligence */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">ML INTELLIGENCE</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-mono">
              <li>RandomForest (R²: 0.902)</li>
              <li>4-Class Risk Classifier</li>
              <li>Weather Hazard Weights</li>
              <li>Modal Sensitivity Index</li>
            </ul>
          </div>

          {/* Col 4: Dispatch & Auth */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">SECURITY & ACCESS</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="/register.html" className="hover:text-cyan-400 transition-colors">Carrier Login</a></li>
              <li><a href="/register.html" className="hover:text-cyan-400 transition-colors">Register Dispatch Account</a></li>
              <li><a href="/contact.html" className="hover:text-cyan-400 transition-colors">Mission Control Support</a></li>
              <li><span className="font-mono text-[11px] text-cyan-400">REST API: Port 5000</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-mono">
          <div>
            ROUTESENSE AI © {new Date().getFullYear()} • PREDICTIVE LOGISTICS SAAS
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
              title="Return to top"
            >
              <span>TOP</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
