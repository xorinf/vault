/**
 * Format a date string to a readable format.
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date to relative time (e.g., "2 hours ago").
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
export function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  return `${months}mo ago`;
}

/**
 * Format file size in bytes to human readable format.
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format vote score with sign.
 * @param {number} score
 * @returns {string}
 */
export function formatScore(score) {
  if (!score) return '0';
  if (score > 0) return `+${score}`;
  return `${score}`;
}

/**
 * Truncate text to a max length with ellipsis.
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
export function truncate(text, maxLen = 120) {
  if (!text) return '';
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
}

/**
 * Generate initials from a username.
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format pomodoro timer seconds to MM:SS.
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatTimer(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
