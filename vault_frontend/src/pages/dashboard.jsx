import { Link } from 'react-router-dom';
import { BookOpen, Upload, Search, Users, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import PageWrapper from '../components/layout/pageWrapper';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="py-20 sm:py-28 flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 border border-border rounded-full text-xs font-semibold text-text mb-6">
          <Zap size={12} className="text-heading" />
          <span>Collaborative Study Vault</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-heading leading-tight mb-6">
          Share Knowledge.<br />
          <span className="text-muted">Excel Together.</span>
        </h1>

        <p className="text-base sm:text-lg text-muted mb-8 max-w-xl leading-relaxed">
          Access past exams, notes, and resources uploaded by your classmates. Vote for high-quality content and study smarter.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold text-sm hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Browse Resources
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/upload"
                className="inline-flex items-center gap-1.5 px-6 py-3 border border-border text-heading bg-surface rounded-lg font-semibold text-sm hover:bg-hover transition-colors"
              >
                <Upload size={15} />
                Upload Material
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold text-sm hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Get Started
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-6 py-3 border border-border text-heading bg-surface rounded-lg font-semibold text-sm hover:bg-hover transition-colors"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-24 border-t border-border pt-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-heading tracking-tight mb-3">Structured for academic excellence</h2>
          <p className="text-muted max-w-md mx-auto text-sm sm:text-base">
            Everything you need to locate, share, and review educational resources.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: BookOpen,
              title: 'Study Resources',
              description: 'Access notes, past papers, and study materials shared by your peers across all subjects.',
              link: '/resources',
            },
            {
              icon: Upload,
              title: 'Upload & Share',
              description: 'Upload PDFs, images, and notes. Tag them with subjects and semesters for easy discovery.',
              link: '/upload',
            },
            {
              icon: Search,
              title: 'Smart Search',
              description: 'Find exactly what you need with full-text search across titles, descriptions, and tags.',
            },
            {
              icon: Users,
              title: 'Community Voting',
              description: 'Upvote quality resources and help the best content rise to the top.',
              link: '/resources',
            },
            {
              icon: Shield,
              title: 'Quality Control',
              description: 'Admin moderation ensures all shared resources meet quality standards.',
            },
            {
              icon: Globe,
              title: 'Forum & Discussion',
              description: 'Ask questions, share insights, and collaborate with fellow students.',
              link: '/forum',
              badge: 'Coming Soon',
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative bg-surface rounded-xl border border-border p-8 hover:border-neutral-400 transition-colors duration-150"
              >
                {feature.badge && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 bg-neutral-100 text-muted text-[9px] font-semibold border border-border rounded-md uppercase tracking-wider">
                    {feature.badge}
                  </span>
                )}
                <div className="w-12 h-12 rounded-full bg-hover flex items-center justify-center mb-6 text-heading group-hover:bg-accent group-hover:text-white transition-all duration-200">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-semibold text-heading mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats / Welcome Info */}
      {isAuthenticated && (
        <section className="bg-surface rounded-xl border border-border p-8 mb-16 max-w-xl mx-auto text-center">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Authenticated Session</p>
          <h2 className="text-xl font-bold text-heading mb-1">{user?.username}</h2>
          <p className="text-sm text-muted">{user?.college || 'College Student'}</p>
        </section>
      )}
    </PageWrapper>
  );
}
