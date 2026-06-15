import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import PageWrapper from '../components/layout/pageWrapper';
import Sidebar from '../components/layout/sidebar';
import ResourceCard from '../components/resources/resourceCard';
import Spinner from '../components/ui/spinner';
import EmptyState from '../components/ui/emptyState';
import Pagination from '../components/ui/pagination';
import { getResources } from '../api/resourcesApi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { SORT_OPTIONS } from '../utils/constants';
import { BookOpen } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ subject: '', fileType: '', sort: 'newest' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const fetchResources = async () => {
      setLoading(true);
      try {
        const data = await getResources();
        setResources(data.payload || []);
      } catch {
        showToast('Failed to load resources', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [isAuthenticated, navigate, showToast]);

  // Apply filters and sorting
  const filteredResources = useMemo(() => {
    let result = [...resources];

    if (filters.subject) {
      result = result.filter((r) => r.subject === filters.subject);
    }
    if (filters.fileType) {
      result = result.filter((r) => r.fileType === filters.fileType);
    }

    switch (filters.sort) {
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'votes':
        result.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
        break;
      case 'views':
        result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      default: // newest
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [resources, filters]);

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return (
    <PageWrapper>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-heading">Resources</h1>
          <p className="text-sm text-muted mt-0.5">
            {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="px-3 py-2 rounded-lg border border-border bg-surface text-sm text-text focus:ring-2 focus:ring-accent outline-none"
            aria-label="Sort resources"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* View mode */}
          <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-accent text-white' : 'bg-surface text-muted hover:bg-hover'}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-accent text-white' : 'bg-surface text-muted hover:bg-hover'}`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg border border-border text-muted hover:bg-hover"
            aria-label="Open filters"
          >
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Unified Split-pane Workspace */}
      <div className="bg-surface rounded-xl border border-border flex flex-col lg:flex-row overflow-hidden min-h-[calc(100vh-14rem)]">
        <Sidebar
          filters={filters}
          onFilterChange={setFilters}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 p-6 sm:p-8 min-w-0">
          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <Spinner size={32} text="Loading resources..." />
            </div>
          ) : paginatedResources.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No resources found"
              description={filters.subject || filters.fileType ? 'Try changing your filters' : 'Be the first to upload a resource!'}
              action="Upload Resource"
              onAction={() => navigate('/upload')}
            />
          ) : (
            <div className="flex flex-col h-full justify-between gap-8">
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {paginatedResources.map((resource) => (
                  <ResourceCard key={resource._id} resource={resource} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
