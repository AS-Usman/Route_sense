import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';

export function ContactForm({ addToast }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      if (addToast) addToast('Please fill out all fields correctly.', 'error');
      return;
    }
    setIsSubmitted(true);
    if (addToast) addToast('Thank you for connecting with RouteSense! Our team will reach out shortly.', 'success');
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="contact">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase mb-3">
          <Mail size={13} />
          ENTERPRISE INTEGRATIONS & SUPPORT
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
          Connect With RouteSense
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Questions about REST API webhooks, fleet telematics integration, or custom corridor risk modeling? Send our engineering team a dispatch.
        </p>
      </div>

      <div className="max-w-lg mx-auto glass-panel-glow rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative">
        {isSubmitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-glow-green">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-xl font-display font-bold text-white">Dispatch Transmitted</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Our enterprise logistics engineers have received your inquiry and will follow up within 2-4 hours.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-4 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-cyan-400"
            >
              SEND ANOTHER MESSAGE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 flex items-center gap-1.5">
                <User size={12} className="text-cyan-400" /> YOUR FULL NAME
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                placeholder="e.g. Captain James Mitchell"
                required
              />
              {errors.name && <span className="text-rose-400 text-[11px] mt-1 block">{errors.name}</span>}
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
                placeholder="fleet.ops@carrier.com"
                required
              />
              {errors.email && <span className="text-rose-400 text-[11px] mt-1 block">{errors.email}</span>}
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 flex items-center gap-1.5">
                <MessageSquare size={12} className="text-emerald-400" /> MESSAGE / INQUIRY DETAILS
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-emerald-400 focus:outline-none"
                placeholder="Describe your freight corridor volume, telematics provider, or integration scope..."
                required
              />
              {errors.message && <span className="text-rose-400 text-[11px] mt-1 block">{errors.message}</span>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-black font-display font-bold text-xs tracking-wider transition-all shadow-glow-cyan flex items-center justify-center gap-2"
            >
              <Send size={14} />
              <span>TRANSMIT DISPATCH INQUIRY</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default ContactForm;
