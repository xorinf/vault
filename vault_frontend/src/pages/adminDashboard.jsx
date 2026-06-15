import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Users, BookOpen, BarChart3, ArrowRight } from 'lucide-react';
import PageWrapper from '../components/layout/pageWrapper';
import Spinner from '../components/ui/spinner';
import { useAuth } from '../hooks/useAuth';
import { getAllResources, getUsers } from '../api/resourcesApi';

export default function AdminDashboard() {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, resources: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) { navigate('/'); return; }
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [resourcesData, usersData] = await Promise.all([getAllResources(), getUsers()]);
        const resources = resourcesData.payload || [];
        const users = usersData.payload || [];
        setStats({
          users: users.length,
          resources: resources.length,
          active: resources.filter((r) => r.isResourceActive).length,
          inactive: resources.filter((r) => !r.isResourceActive).length,
        });
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchStats();
  }, [isAdmin, isAuthenticated, navigate]);

  if (loading) return <PageWrapper><div className="py-20"><Spinner size={32} text="Loading..." /></div></PageWrapper>;

  const cards = [
    { icon: Users, label: 'Total Users', value: stats.users, to: '/admin/users', color: 'bg-accent' },
    { icon: BookOpen, label: 'Total Resources', value: stats.resources, to: '/admin/resources', color: 'bg-accent' },
    { icon: BarChart3, label: 'Active Resources', value: stats.active, to: '/admin/resources', color: 'bg-success' },
    { icon: Shield, label: 'Inactive Resources', value: stats.inactive, to: '/admin/resources', color: 'bg-danger' },
  ];

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={20} className="text-accent" />
          <h1 className="text-2xl font-bold text-heading">Admin Dashboard</h1>
        </div>
        <p className="text-sm text-muted">Manage users and resources</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.to}
              className="group bg-surface rounded-xl border border-border p-5 hover:shadow-card hover:border-accent/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
                <ArrowRight size={16} className="text-muted group-hover:text-heading transition-colors" />
              </div>
              <p className="text-2xl font-bold text-heading font-mono">{card.value}</p>
              <p className="text-xs text-muted mt-0.5">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          to="/admin/users"
          className="bg-surface rounded-xl border border-border p-6 hover:shadow-card hover:border-accent/30 transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
            <Users size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-heading">Manage Users</h3>
            <p className="text-sm text-muted">Block/unblock users, view profiles</p>
          </div>
        </Link>

        <Link
          to="/admin/resources"
          className="bg-surface rounded-xl border border-border p-6 hover:shadow-card hover:border-accent/30 transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
            <BookOpen size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-heading">Manage Resources</h3>
            <p className="text-sm text-muted">Review, approve, or remove resources</p>
          </div>
        </Link>
      </div>
    </PageWrapper>
  );
}
