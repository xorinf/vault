import { Bookmark, Construction } from 'lucide-react';
import PageWrapper from '../components/layout/pageWrapper';
import EmptyState from '../components/ui/emptyState';

export default function BookmarksPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading">Bookmarks</h1>
        <p className="text-sm text-muted mt-0.5">Your saved resources for quick access</p>
      </div>

      <div className="bg-surface rounded-xl border border-border">
        <EmptyState
          icon={Construction}
          title="Bookmarks — Coming Soon"
          description="Save your favorite resources and access them anytime. This feature will be available soon!"
        />
      </div>
    </PageWrapper>
  );
}
