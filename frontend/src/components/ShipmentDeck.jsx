import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Truck, CloudSun, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';

const riskBadge = (risk = 'low') => {
  const r = risk.toLowerCase();
  if (r === 'high' || r === 'severe')
    return 'bg-red-100 text-red-700 border border-red-200';
  if (r === 'moderate' || r === 'medium')
    return 'bg-amber-100 text-amber-700 border border-amber-200';
  return 'bg-green-100 text-green-700 border border-green-200';
};

const statusColor = (status = '') => {
  const s = status.toLowerCase();
  if (s.includes('delay')) return 'text-red-500';
  if (s.includes('deliver')) return 'text-green-600';
  return 'text-orange-500';
};

export function ShipmentDeck({ shipments = [] }) {
  const [deck, setDeck] = useState(shipments);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [thrownDirection, setThrownDirection] = useState(null);

  const deckRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  if (!deck || deck.length === 0) return null;

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setThrownDirection(null);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    if (e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setDragOffset({ x: e.clientX - startPosRef.current.x, y: e.clientY - startPosRef.current.y });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const deckWidth = deckRef.current ? deckRef.current.offsetWidth : 400;
    if (Math.abs(dragOffset.x) > deckWidth * 0.1) {
      const dir = dragOffset.x > 0 ? 'right' : 'left';
      setThrownDirection(dir);
      setTimeout(() => {
        setDeck((prev) => { const [top, ...rest] = prev; return [...rest, top]; });
        setDragOffset({ x: 0, y: 0 });
        setThrownDirection(null);
      }, 250);
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const cycleNext = () => {
    setThrownDirection('right');
    setTimeout(() => { setDeck((p) => { const [top, ...rest] = p; return [...rest, top]; }); setThrownDirection(null); }, 200);
  };

  const cyclePrev = () => {
    setThrownDirection('left');
    setTimeout(() => { setDeck((p) => { const last = p[p.length - 1]; return [last, ...p.slice(0, -1)]; }); setThrownDirection(null); }, 200);
  };

  return (
    <div className="text-center select-none">
      <div
        ref={deckRef}
        className="relative mx-auto"
        style={{ width: '100%', maxWidth: 420, height: 220 }}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') cycleNext(); if (e.key === 'ArrowLeft') cyclePrev(); }}
        aria-label="Active Shipments Card Deck. Use arrow keys to navigate."
      >
        {deck.slice(0, 3).map((card, index) => {
          const isTop = index === 0;
          let transform = '';
          let opacity = 1;

          if (isTop) {
            if (thrownDirection) {
              const throwX = thrownDirection === 'right' ? 500 : -500;
              transform = `translate3d(${throwX}px,0,0) rotate(${thrownDirection === 'right' ? 25 : -25}deg) scale(0.9)`;
              opacity = 0;
            } else if (isDragging) {
              transform = `translate3d(${dragOffset.x}px,${dragOffset.y * 0.3}px,0) rotate(${dragOffset.x * 0.05}deg) scale(1.02)`;
            } else {
              transform = `translate3d(0,0,0) rotate(0deg) scale(1)`;
            }
          } else if (index === 1) {
            transform = `translate3d(12px,14px,0) rotate(2.5deg) scale(0.96)`;
            opacity = 0.82;
          } else {
            transform = `translate3d(-10px,26px,0) rotate(-2deg) scale(0.92)`;
            opacity = 0.6;
          }

          const code = card.shipment_id || card.shipmentCode || `RS-${card.id}`;
          const riskLevel = card.route_risk || card.riskAnalysis?.riskLevel || 'Low';
          const weather = card.weather || card.weatherCondition || 'Clear';
          const delayDisplay = card.delay_days !== undefined ? `+${card.delay_days} days` : `+${card.riskAnalysis?.estimatedDelayHours || 0} hrs`;

          return (
            <div
              key={card.id || code}
              className="absolute inset-0 bg-white rounded-2xl border border-orange-200 shadow-lg p-5 cursor-grab active:cursor-grabbing flex flex-col justify-between"
              style={{ zIndex: 10 - index, transform, opacity, transition: isDragging && isTop ? 'none' : 'transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease' }}
              onPointerDown={isTop ? handlePointerDown : undefined}
              onPointerMove={isTop ? handlePointerMove : undefined}
              onPointerUp={isTop ? handlePointerUp : undefined}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-orange-500 uppercase tracking-widest">{code}</span>
                  <div className="flex items-center gap-1.5 mt-1 text-sm font-semibold text-stone-700">
                    <MapPin size={12} className="text-orange-400" />
                    {card.origin || 'New York'} → {card.destination || 'Chicago'}
                  </div>
                  <span className="text-xs text-stone-400 mt-0.5 block">{card.distance || 1280} km</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${riskBadge(riskLevel)}`}>
                  {riskLevel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3">
                {[
                  { label: 'Weather', value: weather, Icon: CloudSun },
                  { label: 'Status', value: card.delivery_status || 'In Transit', Icon: Truck },
                  { label: 'Delay', value: delayDisplay, Icon: AlertTriangle }
                ].map(({ label, value, Icon }) => (
                  <div key={label} className="bg-orange-50 rounded-xl p-2 text-left">
                    <Icon size={12} className="text-orange-400 mb-0.5" />
                    <div className="text-[10px] text-stone-400 uppercase tracking-wider">{label}</div>
                    <div className={`text-xs font-semibold capitalize ${label === 'Status' ? statusColor(value) : 'text-stone-700'}`}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          className="p-2 rounded-full border border-orange-200 bg-white text-orange-500 hover:bg-orange-50 transition-colors shadow-sm"
          onClick={cyclePrev}
          title="Previous (Left Arrow)"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">Swipe or use arrows</span>
        <button
          className="p-2 rounded-full border border-orange-200 bg-white text-orange-500 hover:bg-orange-50 transition-colors shadow-sm"
          onClick={cycleNext}
          title="Next (Right Arrow)"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
