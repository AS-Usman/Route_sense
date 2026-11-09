import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../config/api';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export function RegistrationForm({ user, setUser, logoutUser, addToast }) {
  const [authMode, setAuthMode] = useState('register'); // 'register' | 'login'
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Criteria validation
  const getPasswordCriteria = (pass) => ({
    minChar: pass.length >= 8,
    hasUpper: /[A-Z]/.test(pass),
    hasLower: /[a-z]/.test(pass),
    hasNumber: /[0-9]/.test(pass)
  });

  const validateRegister = () => {
    const errs = {};
    if (!formData.fullname.trim()) errs.fullname = 'Full name/username is required.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Valid email is required.';
    }
    const c = getPasswordCriteria(formData.password);
    if (!c.minChar || !c.hasUpper || !c.hasLower || !c.hasNumber) {
      errs.password = 'Password does not meet all security criteria.';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setLoading(true);
    const username = formData.fullname.trim();

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: username,
          password: formData.password
        })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setUser({ username: username, user_id: data.user_id });
        if (addToast) addToast(`Account created! Welcome, ${username}`, 'success');
        setFormData({ fullname: '', email: '', phone: '', password: '', confirmPassword: '' });
      } else {
        if (addToast) addToast(data.error || 'Registration failed', 'error');
      }
    } catch (err) {
      setLoading(false);
      // Fallback local session if offline
      setUser({ username: username, user_id: Date.now() });
      if (addToast) addToast(`Registered locally (Backend offline): ${username}`, 'info');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.username.trim() || !loginData.password.trim()) {
      if (addToast) addToast('Please enter both username and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: loginData.username.trim(),
          password: loginData.password
        })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setUser({ username: data.username, user_id: data.user_id });
        if (addToast) addToast(`Welcome back, ${data.username}!`, 'success');
        setLoginData({ username: '', password: '' });
      } else {
        if (addToast) addToast(data.error || 'Invalid credentials', 'error');
      }
    } catch (err) {
      setLoading(false);
      setUser({ username: loginData.username.trim(), user_id: Date.now() });
      if (addToast) addToast(`Logged in locally (Offline mode): ${loginData.username}`, 'info');
    }
  };

  const criteria = getPasswordCriteria(formData.password);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="register">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-xs font-mono uppercase font-semibold mb-3">
          <ShieldCheck size={13} />
          AUTHENTICATION & FLEET ACCESS
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-black text-stone-900 tracking-tight">
          RouteSense Portal Access
        </h2>
        <p className="text-stone-600 text-sm mt-2">
          Secure carrier login and account registration backed by cryptographic password hashing and session tokens.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-xl relative">
        {user ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-orange-400 to-amber-500 flex items-center justify-center text-xl font-bold text-white shadow-md">
              {user.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <span className="text-[10px] font-mono text-orange-600 font-bold uppercase tracking-widest">ACTIVE SESSION</span>
              <h3 className="text-xl font-display font-bold text-stone-900 mt-1">Logged in as {user.username}</h3>
              <p className="text-xs text-stone-500 mt-1">Authenticated on RouteSense Dispatch Portal</p>
            </div>
            <div className="pt-4">
              <button
                onClick={logoutUser}
                className="w-full py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-mono text-xs font-bold border border-red-200 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={14} /> SIGN OUT SESSION
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 rounded-xl bg-orange-50 border border-orange-200 mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                  authMode === 'register'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                CREATE ACCOUNT
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                  authMode === 'login'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                SIGN IN
              </button>
            </div>

            {authMode === 'register' ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-stone-600 mb-1 flex items-center gap-1.5 font-medium">
                    <User size={12} className="text-orange-500" /> USERNAME / FULL NAME
                  </label>
                  <input
                    type="text"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-orange-50/50 border border-orange-200 text-stone-900 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all"
                    placeholder="e.g. John Doe"
                    required
                  />
                  {errors.fullname && <span className="text-red-500 text-[11px] mt-1 block">{errors.fullname}</span>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-600 mb-1 flex items-center gap-1.5 font-medium">
                    <Mail size={12} className="text-orange-500" /> DISPATCH EMAIL
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-orange-50/50 border border-orange-200 text-stone-900 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all"
                    placeholder="john@fleet.com"
                    required
                  />
                  {errors.email && <span className="text-red-500 text-[11px] mt-1 block">{errors.email}</span>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-600 mb-1 flex items-center gap-1.5 font-medium">
                    <Phone size={12} className="text-orange-500" /> CONTACT NUMBER
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-orange-50/50 border border-orange-200 text-stone-900 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all"
                    placeholder="+1 (555) 019-2834"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-600 mb-1 flex items-center gap-1.5 font-medium">
                    <Lock size={12} className="text-orange-500" /> PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-orange-50/50 border border-orange-200 text-stone-900 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none pr-10 transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.password && <span className="text-red-500 text-[11px] mt-1 block">{errors.password}</span>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-600 mb-1 font-medium">CONFIRM PASSWORD</label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-orange-50/50 border border-orange-200 text-stone-900 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                  {errors.confirmPassword && <span className="text-red-500 text-[11px] mt-1 block">{errors.confirmPassword}</span>}
                </div>

                {/* Password Criteria Checklist */}
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-200/60 space-y-1.5 text-[11px] font-mono text-stone-500">
                  <div className={`flex items-center gap-2 ${criteria.minChar ? 'text-green-600 font-semibold' : ''}`}>
                    <CheckCircle2 size={12} /> At least 8 characters
                  </div>
                  <div className={`flex items-center gap-2 ${criteria.hasUpper && criteria.hasLower ? 'text-green-600 font-semibold' : ''}`}>
                    <CheckCircle2 size={12} /> Uppercase & lowercase letters
                  </div>
                  <div className={`flex items-center gap-2 ${criteria.hasNumber ? 'text-green-600 font-semibold' : ''}`}>
                    <CheckCircle2 size={12} /> At least 1 number
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-display font-bold text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>CREATE DISPATCH ACCOUNT</span>
                </button>
              </form>
            ) : (
              /* Login Form */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-stone-600 mb-1 flex items-center gap-1.5 font-medium">
                    <User size={12} className="text-orange-500" /> USERNAME
                  </label>
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-orange-50/50 border border-orange-200 text-stone-900 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all"
                    placeholder="Enter registered username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-600 mb-1 flex items-center gap-1.5 font-medium">
                    <Lock size={12} className="text-orange-500" /> PASSWORD
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-orange-50/50 border border-orange-200 text-stone-900 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-display font-bold text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw size={14} className="animate-spin" /> : <LogIn size={14} />}
                  <span>AUTHENTICATE & ENTER PORTAL</span>
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default RegistrationForm;
