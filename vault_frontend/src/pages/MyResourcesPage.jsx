import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Edit3, Trash2, RotateCcw, Eye, ThumbsUp, MessageSquare, FileText, Image, StickyNote, Plus } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { getMyResources, deleteResource, restoreResource } from '../api/resources.api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { formatRelativeTime, formatScore } from '../utils/formatters';

export default function MyResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active'); // 'active' | 'deleted'
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getMyResources();
        setResources(data.payload || []);
      } catch {
        showToast('Failed to load your resources', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, navigate, showToast]);

  const handleDelete = async (id) => {
    try {
      await deleteResource(id);
      setResources((prev) =>
        prev.map((r) => (r._id === id ? { ...r, isResourceActive: false } : r))
      );
      showToast('Resource deleted', 'success');
    } catch {
      showToast('Failed to delete resource', 'error');
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreResource(id);
      setResources((prev) =>
        prev.map((r) => (r._id === id ? { ...r, isResourceActive: true } : r))
      );
      showToast('Resource restored', 'success');
    } catch {
      showToast('Failed to restore resource', 'error');
    }
  };

  const filteredResources = resources.filter((r) =>
    filter === 'active' ? r.isResourceActive : !r.isResourceActive
  );

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-heading">My Resources</h1>
          <p className="text-sm text-muted mt-0.5">{resources.length} total resources</p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-heading transition-colors"
        >
          <Plus size={16} />
          Upload New
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-hover rounded-lg p-1 w-fit mb-6">
        {['active', 'deleted'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
              filter === tab ? 'bg-surface text-heading shadow-card' : 'text-muted hover:text-heading'
            }`}
          >
            {tab} ({resources.filter((r) => (tab === 'active' ? r.isResourceActive : !r.isResourceActive)).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20"><Spinner size={32} text="Loading..." /></div>
      ) : filteredResources.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={filter === 'active' ? "No active resources" : "No deleted resources"}
          description={filter === 'active' ? "Upload your first resource to share with peers" : "Deleted resources will appear here"}
          action={filter === 'active' ? "Upload Resource" : undefined}
          onAction={filter === 'active' ? () => navigate('/upload') : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filteredResources.map((resource) => (
            <div
              key={resource._id}
              className={`bg-surface rounded-xl border border-border p-4 flex items-center gap-4 transition-all hover:shadow-card ${
                !resource.isResourceActive ? 'opacity-60' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge fileType={resource.fileType} />
                  <span className="text-xs text-muted">{resource.subject}</span>
                </div>
                <Link
                  to={`/resource/${resource._id}`}
                  className="text-sm font-semibold text-heading hover:text-accent transition-colors line-clamp-1"
                >
                  {resource.title}
                </Link>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                  <span className="flex items-center gap-1"><Eye size={12} />{resource.viewCount}</span>
                  <span className="flex items-center gap-1"><ThumbsUp size={12} />{formatScore(resource.voteCount)}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={12} />{resource.comments?.length || 0}</span>
                  <span>{formatRelativeTime(resource.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {resource.isResourceActive ? (
                  <>
                    <Link
                      to={`/resource/${resource._id}`}
                      className="p-2 rounded-lg text-muted hover:text-heading hover:bg-hover transition-colors"
                      aria-label="View resource"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(resource._id)}
                      className="p-2 rounded-lg text-muted hover:text-danger hover:bg-danger/5 transition-colors"
                      aria-label="Delete resource"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleRestore(resource._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-success hover:bg-success/5 rounded-lg transition-colors"
                    aria-label="Restore resource"
                  >
                    <RotateCcw size={14} />
                    Restore
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
