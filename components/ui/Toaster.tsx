"use client";

import React from 'react';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

interface ToasterState {
  toasts: ToastProps[];
}

const ToasterContext = React.createContext<{
  state: ToasterState;
  toast: (props: Omit<ToastProps, 'id'>) => void;
  dismiss: (id: string) => void;
} | undefined>(undefined);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ToasterState>({ toasts: [] });

  const toast = React.useCallback((props: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    setState((prev) => ({
      toasts: [...prev.toasts, { id, ...props }]
    }));
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setState((prev) => ({
        toasts: prev.toasts.filter((t) => t.id !== id)
      }));
    }, 5000);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setState((prev) => ({
      toasts: prev.toasts.filter((t) => t.id !== id)
    }));
  }, []);

  return (
    <ToasterContext.Provider value={{ state, toast, dismiss }}>
      {children}
    </ToasterContext.Provider>
  );
}

export const useToaster = () => {
  const context = React.useContext(ToasterContext);
  if (!context) {
    throw new Error("useToaster must be used within a ToasterProvider");
  }
  return context;
};

export function Toaster() {
  const { state, dismiss } = useToaster();

  if (state.toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2 max-w-md">
      {state.toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg shadow-lg p-4 flex items-start gap-3 text-white animate-slide-up ${
            toast.type === 'error' ? 'bg-red-500' : 
            toast.type === 'warning' ? 'bg-yellow-500' : 
            toast.type === 'success' ? 'bg-green-500' : 
            'bg-blue-500'
          }`}
        >
          <div className="flex-1">
            <h3 className="font-medium">{toast.title}</h3>
            {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
          </div>
          <button 
            onClick={() => dismiss(toast.id)}
            className="text-white opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
} 