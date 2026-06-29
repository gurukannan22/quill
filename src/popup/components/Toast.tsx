import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X, RotateCcw } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  onUndo?: () => void;
}

interface Props {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: Props) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onDismiss(toast.id), 300); // Wait for exit animation
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const Icon = toast.type === 'success' ? CheckCircle2 
             : toast.type === 'error' ? AlertCircle 
             : CheckCircle2;

  const bgClass = toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800';

  const iconClass = toast.type === 'success' ? 'text-emerald-500'
                  : toast.type === 'error' ? 'text-red-500'
                  : 'text-blue-500';

  return (
    <div className={`
      flex items-center justify-between p-3 mb-2 rounded-lg border text-sm shadow-sm
      ${bgClass}
      ${isLeaving ? 'opacity-0 transition-opacity duration-300' : 'animate-slideDown'}
    `}>
      <div className="flex items-center gap-2">
        <Icon size={18} className={iconClass} />
        <div>
          <p className="font-medium">{toast.title}</p>
          {toast.message && <p className="text-xs opacity-80 mt-0.5">{toast.message}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {toast.onUndo && (
          <button 
            onClick={() => {
              toast.onUndo?.();
              setIsLeaving(true);
              setTimeout(() => onDismiss(toast.id), 300);
            }}
            className="flex items-center gap-1 text-xs font-medium bg-white/50 px-2 py-1 rounded hover:bg-white/80 transition-colors"
          >
            <RotateCcw size={12} />
            Undo
          </button>
        )}
        <button 
          onClick={() => {
            setIsLeaving(true);
            setTimeout(() => onDismiss(toast.id), 300);
          }}
          className="opacity-50 hover:opacity-100 p-1"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
