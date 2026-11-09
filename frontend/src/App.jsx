import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutWrapper } from './components/LayoutWrapper';
import { Hero } from './components/Hero';
import { HowItWorksSection } from './components/HowItWorksSection';
import { OperationsDashboard } from './components/OperationsDashboard';
import { ShipmentRiskForm } from './components/ShipmentRiskForm';
import { AnalyticsSection } from './components/AnalyticsSection';
import { ActiveShipmentsTable } from './components/ActiveShipmentsTable';
import { FeaturesSection } from './components/FeaturesSection';
import { AboutSection } from './components/AboutSection';
import { Sparkles, Zap, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

export function App() {
  return (
    <LayoutWrapper>
      {({ 
        shipments, 
        handleSaveShipment, 
        handleDeleteShipment, 
        addToast, 
        activeTab, 
        setActiveTab 
      }) => (
        <div className="min-h-[80vh]">
          <AnimatePresence mode="wait">
            {/* 1. HOME TAB */}
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-16"
              >
                <Hero onNavigate={setActiveTab} />
                <FeaturesSection />

                {/* Quick-Launch CTA Section */}
                <div className="pb-20 px-4 max-w-7xl mx-auto">
                  <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-warm-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <div className="text-xs font-mono font-bold tracking-widest uppercase text-orange-100 mb-2 flex items-center gap-2">
                        <Sparkles size={14} className="text-orange-200" />
                        READY TO SIMULATE YOUR TRANSIT CORRIDOR?
                      </div>
                      <h3 className="text-2xl sm:text-4xl font-display font-black tracking-tight">
                        Predict Route Disruptions with Random Forest AI
                      </h3>
                      <p className="text-orange-100 text-sm mt-2 max-w-xl">
                        Simulate adverse weather conditions, highway bottlenecks, and carrier reliability variance with instant AI delay forecasting.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button 
                        type="button"
                        onClick={() => setActiveTab('predictor')} 
                        className="px-6 py-3.5 rounded-2xl bg-white text-orange-600 font-display font-bold text-sm hover:bg-orange-50 transition-all shadow-warm-md flex items-center gap-2 cursor-pointer"
                      >
                        <Zap size={16} className="text-orange-500" />
                        <span>Launch Predictor</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveTab('dashboard')} 
                        className="px-6 py-3.5 rounded-2xl bg-orange-600/70 border border-orange-300 text-white font-display font-bold text-sm hover:bg-orange-600 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>Open Dashboard</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. HOW IT WORKS TAB */}
            {activeTab === 'how-it-works' && (
              <motion.div
                key="how-it-works"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-24 pb-16"
              >
                <HowItWorksSection />
              </motion.div>
            )}

            {/* 3. ROUTE PREDICTOR TAB */}
            {activeTab === 'predictor' && (
              <motion.div
                key="predictor"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-24 pb-16"
              >
                <ShipmentRiskForm onSaveShipment={handleSaveShipment} addToast={addToast} />
              </motion.div>
            )}

            {/* 4. DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-24 pb-16"
              >
                <OperationsDashboard 
                  shipments={shipments} 
                  onDeleteShipment={handleDeleteShipment} 
                />
              </motion.div>
            )}

            {/* 5. SHIPMENTS TAB */}
            {activeTab === 'shipments' && (
              <motion.div
                key="shipments"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-xs font-mono tracking-widest uppercase font-semibold mb-3">
                    <Activity size={13} className="text-orange-500" />
                    ACTIVE FLEET TELEMETRY
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-display font-black text-stone-900 tracking-tight">
                    Active Shipments Deck
                  </h1>
                  <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl">
                    Real-time carrier movement, live delay monitoring, and database management for all active consignments synchronized with Supabase.
                  </p>
                </div>
                <ActiveShipmentsTable 
                  shipments={shipments} 
                  onDeleteShipment={handleDeleteShipment} 
                  addToast={addToast} 
                />
              </motion.div>
            )}

            {/* 6. ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-24 pb-16"
              >
                <AnalyticsSection />
              </motion.div>
            )}

            {/* 7. ABOUT TAB */}
            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-24 pb-16"
              >
                <AboutSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </LayoutWrapper>
  );
}

export default App;
