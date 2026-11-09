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
        <div className="pt-24 pb-16">
          <OperationsDashboard shipments={shipments} onDeleteShipment={handleDeleteShipment} />
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
