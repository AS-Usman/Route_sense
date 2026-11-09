import React from 'react';
import { LayoutWrapper } from './components/LayoutWrapper';
import { Hero } from './components/Hero';
import { OperationsDashboard } from './components/OperationsDashboard';
import { ShipmentRiskForm } from './components/ShipmentRiskForm';
import { InteractiveRouteMap } from './components/InteractiveRouteMap';
import { AnalyticsSection } from './components/AnalyticsSection';
import { ActiveShipmentsTable } from './components/ActiveShipmentsTable';
import { FeaturesSection } from './components/FeaturesSection';
import { AboutSection } from './components/AboutSection';
import { Compass, Sparkles } from 'lucide-react';

export function App() {
  return (
    <LayoutWrapper>
      {({ shipments, handleSaveShipment, handleDeleteShipment, addToast }) => (
        <div className="space-y-12">
          {/* Section 3: Hero */}
          <Hero />

          {/* Section 5: Operations Dashboard */}
          <OperationsDashboard 
            shipments={shipments} 
            onDeleteShipment={handleDeleteShipment} 
          />

          {/* Section 6: Route Risk Predictor Console */}
          <ShipmentRiskForm 
            onSaveShipment={handleSaveShipment} 
            addToast={addToast} 
          />

          {/* Section 7: Dedicated Full-Scale Satellite Freight Corridor Map */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="map">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase mb-3">
                <Compass size={13} className="animate-spin-slow" />
                INTERACTIVE CORRIDOR TELEMETRY
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                Global Freight Radar & Corridor Navigator
              </h2>
              <p className="text-gray-400 text-sm sm:text-base mt-2">
                Simulate real-time vessel, aircraft, and truck progress along major freight lanes. Color-coded based on live route risk.
              </p>
            </div>

            <InteractiveRouteMap />
          </section>

          {/* Section 8: Analytics & ML Benchmark Metrics */}
          <AnalyticsSection />

          {/* Live Deck & Activity Table */}
          <ActiveShipmentsTable 
            shipments={shipments} 
            onDeleteShipment={handleDeleteShipment} 
            addToast={addToast} 
          />

          {/* Platform Capabilities */}
          <FeaturesSection />

          {/* Mission & Radar Statement */}
          <AboutSection />
        </div>
      )}
    </LayoutWrapper>
  );
}

export default App;
