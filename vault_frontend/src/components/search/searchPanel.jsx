import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, Image, StickyNote, Loader2 } from 'lucide-react';
import { searchResources } from '../../api/resourcesApi';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../hooks/useAuth';
import Badge from '../ui/badge';
import { formatRelativeTime } from '../../utils/formatters';

const typeIcons = { PDF: FileText, IMAGE: Image, NOTE: StickyNote };

/**
 * Global search panel (Ctrl+K).
 */
export default function SearchPanel({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
      setSearched(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedQuery.trim() || !isAuthenticated) {
      setResults([]);
      setSearched(false);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await searchResources(debouncedQuery);
        setResults(data.payload || []);
        setSearched(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery, isAuthenticated]);

  const handleSelect = (id) => {
    navigate(`/resource/${id}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div
        className="relative w-full max-w-xl bg-surface rounded-xl shadow-modal animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={18} className="text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isAuthenticated ? "Search resources…" : "Please login to search"}
            disabled={!isAuthenticated}
            className="flex-1 bg-transparent text-heading placeholder:text-muted outline-none text-sm disabled:opacity-50"
          />
          {loading && <Loader2 size={16} className="animate-spin text-muted" />}
          <button
            onClick={onClose}
            className="p-1 rounded text-muted hover:text-heading"
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {!isAuthenticated && (
            <div className="px-4 py-8 text-center text-sm text-muted">
              Please log in to search resources
            </div>
          )}
          {isAuthenticated && searched && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted">
              No resources found for "{query}"
            </div>
          )}
          {results.map((resource) => {
            const TypeIcon = typeIcons[resource.fileType] || FileText;
            return (
              <button
                key={resource._id}
                onClick={() => handleSelect(resource._id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-hover transition-colors text-left border-b border-border/50 last:border-0"
              >
                <div className="w-9 h-9 rounded-lg bg-hover flex items-center justify-center shrink-0">
                  <TypeIcon size={18} className="text-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-heading truncate">{resource.title}</p>
                  <p className="text-xs text-muted truncate">
                    {resource.subject} · {formatRelativeTime(resource.createdAt)}
                  </p>
                </div>
                <Badge fileType={resource.fileType} />
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-border bg-hover/50">
          <p className="text-[11px] text-muted">
            <kbd className="px-1 py-0.5 bg-surface rounded text-[10px] font-mono">↵</kbd> to select · 
            <kbd className="px-1 py-0.5 bg-surface rounded text-[10px] font-mono ml-1">ESC</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
}
