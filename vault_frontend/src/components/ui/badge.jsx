import { FILE_TYPES } from '../../utils/constants';

/**
 * Tag / file-type badge component.
 */
export default function Badge({ children, variant = 'default', fileType, className = '' }) {
  if (fileType) {
    const config = FILE_TYPES[fileType];
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium text-white ${className}`}
        style={{ backgroundColor: config?.color || '#6B7280' }}
      >
        {config?.label || fileType}
      </span>
    );
  }

  const variants = {
    default: 'bg-tag text-text',
    accent: 'bg-accent text-white',
    success: 'bg-success/10 text-success',
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    muted: 'bg-hover text-muted',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
