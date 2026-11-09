import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          const Icon = isSuccess ? CheckCircle2 : isError ? AlertCircle : Info;

          const colorClasses = isSuccess
            ? 'bg-green-50 border-green-300 text-green-800'
            : isError
            ? 'bg-red-50 border-red-300 text-red-800'
            : 'bg-orange-50 border-orange-300 text-orange-800';

          const iconColor = isSuccess
            ? 'text-green-500'
            : isError
            ? 'text-red-500'
            : 'text-orange-500';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm min-w-[280px] max-w-sm ${colorClasses}`}
            >
              <Icon size={18} className={`flex-shrink-0 ${iconColor}`} />
              <span className="flex-1 text-sm font-medium leading-snug">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-0.5 rounded-md opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
