import { Link } from 'react-router-dom';
import { BookOpen, Upload, Search, Users, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-accent text-white px-8 py-16 sm:px-12 sm:py-20 mb-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full" />
          <div className="absolute bottom-10 right-20 w-48 h-48 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 border border-white/20 rounded-full" />
        </div>

        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm mb-6 backdrop-blur-sm">
            <Zap size={14} />
            <span>Collaborative learning platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight">
            Share Knowledge,<br />
            <span className="opacity-80">Excel Together</span>
          </h1>

          <p className="text-lg text-white/70 mb-8 max-w-lg">
            Upload notes, past papers, and study resources. Vote on the best content and help your peers succeed.
          </p>

          <div className="flex flex-wrap gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/resources"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-accent rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
                >
                  Browse Resources
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-lg font-semibold text-sm hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  <Upload size={16} />
                  Upload
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-accent rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
                >
                  Get Started
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-lg font-semibold text-sm hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-heading mb-2">Everything you need to study smarter</h2>
          <p className="text-muted max-w-lg mx-auto">
            A complete toolkit for collaborative learning and resource sharing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                className="group relative bg-surface rounded-xl border border-border p-6 hover:border-accent/30 hover:shadow-card transition-all duration-200"
              >
                {feature.badge && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 bg-warning/10 text-warning text-[10px] font-semibold rounded-md uppercase tracking-wider">
                    {feature.badge}
                  </span>
                )}
                <div className="w-10 h-10 rounded-xl bg-hover flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-semibold text-heading mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      {isAuthenticated && (
        <section className="bg-surface rounded-xl border border-border p-8 mb-12">
          <div className="text-center">
            <p className="text-sm text-muted mb-1">Welcome back,</p>
            <h2 className="text-xl font-bold text-heading">{user?.username}</h2>
            <p className="text-sm text-muted mt-1">{user?.college || 'College student'}</p>
          </div>
        </section>
      )}
    </PageWrapper>
  );
}
