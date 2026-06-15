import { SUBJECTS, FILE_TYPES } from '../../utils/constants';
import { X, Filter, SlidersHorizontal } from 'lucide-react';

/**
 * Sidebar with filters for subject, file type.
 */
export default function Sidebar({ filters, onFilterChange, isOpen, onClose }) {
  const handleSubjectChange = (subject) => {
    onFilterChange({
      ...filters,
      subject: filters.subject === subject ? '' : subject,
    });
  };

  const handleTypeChange = (type) => {
    onFilterChange({
      ...filters,
      fileType: filters.fileType === type ? '' : type,
    });
  };

  const clearFilters = () => {
    onFilterChange({ subject: '', fileType: '', sort: 'newest' });
  };

  const hasFilters = filters.subject || filters.fileType;

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-heading font-semibold text-sm">
          <SlidersHorizontal size={16} />
          Filters
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-muted hover:text-heading transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Subject Filter */}
      <div>
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Subject</h3>
        <div className="space-y-0.5">
          {SUBJECTS.map((subject) => (
            <button
              key={subject}
              onClick={() => handleSubjectChange(subject)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filters.subject === subject
                  ? 'bg-accent text-white font-medium'
                  : 'text-text hover:bg-hover'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* File Type Filter */}
      <div>
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Type</h3>
        <div className="space-y-0.5">
          {Object.entries(FILE_TYPES).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleTypeChange(key)}
              className={`w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filters.fileType === key
                  ? 'bg-accent text-white font-medium'
                  : 'text-text hover:bg-hover'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: filters.fileType === key ? 'white' : config.color }}
              />
              {config.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 shrink-0">
        <div className="sticky top-20 bg-surface rounded-xl border border-border p-4">
          {content}
        </div>
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <div className="relative w-72 bg-surface h-full shadow-modal animate-slide-in-right ml-auto p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-heading">Filters</span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-hover"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
