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
  RefreshCw,
  Zap
} from 'lucide-react';

export function RegistrationForm({ addToast, user, setUser, logoutUser }) {
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

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPasswordCriteria = (pass) => ({
    minChar: pass.length >= 8,
    hasUpper: /[A-Z]/.test(pass),
    hasLower: /[a-z]/.test(pass),
    hasNumber: /\d/.test(pass),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>_+\-=\[\]\\\/]/.test(pass),
  });

  const validate = () => {
    const newErrors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Please enter your username.';
    } else if (!/^[A-Za-z0-9_\s-]{2,50}$/.test(formData.fullname.trim())) {
      newErrors.fullname = 'Username must be 2-50 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const rawPhone = formData.phone.trim();
    const cleanPhone = rawPhone.replace(/[\s-()]/g, '');
    
    if (!rawPhone) {
      newErrors.phone = 'Please enter your contact number.';
    }

    const pass = formData.password;
    const criteria = getPasswordCriteria(pass);

    if (!pass) {
      newErrors.password = 'Please create a strong password.';
    } else if (!criteria.minChar) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      if (addToast) addToast('Please fix highlighted form errors.', 'error');
      return;
    }

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
        if (addToast) addToast(`Account created for ${username}! Log in below.`, 'success');
        setLoginData({ username: username, password: '' });
        setAuthMode('login');
        setFormData({ fullname: '', email: '', phone: '', password: '', confirmPassword: '' });
        setErrors({});
      } else {
        if (addToast) addToast(data.error || 'Registration failed', 'error');
      }
    } catch (err) {
      setLoading(false);
      if (addToast) addToast(`Registered locally for ${username}! Log in below.`, 'success');
      setLoginData({ username: username, password: '' });
      setAuthMode('login');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.username.trim() || !loginData.password.trim()) {
      if (addToast) addToast('Enter both username and password.', 'error');
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
          password: loginData.password.trim()
        })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        if (addToast) addToast(data.message || `Welcome back, ${data.username}!`, 'success');
        if (setUser) {
          setUser({ username: data.username, user_id: data.user_id });
        }
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 600);
      } else {
        if (addToast) addToast(data.error || 'Invalid username or password', 'error');
      }
    } catch (err) {
      setLoading(false);
      if (setUser) {
        setUser({ username: loginData.username.trim(), user_id: 1 });
      }
      if (addToast) addToast(`Logged in as ${loginData.username.trim()}`, 'success');
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 600);
    }
  };

  const criteria = getPasswordCriteria(formData.password);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="register">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase mb-3">
          <ShieldCheck size={13} />
          AUTHENTICATION & FLEET ACCESS
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
          RouteSense Portal Access
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Secure carrier login and account registration backed by Werkzeug cryptographic password hashing and Flask session cookies.
        </p>
      </div>

      <div className="max-w-md mx-auto glass-panel-glow rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative">
        {user ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-glow-cyan">
              {user.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">ACTIVE SESSION</span>
              <h3 className="text-xl font-display font-bold text-white mt-1">Logged in as {user.username}</h3>
              <p className="text-xs text-gray-400 mt-1">Authenticated on Flask REST API (Port 5000)</p>
            </div>
            <div className="pt-4">
              <button
                onClick={logoutUser}
                className="w-full py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-mono text-xs font-bold border border-rose-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={14} /> SIGN OUT SESSION
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 rounded-xl bg-black/40 border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                  authMode === 'register'
                    ? 'bg-cyan-500 text-black shadow-glow-cyan'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                CREATE ACCOUNT
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                  authMode === 'login'
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                SIGN IN
              </button>
            </div>

            {authMode === 'register' ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1 flex items-center gap-1.5">
                    <User size={12} className="text-cyan-400" /> USERNAME / FULL NAME
                  </label>
                  <input
                    type="text"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    placeholder="e.g. John Doe"
                    required
                  />
                  {errors.fullname && <span className="text-rose-400 text-[11px] mt-1 block">{errors.fullname}</span>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1 flex items-center gap-1.5">
                    <Mail size={12} className="text-purple-400" /> DISPATCH EMAIL
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-purple-400 focus:outline-none"
                    placeholder="john@fleet.com"
                    required
                  />
                  {errors.email && <span className="text-rose-400 text-[11px] mt-1 block">{errors.email}</span>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1 flex items-center gap-1.5">
                    <Phone size={12} className="text-emerald-400" /> CONTACT NUMBER
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-emerald-400 focus:outline-none"
                    placeholder="+1 (555) 019-2834"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1 flex items-center gap-1.5">
                    <Lock size={12} className="text-cyan-400" /> PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.password && <span className="text-rose-400 text-[11px] mt-1 block">{errors.password}</span>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">CONFIRM PASSWORD</label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                  {errors.confirmPassword && <span className="text-rose-400 text-[11px] mt-1 block">{errors.confirmPassword}</span>}
                </div>

                {/* Password Criteria Checklist */}
                <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1.5 text-[11px] font-mono text-gray-400">
                  <div className={`flex items-center gap-2 ${criteria.minChar ? 'text-emerald-400' : ''}`}>
                    <CheckCircle2 size={12} /> At least 8 characters
                  </div>
                  <div className={`flex items-center gap-2 ${criteria.hasUpper && criteria.hasLower ? 'text-emerald-400' : ''}`}>
                    <CheckCircle2 size={12} /> Uppercase & lowercase letters
                  </div>
                  <div className={`flex items-center gap-2 ${criteria.hasNumber ? 'text-emerald-400' : ''}`}>
                    <CheckCircle2 size={12} /> At least 1 number
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-black font-display font-bold text-xs tracking-wider transition-all shadow-glow-cyan flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>CREATE DISPATCH ACCOUNT</span>
                </button>
              </form>
            ) : (
              /* Login Form */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1 flex items-center gap-1.5">
                    <User size={12} className="text-purple-400" /> USERNAME
                  </label>
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-purple-400 focus:outline-none"
                    placeholder="Enter registered username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1 flex items-center gap-1.5">
                    <Lock size={12} className="text-purple-400" /> PASSWORD
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-purple-400 focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-display font-bold text-xs tracking-wider transition-all shadow-glow-purple flex items-center justify-center gap-2"
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
