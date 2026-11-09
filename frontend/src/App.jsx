import React from 'react';
import { LayoutWrapper } from './components/LayoutWrapper';
import { Hero } from './components/Hero';
import { HowItWorksSection } from './components/HowItWorksSection';
import { OperationsDashboard } from './components/OperationsDashboard';
import { ShipmentRiskForm } from './components/ShipmentRiskForm';
import { AnalyticsSection } from './components/AnalyticsSection';
import { ActiveShipmentsTable } from './components/ActiveShipmentsTable';
import { FeaturesSection } from './components/FeaturesSection';
import { AboutSection } from './components/AboutSection';
import { Sparkles } from 'lucide-react';

export function App() {
  return (
    <LayoutWrapper>
      {({ shipments, handleSaveShipment, handleDeleteShipment, addToast }) => (
        <div className="space-y-12">
          {/* Section 1: Hero */}
          <Hero />

          {/* Section 2: How It Works */}
          <HowItWorksSection />

          {/* Section 3: Operations Dashboard */}
          <OperationsDashboard 
            shipments={shipments} 
            onDeleteShipment={handleDeleteShipment} 
          />

          {/* Section 6: Route Risk Predictor Console */}
          <ShipmentRiskForm 
            onSaveShipment={handleSaveShipment} 
            addToast={addToast} 
          />

          {/* Section 7: Analytics & ML Benchmark Metrics */}
          <AnalyticsSection />

          {/* Live Deck & Activity Table */}
          <ActiveShipmentsTable 
            shipments={shipments} 
            onDeleteShipment={handleDeleteShipment} 
            addToast={addToast} 
          />

          {/* Platform Capabilities */}
          <FeaturesSection />

          {/* Mission Statement */}
          <AboutSection />
        </div>
      )}
    </LayoutWrapper>
  );
}

export default App;
