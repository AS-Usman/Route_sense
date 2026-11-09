import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateShipmentRisk } from '../hooks/useDelayPredictor';
import { API_BASE } from '../config/api';

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { ToastContainer } from './Toast';
import { ScrollProgressBar } from './ScrollProgressBar';

const DEFAULT_SHIPMENTS = [
  {
    id: 101,
    shipment_id: 'RS-9421',
    origin: 'New York, NY',
    destination: 'Chicago, IL',
    distance: 1280,
    weather: 'storm',
    route_risk: 'Moderate',
    delivery_status: 'In Transit',
    delay_days: 1
  },
  {
    id: 102,
    shipment_id: 'RS-5510',
    origin: 'Los Angeles, CA',
    destination: 'Dallas, TX',
    distance: 2300,
    weather: 'clear',
    route_risk: 'Low',
    delivery_status: 'Delivered',
    delay_days: 0
  },
  {
    id: 103,
    shipment_id: 'RS-3382',
    origin: 'Seattle, WA',
    destination: 'Denver, CO',
    distance: 2100,
    weather: 'snow',
    route_risk: 'Severe',
    delivery_status: 'Delayed',
    delay_days: 3
  }
].map((s) => ({ ...s, riskAnalysis: calculateShipmentRisk(s) }));

export function LayoutWrapper({ children }) {
  const { theme, toggleTheme } = useTheme();
  const [shipments, setShipments] = useLocalStorage('activeShipments', DEFAULT_SHIPMENTS);
  const [toasts, setToasts] = useState([]);
  const [user, setUser] = useLocalStorage('currentUser', null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync shipments & user profile with Flask REST API on mount
  useEffect(() => {
    fetch(`${API_BASE}/shipments`, { credentials: 'include' })
      .then((res) => res.json())
      .then((resData) => {
        if (Array.isArray(resData)) {
          const formatted = resData.map((s) => ({
            ...s,
            riskAnalysis: calculateShipmentRisk(s)
          }));
          setShipments(formatted);
        }
      })
      .catch((err) => console.log('Flask Backend API offline, using local state:', err));

    // Check Flask session profile status
    fetch(`${API_BASE}/profile`, { credentials: 'include' })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.username) {
          setUser({ username: data.username, user_id: data.user_id });
        }
      })
      .catch(() => {});
  }, []);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveShipment = async (newShipment) => {
    const payload = {
      shipment_id: newShipment.shipment_id || newShipment.shipmentCode || ('RS-' + Math.floor(1000 + Math.random() * 9000)),
      origin: newShipment.origin,
      destination: newShipment.destination,
      distance: Number(newShipment.distance),
      weather: newShipment.weather || newShipment.weatherCondition || 'clear',
      route_risk: newShipment.route_risk || (newShipment.riskAnalysis && newShipment.riskAnalysis.riskLevel) || 'Low',
      delivery_status: newShipment.delivery_status || 'Pending',
      delay_days: Number(newShipment.delay_days || 0)
    };

    try {
      const res = await fetch(`${API_BASE}/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.shipment) {
        // Persist prediction telemetry into MySQL predictions table
        fetch(`${API_BASE}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            shipment_id: payload.shipment_id,
            origin: payload.origin,
            destination: payload.destination,
            distance: payload.distance,
            weather: payload.weather,
            transport_mode: newShipment.transportMode || 'truck',
            cargo_category: newShipment.cargoCategory || 'standard',
            cargo_weight: newShipment.cargoWeight || 2500,
            carrier_rating: newShipment.carrierRating || 'A',
            traffic_congestion: newShipment.trafficCongestion || 35
          })
        }).catch(() => {});

        const item = { ...data.shipment, riskAnalysis: newShipment.riskAnalysis || calculateShipmentRisk(data.shipment) };
        setShipments((prev) => [item, ...prev]);
        addToast(`Shipment ${payload.shipment_id} saved & ML telemetry recorded!`, 'success');
        return;
      } else if (data.error) {
        addToast(`Server note: ${data.error}`, 'info');
      }
    } catch (e) {
      console.log('Flask API POST failed, saving locally:', e);
    }

    const localItem = { ...payload, id: Date.now(), riskAnalysis: calculateShipmentRisk(payload) };
    setShipments((prev) => [localItem, ...prev]);
    addToast(`Shipment ${payload.shipment_id} saved locally.`, 'success');
  };

  const handleDeleteShipment = async (id) => {
    try {
      await fetch(`${API_BASE}/shipments/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
    } catch (e) {
      console.log('Flask API DELETE failed, removing locally:', e);
    }
    setShipments((prev) => prev.filter((s) => s.id !== id && s.shipment_id !== id));
  };

  const logoutUser = async () => {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.log('Flask logout fetch failed:', e);
    }
    setUser(null);
    addToast('Logged out successfully', 'info');
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] text-stone-900 font-sans antialiased selection:bg-orange-500/30 selection:text-orange-900 flex flex-col justify-between">
      <ScrollProgressBar />
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        logoutUser={logoutUser}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        logoutUser={logoutUser}
      />

      <main className="relative z-10 flex-grow">
        {typeof children === 'function'
          ? children({
              shipments,
              addToast,
              handleSaveShipment,
              handleDeleteShipment,
              user,
              setUser,
              logoutUser,
              toggleSidebar: () => setIsSidebarOpen(!isSidebarOpen)
            })
          : children}
      </main>

      <Footer />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
