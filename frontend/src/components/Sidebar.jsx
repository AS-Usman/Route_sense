import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Home, 
  Calculator, 
  Package, 
  LayoutDashboard, 
  Sparkles, 
  Mail, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  ChevronRight,
  Activity
} from 'lucide-react';

export function Sidebar({ 
  isOpen, 
  onClose, 
  theme, 
  toggleTheme, 
  user, 
  logoutUser,
  activeTab = 'home',
  onSelectTab
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navItems = [
    { id: 'home', label: 'Home', href: '/index.html#home', icon: Home },
    { id: 'how-it-works', label: 'How It Works', href: '/index.html#how-it-works', icon: Sparkles },
    { id: 'predictor', label: 'Route Predictor', href: '/index.html#predictor', icon: Calculator },
    { id: 'dashboard', label: 'Dashboard', href: '/index.html#dashboard', icon: LayoutDashboard },
    { id: 'shipments', label: 'Active Shipments', href: '/index.html#shipments', icon: Package },
    { id: 'analytics', label: 'Analytics', href: '/index.html#analytics', icon: Activity },
    { id: 'about', label: 'About', href: '/index.html#about', icon: Home }
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemClick = (e, item) => {
    e.preventDefault();
    if (onSelectTab && item.id) {
      onSelectTab(item.id);
    } else {
      window.location.href = item.href;
    }
    onClose();
  };

  return (
    <>
      <div className="sidebar-backdrop" onClick={onClose} />
      <aside className={`codinglab-sidebar ${isCollapsed ? 'collapsed' : ''}`}>

        {/* Brand Header */}
        <div className="sidebar-header-box">
          <div className="sidebar-brand-group">
            <div className="brand-badge-box">
              <img src="/supplyiq_logo.png" alt="SupplyIQ Logo" className="brand-badge-img" />
            </div>
            {!isCollapsed && (
              <div className="brand-info-text">
                <strong>SupplyIQ</strong>
                <span>Logistics Intelligence</span>
              </div>
            )}
          </div>

          {/* Expand / Collapse Toggle Arrow */}
          <button
            className="sidebar-toggle-arrow"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar Expand"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="sidebar-search-box">
            <Search size={14} className="sidebar-search-icon" />
            <input
              type="text"
              className="sidebar-search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Navigation Items List */}
        <ul className="sidebar-nav-list" style={{ flex: 1, overflowY: 'auto' }}>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <li key={item.label}>
                <button
                  type="button"
                  className={`sidebar-nav-item ${active ? 'active' : ''}`}
                  title={item.label}
                  onClick={(e) => handleItemClick(e, item)}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Icon size={18} className="nav-item-icon" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Bottom Utility Controls */}
        <div className="sidebar-bottom-section">

          {/* Logout / Login Button */}
          {user ? (
            <button
              className="sidebar-nav-item"
              onClick={() => {
                if (logoutUser) logoutUser();
                onClose();
              }}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 14px' }}
            >
              <LogOut size={18} style={{ color: 'var(--danger)' }} />
              {!isCollapsed && <span style={{ color: 'var(--danger)' }}>Logout</span>}
            </button>
          ) : (
            <a
              href="/register.html"
              className="sidebar-nav-item"
              onClick={onClose}
            >
              <User size={18} />
              {!isCollapsed && <span>Login</span>}
            </a>
          )}

          {/* Dark Mode / Light Mode Switch Row */}
          <div className="sidebar-toggle-switch-row" onClick={toggleTheme} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              {!isCollapsed && (
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              )}
            </div>

            <div className={`toggle-switch-pill ${theme === 'dark' ? 'checked' : ''}`}>
              <div className="toggle-switch-thumb" />
            </div>
          </div>

        </div>

      </aside>
    </>
  );
}
