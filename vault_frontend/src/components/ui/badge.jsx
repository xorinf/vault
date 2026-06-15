import { FILE_TYPES } from '../../utils/constants';

/**
 * Tag / file-type badge component.
 */
export default function Badge({ children, variant = 'default', fileType, className = '' }) {
  if (fileType) {
    const config = FILE_TYPES[fileType];
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border border-neutral-200/50 text-[10px] font-semibold text-white ${className}`}
        style={{ backgroundColor: config?.color || '#6B7280' }}
      >
        {config?.label || fileType}
      </span>
    );
  }

  const variants = {
    default: 'bg-neutral-50 text-neutral-800 border border-neutral-200/60',
    accent: 'bg-neutral-900 text-white border border-transparent',
    success: 'bg-emerald-50/60 text-emerald-800 border border-emerald-200/40',
    danger: 'bg-rose-50/60 text-rose-800 border border-rose-200/40',
    warning: 'bg-amber-50/60 text-amber-800 border border-amber-200/40',
    muted: 'bg-neutral-100/60 text-neutral-600 border border-neutral-200/30',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
