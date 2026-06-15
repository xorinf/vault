import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Search, ToggleLeft, ToggleRight, Eye } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';
import { getAllResources, toggleResourceStatus } from '../api/resources.api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { formatDate, formatRelativeTime } from '../utils/formatters';

export default function AdminResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const { isAdmin, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) { navigate('/'); return; }
    const fetchResources = async () => {
      setLoading(true);
      try {
        const data = await getAllResources();
        setResources(data.payload || []);
      } catch {
        showToast('Failed to load resources', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [isAdmin, isAuthenticated, navigate, showToast]);

  const handleToggle = async (id) => {
    try {
      const data = await toggleResourceStatus(id);
      setResources((prev) =>
        prev.map((r) => (r._id === id ? { ...r, isResourceActive: data.payload.isResourceActive } : r))
      );
      showToast('Resource status updated', 'success');
    } catch {
      showToast('Failed to update resource status', 'error');
    }
  };

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.subject?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' || (filter === 'active' ? r.isResourceActive : !r.isResourceActive);
    return matchesSearch && matchesFilter;
  });

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={18} className="text-accent" />
            <h1 className="text-2xl font-bold text-heading">Manage Resources</h1>
          </div>
          <p className="text-sm text-muted">{resources.length} total resources</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-surface text-sm placeholder:text-muted focus:ring-2 focus:ring-accent outline-none"
          />
        </div>
        <div className="flex gap-1 bg-hover rounded-lg p-1">
          {['all', 'active', 'inactive'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                filter === f ? 'bg-surface text-heading shadow-card' : 'text-muted hover:text-heading'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20"><Spinner size={32} text="Loading..." /></div>
      ) : (
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <div
              key={resource._id}
              className={`bg-surface rounded-xl border border-border p-4 flex items-center gap-4 transition-all ${
                !resource.isResourceActive ? 'opacity-60' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge fileType={resource.fileType} />
                  <span className="text-xs text-muted">{resource.subject}</span>
                  <Badge variant={resource.isResourceActive ? 'success' : 'danger'}>
                    {resource.isResourceActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <Link
                  to={`/resource/${resource._id}`}
                  className="text-sm font-semibold text-heading hover:text-accent transition-colors line-clamp-1"
                >
                  {resource.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  {resource.author && (
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <Avatar src={resource.author.avatar} name={resource.author.username} size="sm" className="w-4 h-4 text-[8px]" />
                      {resource.author.username}
                    </div>
                  )}
                  <span className="text-xs text-muted">· {formatRelativeTime(resource.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/resource/${resource._id}`}
                  className="p-2 rounded-lg text-muted hover:text-heading hover:bg-hover transition-colors"
                  aria-label="View resource"
                >
                  <Eye size={16} />
                </Link>
                <button
                  onClick={() => handleToggle(resource._id)}
                  className={`p-2 rounded-lg transition-colors ${
                    resource.isResourceActive
                      ? 'text-success hover:bg-success/5'
                      : 'text-muted hover:bg-hover'
                  }`}
                  aria-label={resource.isResourceActive ? 'Deactivate' : 'Activate'}
                >
                  {resource.isResourceActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
