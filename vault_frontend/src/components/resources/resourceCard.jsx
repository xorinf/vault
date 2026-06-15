import { Link } from 'react-router-dom';
import { Eye, ThumbsUp, ThumbsDown, MessageSquare, FileText, Image, StickyNote } from 'lucide-react';
import Badge from '../ui/badge';
import Avatar from '../ui/avatar';
import { formatRelativeTime, truncate, formatScore } from '../../utils/formatters';

const typeIcons = {
  PDF: FileText,
  IMAGE: Image,
  NOTE: StickyNote,
};

/**
 * Resource card component for grid/list display.
 */
export default function ResourceCard({ resource }) {
  const TypeIcon = typeIcons[resource.fileType] || FileText;

  return (
    <Link
      to={`/resource/${resource._id}`}
      className="group block bg-surface rounded-xl border border-border hover:border-neutral-400 transition-colors duration-150"
    >
      {/* Card Header with file type indicator */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Badge fileType={resource.fileType} />
            <span className="text-xs text-muted">{resource.subject}</span>
          </div>
          {resource.semester && (
            <span className="text-xs text-muted px-2 py-0.5 bg-hover rounded-md">
              Sem {resource.semester}
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold text-heading group-hover:text-accent transition-colors line-clamp-2 mb-2">
          {resource.title}
        </h3>

        <p className="text-sm text-muted line-clamp-2 mb-4">
          {truncate(resource.description, 100)}
        </p>

        {/* Tags */}
        {resource.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {resource.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-tag rounded-md text-xs text-muted">
                {tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="text-xs text-muted">+{resource.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar
            src={resource.author?.avatar}
            name={resource.author?.username}
            size="sm"
          />
          <div>
            <p className="text-xs font-medium text-text">
              {resource.author?.username || 'Anonymous'}
            </p>
            <p className="text-[11px] text-muted">{formatRelativeTime(resource.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-muted">
          <span className="flex items-center gap-1 text-xs">
            <Eye size={13} />
            {resource.viewCount || 0}
          </span>
          <span className={`flex items-center gap-1 text-xs font-mono ${
            resource.voteCount >= 10 ? 'bg-accent text-white px-1.5 py-0.5 rounded-md' : ''
          }`}>
            <ThumbsUp size={13} />
            {formatScore(resource.voteCount)}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <MessageSquare size={13} />
            {resource.comments?.length || 0}
          </span>
        </div>
      </div>
    </Link>
  );
}
