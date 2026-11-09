import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LayoutWrapper } from '../components/LayoutWrapper';
import { OperationsDashboard } from '../components/OperationsDashboard';
import { AnalyticsSection } from '../components/AnalyticsSection';

export function DashboardPage() {
  return (
    <LayoutWrapper>
      {({ shipments, handleDeleteShipment }) => (
        <div className="pt-24">
          <OperationsDashboard shipments={shipments} onDeleteShipment={handleDeleteShipment} />
          <AnalyticsSection />
        </div>
      )}
    </LayoutWrapper>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DashboardPage />
  </React.StrictMode>
);
