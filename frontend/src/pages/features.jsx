import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LayoutWrapper } from '../components/LayoutWrapper';
import { FeaturesSection } from '../components/FeaturesSection';

export function FeaturesPage() {
  return (
    <LayoutWrapper>
      <div className="pt-24 pb-16">
        <FeaturesSection />
      </div>
    </LayoutWrapper>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FeaturesPage />
  </React.StrictMode>
);
