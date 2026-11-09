import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LayoutWrapper } from '../components/LayoutWrapper';
import { ActiveShipmentsTable } from '../components/ActiveShipmentsTable';
import { InteractiveRouteMap } from '../components/InteractiveRouteMap';

export function ShipmentsPage() {
  return (
    <LayoutWrapper>
      {({ shipments, handleDeleteShipment, addToast }) => (
        <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-3">
              LIVE SATELLITE CORRIDOR RADAR
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
              Active Shipments & Fleet Telemetry
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-2xl">
              Track global carrier movement along empirical logistics corridors, monitor live weather hazards, and inspect delayed routes in real-time.
            </p>
          </div>

          {/* Interactive Map */}
          <InteractiveRouteMap />

          {/* Table */}
          <ActiveShipmentsTable
            shipments={shipments}
            onDeleteShipment={handleDeleteShipment}
            addToast={addToast}
          />
        </div>
      )}
    </LayoutWrapper>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ShipmentsPage />
  </React.StrictMode>
);
