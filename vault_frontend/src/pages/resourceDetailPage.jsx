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
import { getResource, addComment, editComment, deleteComment } from '../api/resourcesApi';
import { useAuth } from '../hooks/useAuth';
import { useVote } from '../hooks/useVote';
import { useToast } from '../hooks/useToast';
import { formatDate } from '../utils/formatters';

export default function ResourceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
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

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const data = await deleteComment(resource._id, commentId);
      setResource(data.payload);
      showToast('Comment deleted!', 'success');
    } catch {
      showToast('Failed to delete comment', 'error');
    }
  };

  const handleEditClick = (commentId, text) => {
    setEditingCommentId(commentId);
    setEditText(text);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const data = await editComment(resource._id, commentId, editText.trim());
      setResource(data.payload);
      setEditingCommentId(null);
      setEditText('');
      showToast('Comment updated!', 'success');
    } catch {
      showToast('Failed to update comment', 'error');
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
        className="flex items-center gap-1.5 text-sm text-muted hover:text-heading mb-6 transition-colors bg-transparent border-0 cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resource header */}
          <div className="bg-surface rounded-xl border border-border p-8">
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
            <div className="px-8 py-5 border-b border-border flex items-center justify-between">
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
            <div className="p-8">
              {isImage && resource.fileUrl && (
                <img
                  src={resource.fileUrl}
                  alt={resource.title}
                  className="max-w-full rounded-lg border border-border"
                />
              )}
              {isPDF && resource.fileUrl && (
                <div className="w-full h-[600px] border border-border rounded-lg overflow-hidden bg-neutral-100">
                  <iframe
                    src={resource.fileUrl}
                    title={resource.title}
                    className="w-full h-full border-0"
                  />
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
            <div className="px-8 py-5 border-b border-border">
              <h2 className="text-sm font-semibold text-heading">
                Comments ({resource.comments?.length || 0})
              </h2>
            </div>

            {/* Comment form */}
            <form onSubmit={handleComment} className="px-8 py-6 border-b border-border">
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
                    className="px-3 py-2 bg-accent text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 border-0 cursor-pointer"
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
              {resource.comments?.map((c, i) => {
                const commentUser = c.user;
                const isCommentOwner = commentUser && (commentUser._id === user?.id || commentUser === user?.id);
                const isEditing = editingCommentId === c._id;

                return (
                  <div key={c._id || i} className="px-8 py-5 flex gap-4 items-start">
                    <Avatar src={commentUser?.avatar} name={commentUser?.username} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-medium text-heading">{commentUser?.username || 'User'}</span>
                        {isCommentOwner && !isEditing && (
                          <div className="flex items-center gap-2 text-xs">
                            <button
                              onClick={() => handleEditClick(c._id, c.comment)}
                              className="text-muted hover:text-accent bg-transparent border-0 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(c._id)}
                              className="text-muted hover:text-danger bg-transparent border-0 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      {isEditing ? (
                        <div className="mt-2 flex gap-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-bg text-sm outline-none focus:ring-2 focus:ring-accent"
                          />
                          <button
                            onClick={() => handleSaveEdit(c._id)}
                            className="px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-neutral-800 border-0 cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="px-3 py-1.5 border border-border text-heading bg-surface rounded-lg text-xs font-medium hover:bg-hover border-0 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-text whitespace-pre-wrap">{c.comment}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar - Author info */}
        <div className="space-y-6">
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Uploaded by</h3>
            <div className="flex items-center gap-3">
              <Avatar src={resource.author?.avatar} name={resource.author?.username} size="lg" />
              <div>
                <p className="text-sm font-semibold text-heading">{resource.author?.username}</p>
                <p className="text-xs text-muted">{resource.author?.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Details</h3>
            <div className="space-y-4 text-sm">
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

