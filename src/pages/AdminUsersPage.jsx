import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserCheck, UserX, Search } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { getUsers, toggleUserStatus } from '../api/resources.api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { formatDate } from '../utils/formatters';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { isAdmin, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) { navigate('/'); return; }
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data.payload || []);
      } catch {
        showToast('Failed to load users', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [isAdmin, isAuthenticated, navigate, showToast]);

  const handleToggle = async (userId) => {
    try {
      const data = await toggleUserStatus(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isUserActive: data.payload.isUserActive } : u))
      );
      showToast('User status updated', 'success');
    } catch {
      showToast('Failed to update user status', 'error');
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={18} className="text-accent" />
            <h1 className="text-2xl font-bold text-heading">Manage Users</h1>
          </div>
          <p className="text-sm text-muted">{users.length} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-surface text-sm placeholder:text-muted focus:ring-2 focus:ring-accent outline-none"
        />
      </div>

      {loading ? (
        <div className="py-20"><Spinner size={32} text="Loading users..." /></div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-hover/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">College</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Joined</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-hover/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar src={user.avatar} name={user.username} size="sm" />
                        <span className="font-medium text-heading">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{user.email}</td>
                    <td className="px-4 py-3 text-muted">{user.college || '—'}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.isUserActive ? 'success' : 'danger'}>
                        {user.isUserActive ? 'Active' : 'Blocked'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleToggle(user._id)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          user.isUserActive
                            ? 'text-danger hover:bg-danger/5'
                            : 'text-success hover:bg-success/5'
                        }`}
                      >
                        {user.isUserActive ? <><UserX size={14} /> Block</> : <><UserCheck size={14} /> Unblock</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
