import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { validateEmail, validatePassword, validateUsername } from '../utils/validators';
import Spinner from '../components/ui/spinner';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '', college: '', role: 'STUDENT',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const usernameErr = validateUsername(form.username);
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);
    if (usernameErr) newErrors.username = usernameErr;
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('username', form.username);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('role', 'STUDENT');
      formData.append('college', form.college);

      await register(formData);
      showToast('Account created! Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-xl mb-4">
            <BookOpen size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-heading">Create your account</h1>
          <p className="text-sm text-muted mt-1">Join Study Vault and start sharing resources</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-8 space-y-6">
          <div>
            <label htmlFor="reg-username" className="block text-sm font-medium text-heading mb-1.5">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="reg-username" name="username" type="text" value={form.username} onChange={handleChange}
                placeholder="johndoe"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-bg placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent/15 outline-none ${errors.username ? 'border-danger' : 'border-border'}`}
              />
            </div>
            {errors.username && <p className="text-xs text-danger mt-1">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-heading mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="reg-email" name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="you@college.edu"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-bg placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent/15 outline-none ${errors.email ? 'border-danger' : 'border-border'}`}
              />
            </div>
            {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="reg-college" className="block text-sm font-medium text-heading mb-1.5">College</label>
            <div className="relative">
              <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="reg-college" name="college" type="text" value={form.college} onChange={handleChange}
                placeholder="Your college name"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm bg-bg placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent/15 outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-heading mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="reg-password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange}
                placeholder="At least 6 characters"
                className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm bg-bg placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent/15 outline-none ${errors.password ? 'border-danger' : 'border-border'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading" aria-label="Toggle password">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="reg-confirm" className="block text-sm font-medium text-heading mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="reg-confirm" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange}
                placeholder="Re-enter password"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-bg placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent/15 outline-none ${errors.confirmPassword ? 'border-danger' : 'border-border'}`}
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-danger mt-1">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={submitting}
            className="w-full py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-heading transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? <Spinner size={18} /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-heading font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
