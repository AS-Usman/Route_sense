import React from 'react';

const NETWORK_MODULES = [
  { num: '01', category: 'ROUTE INTELLIGENCE', status: 'ONLINE', count: '1,280 LANES' },
  { num: '02', category: 'WEATHER ANALYSIS', status: 'ACTIVE', count: '6 HAZARD TYPES' },
  { num: '03', category: 'CARRIER RISK', status: 'MONITORED', count: '5 RELIABILITY TIERS' },
  { num: '04', category: 'TRAFFIC SIGNALS', status: 'STREAMING', count: 'REAL-TIME DENSITY' },
  { num: '05', category: 'SHIPMENT MONITORING', status: 'SYNCHRONIZED', count: 'FLASK DB CONNECTED' },
  { num: '06', category: 'AI PREDICTION', status: 'ACTIVE', count: '98.4% CONFIDENCE' }
];

export function LogisticsNetwork() {
  return (
    <section className="section-pad hairline-bottom" id="logistics-network">
      <div style={{ marginBottom: '40px' }}>
        <span className="section-label">SYSTEM INFRASTRUCTURE</span>
        <h2 className="section-heading">Logistics Network Overview</h2>
      </div>

      <div className="editorial-list">
        {NETWORK_MODULES.map((item) => (
          <div key={item.num} className="editorial-row" style={{ gridTemplateColumns: '60px 2fr 1fr 120px' }}>
            <span className="editorial-num">{item.num}</span>
            <h3 className="editorial-title" style={{ fontSize: '1.25rem' }}>{item.category}</h3>
            <span className="label-caps-amber" style={{ fontSize: '10.5px' }}>{item.count}</span>
            <span className="badge badge-info" style={{ justifySelf: 'end' }}>{item.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
