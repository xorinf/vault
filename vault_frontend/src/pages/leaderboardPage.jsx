import { Trophy, Construction } from 'lucide-react';
import PageWrapper from '../components/layout/pageWrapper';
import EmptyState from '../components/ui/emptyState';

export default function LeaderboardPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading">Leaderboard</h1>
        <p className="text-sm text-muted mt-0.5">Top contributors in the community</p>
      </div>

      <div className="bg-surface rounded-xl border border-border">
        <EmptyState
          icon={Construction}
          title="Leaderboard — Coming Soon"
          description="See the top contributors ranked by reputation. Earn points by uploading resources and helping peers!"
        />
      </div>

      {/* Placeholder podium */}
      <div className="mt-6 flex items-end justify-center gap-4 py-8">
        {[
          { rank: 2, h: 'h-24', name: 'Student B' },
          { rank: 1, h: 'h-32', name: 'Student A' },
          { rank: 3, h: 'h-20', name: 'Student C' },
        ].map((p) => (
          <div key={p.rank} className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-hover border-2 border-border flex items-center justify-center mb-2">
              <span className="text-xs font-bold text-muted">#{p.rank}</span>
            </div>
            <div className={`w-20 ${p.h} bg-hover/50 rounded-t-xl border border-border flex items-center justify-center`}>
              <span className="text-xs text-muted">{p.name}</span>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
