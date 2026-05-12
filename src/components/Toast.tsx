import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Info, X, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'notification';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
  key?: string;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  notification: Bell,
};

const styles = {
  success: {
    border: 'border-emerald-100',
    icon: 'text-emerald-500 bg-emerald-50',
    title: 'text-emerald-800',
    bar: 'bg-emerald-500',
  },
  error: {
    border: 'border-red-100',
    icon: 'text-red-500 bg-red-50',
    title: 'text-red-800',
    bar: 'bg-red-500',
  },
  info: {
    border: 'border-blue-100',
    icon: 'text-blue-500 bg-blue-50',
    title: 'text-blue-800',
    bar: 'bg-blue-500',
  },
  notification: {
    border: 'border-amber-100',
    icon: 'text-amber-500 bg-amber-50',
    title: 'text-amber-800',
    bar: 'bg-amber-500',
  },
};

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration ?? 4000;
  const Icon = icons[toast.type];
  const style = styles[toast.type];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => Math.max(0, p - (100 / (duration / 100))));
    }, 100);
    const timer = setTimeout(() => onRemove(toast.id), duration);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [toast.id, duration, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'relative bg-white rounded-2xl border shadow-xl shadow-black/5 overflow-hidden w-80 pointer-events-auto',
        style.border
      )}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gray-100 w-full">
        <div
          className={cn('h-full transition-all ease-linear', style.bar)}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-4 flex items-start gap-3">
        <div className={cn('p-2 rounded-xl shrink-0', style.icon)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('font-black text-xs uppercase tracking-wide', style.title)}>
            {toast.title}
          </p>
          {toast.message && (
            <p className="text-[10px] text-gray-500 mt-0.5 font-medium leading-relaxed">
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="shrink-0 p-1 text-gray-300 hover:text-gray-500 transition-colors rounded-lg hover:bg-gray-50"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}
