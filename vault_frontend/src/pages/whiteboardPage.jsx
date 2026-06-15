import { Pencil, Construction } from 'lucide-react';
import PageWrapper from '../components/layout/pageWrapper';
import EmptyState from '../components/ui/emptyState';

export default function WhiteboardPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading">Collaborative Whiteboard</h1>
        <p className="text-sm text-muted mt-0.5">Draw, sketch, and collaborate in real-time</p>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <EmptyState
          icon={Construction}
          title="Whiteboard — Coming Soon"
          description="Real-time collaborative whiteboard with pen, eraser, and text tools. Draw together and learn visually!"
        />

        {/* Placeholder canvas */}
        <div className="mx-6 mb-6 h-64 bg-hover/50 rounded-xl border-2 border-dashed border-border flex items-center justify-center">
          <div className="text-center text-muted">
            <Pencil size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm opacity-50">Canvas will appear here</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
