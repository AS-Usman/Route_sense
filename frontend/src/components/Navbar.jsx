import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  ArrowRight,
  Zap,
  ShieldCheck,
  Compass
} from 'lucide-react';

export function Navbar({ 
  theme = 'light', 
  toggleTheme, 
  user, 
  setUser, 
  logoutUser, 
  activeTab = 'home', 
  onSelectTab 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user ? user.username : '',
    email: user && user.email ? user.email : 'dispatch@routesense.io'
  });

  const profileRef = useRef(null);

  // Detect scroll to toggle glassmorphic background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navTabs = [
    { id: 'home', label: 'Home', href: '/index.html#home' },
    { id: 'how-it-works', label: 'How It Works', href: '/index.html#how-it-works' },
    { id: 'predictor', label: 'Route Predictor', href: '/index.html#predictor' },
    { id: 'dashboard', label: 'Dashboard', href: '/index.html#dashboard' },
    { id: 'shipments', label: 'Shipments', href: '/index.html#shipments' },
    { id: 'analytics', label: 'Analytics', href: '/index.html#analytics' },
    { id: 'about', label: 'About', href: '/index.html#about' }
  ];

  const handleTabClick = (e, tab) => {
    e.preventDefault();
    if (onSelectTab) {
      onSelectTab(tab.id);
    } else {
      window.location.href = tab.href;
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'backdrop-blur-xl bg-white/85 border-b border-orange-200/60 shadow-warm-md py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a 
              href="/index.html#home" 
              onClick={(e) => handleTabClick(e, navTabs[0])}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-warm-md group-hover:scale-105 transition-all duration-300">
                <MapPin size={20} className="text-white group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-orange-600 animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-orange-500 border border-white"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-display font-black tracking-tight text-stone-900 flex items-center">
                  ROUTE<span className="text-orange-500">SENSE</span>
                </span>
                <span className="text-[9px] font-mono tracking-widest text-stone-500 uppercase font-semibold">
                  AI LOGISTICS INTELLIGENCE
                </span>
              </div>
            </a>

            {/* Desktop Navigation Tabs */}
            <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-white/80 border border-orange-200/70 shadow-warm-sm backdrop-blur-md">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={(e) => handleTabClick(e, tab)}
                    className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-stone-700 hover:text-orange-600 hover:bg-orange-50/60'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navPillWarm"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-warm-sm -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Right Action Tools */}
            <div className="hidden sm:flex items-center gap-3">
              {/* User Session Profile or Get Started CTA */}
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white hover:bg-orange-50/80 border border-orange-200 text-xs font-mono text-stone-800 transition-all shadow-warm-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">
                      {user.username ? user.username.charAt(0) : 'U'}
                    </div>
                    <span className="font-semibold text-stone-800">{user.username}</span>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-orange-200 shadow-warm-xl p-2 z-50 text-xs"
                      >
                        <div className="p-3 border-b border-orange-100 mb-1 bg-orange-50/50 rounded-xl">
                          <div className="text-[10px] font-mono text-orange-600 uppercase tracking-widest font-bold">SESSION ACTIVE</div>
                          <div className="font-bold text-stone-900 text-sm mt-0.5 truncate">{user.username}</div>
                          <div className="text-[10px] text-stone-500">ID #{user.user_id || 1} • Flask REST API</div>
                        </div>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsEditModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-stone-700 hover:text-orange-600 hover:bg-orange-50 transition-colors text-left"
                        >
                          <Settings size={14} className="text-stone-400" />
                          Account Settings
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            if (logoutUser) logoutUser();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-left mt-1"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <a
                    href="/register.html"
                    className="text-xs font-semibold text-stone-700 hover:text-orange-600 px-3 py-2 transition-colors"
                  >
                    Log In
                  </a>
                  <a
                    href="/register.html"
                    className="relative group overflow-hidden px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all shadow-warm-md hover:shadow-warm-lg flex items-center gap-1.5"
                  >
                    <span>Get Started</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="p-2 rounded-xl bg-white border border-orange-200 text-stone-700 hover:text-orange-600 shadow-warm-sm"
              >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-orange-200 px-4 py-6 space-y-3 shadow-warm-xl"
            >
              <div className="flex flex-col space-y-1">
                {navTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={(e) => {
                        setIsMobileOpen(false);
                        handleTabClick(e, tab);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-warm-sm'
                          : 'text-stone-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-orange-100 flex flex-col gap-2">
                <a
                  href="/predictor.html"
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-sm"
                >
                  Launch Route Predictor
                </a>
                <a
                  href="/register.html"
                  className="w-full text-center py-2.5 rounded-xl bg-orange-50 text-stone-800 hover:text-orange-600 text-xs font-semibold border border-orange-200"
                >
                  Carrier Login / Register
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Account Settings Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 border border-orange-200 shadow-warm-xl relative"
            >
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Settings size={18} className="text-orange-500" />
                <h3 className="text-lg font-display font-bold text-stone-900">RouteSense Account Profile</h3>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (setUser) {
                    setUser((prev) => ({
                      ...prev,
                      username: editForm.username
                    }));
                  }
                  setIsEditModalOpen(false);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-stone-600 font-mono mb-1 font-semibold">USERNAME</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-orange-50/60 border border-orange-200 text-stone-900 font-medium focus:border-orange-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-mono mb-1 font-semibold">DISPATCH EMAIL</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-orange-50/60 border border-orange-200 text-stone-900 font-medium focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
