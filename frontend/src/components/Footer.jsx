import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowUp, 
  MapPin, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Zap
} from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#FFF7ED] via-[#FFEDD5]/60 to-[#FED7AA]/40 border-t border-orange-200/60 pt-20 pb-12 overflow-hidden text-stone-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pre-footer Call to Action */}
        <div className="text-center max-w-3xl mx-auto mb-16 pb-16 border-b border-orange-200/60">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-xs font-mono uppercase font-semibold mb-4">
            <Zap size={12} />
            NEXT-GEN DISPATCH INFRASTRUCTURE
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-stone-900 tracking-tight leading-tight">
            Know the risk before <br />
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              the shipment moves.
            </span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Supercharge fleet dispatch decisions with empirical machine learning forecasts and live weather risk mitigations.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/predictor.html"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-display font-bold text-xs tracking-wider transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>ANALYZE ROUTE RISK</span>
              <ArrowRight size={14} />
            </a>
            <a
              href="/dashboard.html"
              className="px-6 py-3 rounded-full bg-white hover:bg-orange-50 text-stone-700 font-display font-semibold text-xs border border-orange-200 transition-colors shadow-sm"
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
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-200 flex items-center justify-center text-orange-500 shadow-sm">
                <MapPin size={16} />
              </div>
              <span className="text-lg font-display font-black text-stone-900 tracking-tight">
                ROUTE<span className="text-orange-500">SENSE</span>
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Empirical route risk analytics, weather-aware dispatch mitigation, and delivery delay regression platform.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              ALL SYSTEMS OPERATIONAL
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-wider mb-4">PLATFORM</h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li><a href="/predictor.html" className="hover:text-orange-600 transition-colors">Risk Predictor</a></li>
              <li><a href="/dashboard.html" className="hover:text-orange-600 transition-colors">Operations Control</a></li>
              <li><a href="/shipments.html" className="hover:text-orange-600 transition-colors">Satellite Corridor Map</a></li>
              <li><a href="/dashboard.html#analytics" className="hover:text-orange-600 transition-colors">Telemetry Analytics</a></li>
            </ul>
          </div>

          {/* Col 3: ML Intelligence */}
          <div>
            <h4 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-wider mb-4">ML INTELLIGENCE</h4>
            <ul className="space-y-2 text-xs text-stone-600 font-mono">
              <li>RandomForest (R²: 0.902)</li>
              <li>4-Class Risk Classifier</li>
              <li>Weather Hazard Weights</li>
              <li>Modal Sensitivity Index</li>
            </ul>
          </div>

          {/* Col 4: Dispatch & Auth */}
          <div>
            <h4 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-wider mb-4">SECURITY & ACCESS</h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li><a href="/register.html" className="hover:text-orange-600 transition-colors">Carrier Login</a></li>
              <li><a href="/register.html" className="hover:text-orange-600 transition-colors">Register Dispatch Account</a></li>
              <li><a href="/contact.html" className="hover:text-orange-600 transition-colors">Mission Control Support</a></li>
              <li><span className="font-mono text-[11px] text-orange-600 font-semibold">REST API: Port 5000</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-orange-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-mono">
          <div>
            ROUTESENSE AI © {new Date().getFullYear()} • PREDICTIVE LOGISTICS SAAS
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white hover:bg-orange-50 text-stone-600 hover:text-orange-600 border border-orange-200 transition-colors flex items-center gap-1.5 shadow-sm"
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
