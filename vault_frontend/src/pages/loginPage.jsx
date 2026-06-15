import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { validateEmail, validatePassword } from '../utils/validators';
import Spinner from '../components/ui/spinner';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await login(form);
      showToast('Welcome back!', 'success');
      navigate('/resources');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-xl mb-4">
            <BookOpen size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-heading">Welcome back</h1>
          <p className="text-sm text-muted mt-1">Sign in to your Study Vault account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-8 space-y-6">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-heading mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="login-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@college.edu"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-bg placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent/15 outline-none transition-all ${
                  errors.email ? 'border-danger' : 'border-border'
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-heading mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm bg-bg placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent/15 outline-none transition-all ${
                  errors.password ? 'border-danger' : 'border-border'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-heading transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? <Spinner size={18} /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-heading font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
