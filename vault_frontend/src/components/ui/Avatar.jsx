import { getInitials } from '../../utils/formatters';

/**
 * User avatar with initials fallback.
 */
export default function Avatar({ src, name, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-border ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-accent text-white flex items-center justify-center font-semibold ring-2 ring-border ${className}`}
      aria-label={name || 'User avatar'}
    >
      {getInitials(name)}
    </div>
  );
}
