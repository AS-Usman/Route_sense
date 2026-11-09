import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LayoutWrapper } from '../components/LayoutWrapper';
import { ActiveShipmentsTable } from '../components/ActiveShipmentsTable';

export function ShipmentsPage() {
  return (
    <LayoutWrapper>
      {({ shipments, handleDeleteShipment, addToast }) => (
        <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-xs font-mono tracking-widest uppercase font-semibold mb-3">
              ACTIVE FLEET TELEMETRY
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-stone-900 tracking-tight">
              Active Shipments & Fleet Telemetry
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl">
              Track global carrier movement, monitor live weather hazards, and inspect delayed routes in real-time.
            </p>
          </div>

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
