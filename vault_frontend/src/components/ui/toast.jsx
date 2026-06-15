import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'border-neutral-200 bg-surface text-heading',
  error: 'border-neutral-200 bg-surface text-heading',
  warning: 'border-neutral-200 bg-surface text-heading',
  info: 'border-neutral-200 bg-surface text-heading',
};

const iconColors = {
  success: 'text-emerald-600',
  error: 'text-rose-600',
  warning: 'text-amber-500',
  info: 'text-neutral-500',
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || icons.info;
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 px-4 py-3 bg-surface rounded-xl shadow-modal border ${styles[toast.type] || styles.info} animate-slide-up`}
          >
            <Icon size={18} className={`mt-0.5 shrink-0 ${iconColors[toast.type] || iconColors.info}`} />
            <p className="text-sm text-text flex-1">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-0.5 text-muted hover:text-heading"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
