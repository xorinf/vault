import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { formatScore } from '../../utils/formatters';

/**
 * Vote widget with upvote/downvote buttons and score display.
 */
export default function VoteWidget({ score, userVote, onVote, loading, vertical = false }) {
  return (
    <div className={`flex items-center gap-1 ${vertical ? 'flex-col' : ''}`}>
      <button
        onClick={() => onVote('UPVOTE')}
        disabled={loading}
        className={`p-2 rounded-lg transition-all ${
          userVote === 'UPVOTE'
            ? 'bg-accent text-white'
            : 'text-muted hover:text-heading hover:bg-hover'
        } disabled:opacity-50`}
        aria-label="Upvote"
      >
        <ThumbsUp size={18} />
      </button>

      <span
        className={`text-sm font-semibold font-mono min-w-[2rem] text-center ${
          score >= 10
            ? 'bg-accent text-white px-2 py-0.5 rounded-md'
            : score > 0
            ? 'text-heading'
            : score < 0
            ? 'text-danger'
            : 'text-muted'
        }`}
      >
        {formatScore(score)}
      </span>

      <button
        onClick={() => onVote('DOWNVOTE')}
        disabled={loading}
        className={`p-2 rounded-lg transition-all ${
          userVote === 'DOWNVOTE'
            ? 'bg-danger text-white'
            : 'text-muted hover:text-heading hover:bg-hover'
        } disabled:opacity-50`}
        aria-label="Downvote"
      >
        <ThumbsDown size={18} />
      </button>
    </div>
  );
}
