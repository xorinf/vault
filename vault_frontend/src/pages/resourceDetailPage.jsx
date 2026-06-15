import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Eye, Calendar, Tag, FileText, Image as ImageIcon,
  StickyNote, ExternalLink, Download, MessageSquare, Send
} from 'lucide-react';
import PageWrapper from '../components/layout/pageWrapper';
import VoteWidget from '../components/resources/voteWidget';
import Badge from '../components/ui/badge';
import Avatar from '../components/ui/avatar';
import Spinner from '../components/ui/spinner';
import { getResource, addComment } from '../api/resourcesApi';
import { useAuth } from '../hooks/useAuth';
import { useVote } from '../hooks/useVote';
import { useToast } from '../hooks/useToast';
import { formatDate, formatRelativeTime } from '../utils/formatters';

export default function ResourceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const { score, userVote, handleVote, setScore } = useVote(id, 0, null);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const fetchResource = async () => {
      setLoading(true);
      try {
        const data = await getResource(id);
        setResource(data.payload);
        setScore(data.payload?.voteCount || 0);
      } catch {
        showToast('Failed to load resource', 'error');
        navigate('/resources');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id, isAuthenticated, navigate, showToast, setScore]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setCommenting(true);
    try {
      const data = await addComment(id, comment.trim());
      setResource(data.payload);
      setComment('');
      showToast('Comment added!', 'success');
    } catch {
      showToast('Failed to add comment', 'error');
    } finally {
      setCommenting(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="py-20"><Spinner size={32} text="Loading resource..." /></div>
      </PageWrapper>
    );
  }

  if (!resource) return null;

  const isImage = resource.fileType === 'IMAGE';
  const isPDF = resource.fileType === 'PDF';
  const isNote = resource.fileType === 'NOTE';

  return (
    <PageWrapper>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-heading mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resource header */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-start gap-4">
              <VoteWidget
                score={score}
                userVote={userVote}
                onVote={handleVote}
                vertical
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge fileType={resource.fileType} />
                  <span className="text-xs text-muted">{resource.subject}</span>
                  {resource.semester && (
                    <span className="text-xs text-muted">· Semester {resource.semester}</span>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-heading mb-2">{resource.title}</h1>

                <p className="text-sm text-text leading-relaxed mb-4">{resource.description}</p>

                {/* Tags */}
                {resource.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {resource.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-tag rounded-md text-xs text-muted">
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Eye size={13} />
                    {resource.viewCount} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {formatDate(resource.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={13} />
                    {resource.comments?.length || 0} comments
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* File preview / content */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-3 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-heading">Preview</h2>
              {resource.fileUrl && (
                <a
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted hover:text-heading transition-colors"
                >
                  <ExternalLink size={13} />
                  Open original
                </a>
              )}
            </div>
            <div className="p-6">
              {isImage && resource.fileUrl && (
                <img
                  src={resource.fileUrl}
                  alt={resource.title}
                  className="max-w-full rounded-lg border border-border"
                />
              )}
              {isPDF && resource.fileUrl && (
                <div className="flex flex-col items-center py-8">
                  <FileText size={48} className="text-muted mb-3" />
                  <p className="text-sm text-muted mb-4">PDF Document</p>
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-heading transition-colors"
                  >
                    <Download size={16} />
                    View PDF
                  </a>
                </div>
              )}
              {isNote && (
                <div className="prose prose-sm max-w-none">
                  <div className="bg-hover rounded-lg p-4 whitespace-pre-wrap text-sm text-text leading-relaxed">
                    {resource.content || resource.description}
                  </div>
                </div>
              )}
              {!resource.fileUrl && !isNote && (
                <div className="text-center py-8 text-sm text-muted">
                  No preview available
                </div>
              )}
            </div>
          </div>

          {/* Comments section */}
          <div className="bg-surface rounded-xl border border-border">
            <div className="px-6 py-3 border-b border-border">
              <h2 className="text-sm font-semibold text-heading">
                Comments ({resource.comments?.length || 0})
              </h2>
            </div>

            {/* Comment form */}
            <form onSubmit={handleComment} className="px-6 py-4 border-b border-border">
              <div className="flex gap-3">
                <Avatar src={user?.avatar} name={user?.username} size="sm" />
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm placeholder:text-muted focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  />
                  <button
                    type="submit"
                    disabled={commenting || !comment.trim()}
                    className="px-3 py-2 bg-accent text-white rounded-lg hover:bg-heading transition-colors disabled:opacity-50"
                    aria-label="Submit comment"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </form>

            {/* Comments list */}
            <div className="divide-y divide-border">
              {resource.comments?.length === 0 && (
                <div className="px-6 py-8 text-center text-sm text-muted">
                  No comments yet. Be the first to comment!
                </div>
              )}
              {resource.comments?.map((c, i) => (
                <div key={c._id || i} className="px-6 py-4 flex gap-3">
                  <Avatar src={c.user?.avatar} name={c.user?.username} size="sm" />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-heading">{c.user?.username || 'User'}</span>
                    </div>
                    <p className="text-sm text-text">{c.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Author info */}
        <div className="space-y-4">
          <div className="bg-surface rounded-xl border border-border p-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Uploaded by</h3>
            <div className="flex items-center gap-3">
              <Avatar src={resource.author?.avatar} name={resource.author?.username} size="lg" />
              <div>
                <p className="text-sm font-semibold text-heading">{resource.author?.username}</p>
                <p className="text-xs text-muted">{resource.author?.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border p-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subject</span>
                <span className="text-heading font-medium">{resource.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Type</span>
                <Badge fileType={resource.fileType} />
              </div>
              {resource.semester && (
                <div className="flex justify-between">
                  <span className="text-muted">Semester</span>
                  <span className="text-heading">{resource.semester}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">Views</span>
                <span className="text-heading">{resource.viewCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Posted</span>
                <span className="text-heading">{formatDate(resource.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
