import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev.slice(-2), { id, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2400);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toasts Stack - Minimal & Compact */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-1.5 max-w-xs w-full pointer-events-none px-3 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-3.5 py-2 rounded-lg border shadow-lg backdrop-blur-md flex items-center justify-between space-x-2.5 transition-all text-xs font-sans ${
              toast.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/40 text-slate-200'
                : toast.type === 'warning'
                ? 'bg-slate-900/95 border-amber-500/40 text-slate-200'
                : toast.type === 'error'
                ? 'bg-slate-900/95 border-red-500/40 text-slate-200'
                : 'bg-slate-900/95 border-cyan-500/40 text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2 min-w-0">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}

              <div className="min-w-0">
                <p className="font-semibold text-white text-xs truncate">{toast.title}</p>
                {toast.message && <p className="text-[11px] text-slate-400 truncate mt-0.5">{toast.message}</p>}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-300 p-0.5 shrink-0"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
