import { MessageSquare, Construction } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import EmptyState from '../components/ui/EmptyState';

export default function ForumPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading">Discussion Forum</h1>
        <p className="text-sm text-muted mt-0.5">Ask questions and share insights with fellow students</p>
      </div>

      <div className="bg-surface rounded-xl border border-border">
        <EmptyState
          icon={Construction}
          title="Forum — Coming Soon"
          description="We're building a discussion forum where you can ask questions, post answers, and earn reputation. Stay tuned!"
        />
      </div>

      {/* Placeholder cards */}
      <div className="mt-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface rounded-xl border border-border p-5 animate-pulse-soft">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-hover" />
              <div className="flex-1">
                <div className="h-3 bg-hover rounded w-1/3 mb-1.5" />
                <div className="h-2 bg-hover rounded w-1/5" />
              </div>
            </div>
            <div className="h-4 bg-hover rounded w-3/4 mb-2" />
            <div className="h-3 bg-hover rounded w-full mb-1" />
            <div className="h-3 bg-hover rounded w-2/3" />
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
