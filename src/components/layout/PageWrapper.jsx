/**
 * Page wrapper for consistent layout and spacing.
 */
export default function PageWrapper({ children, className = '' }) {
  return (
    <main className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 ${className}`}>
      {children}
    </main>
  );
}
