import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, WarningCircle, Info, X } from '@phosphor-icons/react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'success', duration = 3500 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastSuccess = useCallback((title, message) => {
    addToast({ title, message, type: 'success' });
  }, [addToast]);

  const toastError = useCallback((title, message) => {
    addToast({ title, message, type: 'error' });
  }, [addToast]);

  const toastInfo = useCallback((title, message) => {
    addToast({ title, message, type: 'info' });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toastSuccess, toastError, toastInfo }}>
      {children}
      
      {/* Toast floating container */}
      <div 
        aria-live="polite" 
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-[#142B4A] text-white shadow-xl shadow-black/20 border-0 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle size={20} weight="fill" className="text-[#C5A46D]" />}
              {toast.type === 'error' && <WarningCircle size={20} weight="fill" className="text-rose-400" />}
              {toast.type === 'info' && <Info size={20} weight="fill" className="text-sky-400" />}
            </div>
            <div className="flex-1 text-left">
              {toast.title && (
                <p className="text-xs font-bold text-white tracking-tight leading-snug">
                  {toast.title}
                </p>
              )}
              {toast.message && (
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
              className="shrink-0 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={14} weight="bold" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
