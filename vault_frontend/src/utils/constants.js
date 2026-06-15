/** File type display configs */
export const FILE_TYPES = {
  PDF: { label: 'PDF', color: '#111827', icon: 'FileText' },
  IMAGE: { label: 'Image', color: '#4B5563', icon: 'Image' },
  NOTE: { label: 'Note', color: '#8E8E93', icon: 'StickyNote' },
};

/** Sort options for resource lists */
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'votes', label: 'Most Voted' },
  { value: 'views', label: 'Most Viewed' },
];

/** User roles */
export const ROLES = {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
};

/** Subjects list */
export const SUBJECTS = [
  'Mathematics',
  'Data Structures',
  'Operating Systems',
  'DBMS',
  'Computer Networks',
  'Software Engineering',
  'Web Development',
  'Machine Learning',
  'Artificial Intelligence',
  'Computer Architecture',
  'Discrete Mathematics',
  'Theory of Computation',
  'Compiler Design',
  'Digital Logic',
  'Other',
];

/** Semesters */
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

/** Pomodoro defaults */
export const POMODORO = {
  WORK: 25 * 60,
  SHORT_BREAK: 5 * 60,
  LONG_BREAK: 15 * 60,
};
