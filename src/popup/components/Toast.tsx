import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X, RotateCcw } from 'lucide-react';

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

const CONFIG = {
  success: {
    icon: CheckCircle2,
    iconClass: 'text-emerald-400',
    barClass: 'bg-emerald-500',
    containerClass: 'bg-quill-dark-700 border-emerald-500/20',
  },
  error: {
    icon: AlertCircle,
    iconClass: 'text-red-400',
    barClass: 'bg-red-500',
    containerClass: 'bg-quill-dark-700 border-red-500/20',
  },
  info: {
    icon: Info,
    iconClass: 'text-blue-400',
    barClass: 'bg-blue-500',
    containerClass: 'bg-quill-dark-700 border-blue-500/20',
  },
};

export function Toast({ toast, onDismiss }: Props) {
  const [isLeaving, setIsLeaving] = useState(false);
  const cfg = CONFIG[toast.type];
  const Icon = cfg.icon;

  const dismiss = () => {
    setIsLeaving(true);
    setTimeout(() => onDismiss(toast.id), 250);
  };

  useEffect(() => {
    const timer = setTimeout(dismiss, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        relative flex items-start gap-3 px-3 py-2.5 rounded-xl border text-sm overflow-hidden shadow-xl
        ${cfg.containerClass}
        ${isLeaving ? 'opacity-0 translate-y-[-4px] transition-all duration-250' : 'animate-slideDown'}
      `}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 inset-y-0 w-0.5 ${cfg.barClass}`} />

      <Icon size={16} className={`${cfg.iconClass} flex-shrink-0 mt-0.5`} />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-100 text-xs leading-tight">{toast.title}</p>
        {toast.message && <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{toast.message}</p>}
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {toast.onUndo && (
          <button
            onClick={() => { toast.onUndo?.(); dismiss(); }}
            className="flex items-center gap-1 text-[11px] font-semibold text-quill-purple-400 hover:text-quill-purple-300 bg-quill-purple-500/10 hover:bg-quill-purple-500/20 px-2 py-1 rounded-lg transition-all"
          >
            <RotateCcw size={11} />
            Undo
          </button>
        )}
        <button
          onClick={dismiss}
          className="p-1 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 transition-all"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
