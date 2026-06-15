/**
 * Empty state placeholder with icon, heading, and CTA.
 */
export default function EmptyState({ icon: Icon, title, description, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-hover flex items-center justify-center mb-4">
          <Icon size={32} className="text-muted" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-heading mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted max-w-sm mb-4">{description}</p>
      )}
      {action && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-heading transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  );
}
