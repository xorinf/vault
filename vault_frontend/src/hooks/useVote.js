import { useState, useCallback } from 'react';
import { vote as castVote, removeVote } from '../api/resourcesApi';
import { useToast } from './useToast';

/**
 * Hook for vote toggle with optimistic updates.
 * @param {string} resourceId
 * @param {number} initialScore
 * @param {string|null} initialVote - 'UPVOTE' | 'DOWNVOTE' | null
 */
export function useVote(resourceId, initialScore = 0, initialVote = null) {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState(initialVote);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleVote = useCallback(async (type) => {
    if (loading) return;

    const prevScore = score;
    const prevVote = userVote;

    // Optimistic update
    if (userVote === type) {
      // Remove vote
      setUserVote(null);
      setScore(type === 'UPVOTE' ? score - 1 : score + 1);
    } else if (userVote) {
      // Switch vote
      setUserVote(type);
      setScore(type === 'UPVOTE' ? score + 2 : score - 2);
    } else {
      // New vote
      setUserVote(type);
      setScore(type === 'UPVOTE' ? score + 1 : score - 1);
    }

    setLoading(true);
    try {
      if (userVote === type) {
        await removeVote(resourceId);
      } else {
        await castVote(resourceId, type);
      }
    } catch {
      // Rollback
      setScore(prevScore);
      setUserVote(prevVote);
      showToast('Failed to update vote', 'error');
    } finally {
      setLoading(false);
    }
  }, [resourceId, score, userVote, loading, showToast]);

  return { score, userVote, handleVote, loading, setScore, setUserVote };
}
