import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Menu, X, LogOut, Settings, Upload, BookOpen,
  User, Shield, Timer, ChevronDown, LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/avatar';
import SearchPanel from '../search/searchPanel';
import PomodoroTimer from '../timer/pomodoroTimer';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [pomodoroOpen, setPomodoroOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Ctrl+K to open search
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: LayoutDashboard },
    { to: '/resources', label: 'Resources', icon: BookOpen },
  ];

  if (isAdmin) {
    navLinks.push({ to: '/admin', label: 'Admin', icon: Shield });
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-heading tracking-tight hidden sm:block">
                Study Vault
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-hover text-heading'
                        : 'text-muted hover:text-heading hover:bg-hover/55'
                    }`}
                  >
                    <Icon size={15} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
 
            {/* Right section */}
             <div className="flex items-center gap-6">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                 className="flex items-center justify-between w-52 px-4 py-2.5 rounded-lg border border-border bg-hover/40 text-xs text-muted hover:border-neutral-400 hover:text-heading transition-all cursor-pointer"
                aria-label="Search resources"
              >
                <div className="flex items-center gap-2">
                  <Search size={14} />
                  <span>Search...</span>
                </div>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-surface border border-border text-[9px] font-mono font-medium text-muted">
                  ⌘K
                </kbd>
              </button>
 
              {/* Pomodoro */}
              {isAuthenticated && (
                <button
                  onClick={() => setPomodoroOpen(true)}
                  className="p-2 rounded-lg text-muted hover:text-heading hover:bg-hover transition-colors cursor-pointer"
                  aria-label="Pomodoro timer"
                >
                  <Timer size={18} />
                </button>
              )}
 
              {/* Upload */}
              {isAuthenticated && (
                <Link
                  to="/upload"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  <Upload size={14} />
                  Upload
                </Link>
              )}
 
              {/* User menu / Auth */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-hover transition-colors"
                    aria-label="User menu"
                  >
                    <Avatar src={user?.avatar} name={user?.username} size="sm" />
                    <ChevronDown size={14} className={`text-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-modal border border-border py-1 animate-scale-in">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-heading">{user?.username}</p>
                        <p className="text-xs text-muted">{user?.email}</p>
                      </div>
                      <Link
                        to="/my-resources"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-hover transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <BookOpen size={15} />
                        My Resources
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-hover transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings size={15} />
                        Settings
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-hover transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Shield size={15} />
                          Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-border mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-danger hover:bg-hover transition-colors"
                        >
                          <LogOut size={15} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-muted hover:text-heading transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-muted hover:bg-hover"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface animate-slide-up">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-accent text-white' : 'text-text hover:bg-hover'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
              {isAuthenticated && (
                <Link
                  to="/upload"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text hover:bg-hover transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Upload size={18} />
                  Upload Resource
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Search Panel Modal */}
      <SearchPanel isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Pomodoro Timer Modal */}
      <PomodoroTimer isOpen={pomodoroOpen} onClose={() => setPomodoroOpen(false)} />
    </>
  );
}
