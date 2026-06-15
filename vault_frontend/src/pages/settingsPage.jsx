import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Lock, Eye, EyeOff, Camera } from 'lucide-react';
import PageWrapper from '../components/layout/pageWrapper';
import Spinner from '../components/ui/spinner';
import Avatar from '../components/ui/avatar';
import { changePassword, updateProfile } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function SettingsPage() {
  const { isAuthenticated, user, dispatch } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ current_pass: '', new_pass: '', confirmNew: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isAuthenticated) { navigate('/login'); return null; }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const data = await updateProfile(formData);
      const updatedUser = data.payload;
      localStorage.setItem('vault_user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      showToast('Profile image updated!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.current_pass) newErrors.current_pass = 'Current password is required';
    if (!form.new_pass || form.new_pass.length < 6) newErrors.new_pass = 'New password must be at least 6 characters';
    if (form.new_pass !== form.confirmNew) newErrors.confirmNew = 'Passwords do not match';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSubmitting(true);
    try {
      await changePassword({ current_pass: form.current_pass, new_pass: form.new_pass });
      showToast('Password changed successfully!', 'success');
      setForm({ current_pass: '', new_pass: '', confirmNew: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper className="max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <Settings size={20} className="text-accent" />
        <h1 className="text-2xl font-bold text-heading">Settings</h1>
      </div>

      {/* Profile Info */}
      <div className="bg-surface rounded-xl border border-border p-6 mb-6">
        <h2 className="text-sm font-semibold text-heading mb-4">Profile</h2>

        {/* Profile Image Upload Widget */}
        <div className="flex flex-col items-center mb-6 pb-6 border-b border-border">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <Avatar src={user?.avatar} name={user?.username} size="xl" className="group-hover:opacity-80 transition-opacity" />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {uploading ? (
                <Spinner size={16} className="text-white" />
              ) : (
                <Camera size={18} className="text-white" />
              )}
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={handleAvatarClick}
            disabled={uploading}
            className="mt-3 text-xs font-semibold text-accent hover:underline bg-transparent border-0 cursor-pointer"
          >
            {uploading ? 'Uploading...' : 'Change Profile Photo'}
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Username</span>
            <span className="text-heading font-medium">{user?.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Email</span>
            <span className="text-heading">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Role</span>
            <span className="text-heading capitalize">{user?.role?.toLowerCase()}</span>
          </div>
          {user?.college && (
            <div className="flex justify-between">
              <span className="text-muted">College</span>
              <span className="text-heading">{user.college}</span>
            </div>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold text-heading mb-4">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'current_pass', label: 'Current Password', placeholder: 'Enter current password' },
            { name: 'new_pass', label: 'New Password', placeholder: 'At least 6 characters' },
            { name: 'confirmNew', label: 'Confirm New Password', placeholder: 'Re-enter new password' },
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={`settings-${field.name}`} className="block text-sm font-medium text-heading mb-1.5">
                {field.label}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id={`settings-${field.name}`}
                  name={field.name}
                  type={showPasswords ? 'text' : 'password'}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm bg-bg placeholder:text-muted focus:ring-2 focus:ring-accent outline-none ${
                    errors[field.name] ? 'border-danger' : 'border-border'
                  }`}
                />
              </div>
              {errors[field.name] && <p className="text-xs text-danger mt-1">{errors[field.name]}</p>}
            </div>
          ))}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-xs text-muted hover:text-heading flex items-center gap-1 bg-transparent border-0 cursor-pointer"
            >
              {showPasswords ? <EyeOff size={12} /> : <Eye size={12} />}
              {showPasswords ? 'Hide' : 'Show'} passwords
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 border-0 cursor-pointer"
          >
            {submitting ? <Spinner size={18} /> : 'Update Password'}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}

