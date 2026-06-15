import { Loader2 } from 'lucide-react';

/**
 * Loading spinner component.
 */
export default function Spinner({ size = 24, className = '', text = '' }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 size={size} className="animate-spin text-muted" />
      {text && <span className="text-sm text-muted">{text}</span>}
    </div>
  );
}
