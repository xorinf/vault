import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'border-l-4 border-l-success bg-success/5',
  error: 'border-l-4 border-l-danger bg-danger/5',
  warning: 'border-l-4 border-l-warning bg-warning/5',
  info: 'border-l-4 border-l-accent bg-accent/5',
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
            className={`flex items-start gap-3 px-4 py-3 bg-surface rounded-lg shadow-elevated animate-slide-up ${styles[toast.type] || styles.info}`}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
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
