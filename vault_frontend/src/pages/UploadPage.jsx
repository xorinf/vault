import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Image as ImageIcon, StickyNote, X, Plus } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Spinner from '../components/ui/Spinner';
import { uploadResource } from '../api/resources.api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { SUBJECTS, SEMESTERS } from '../utils/constants';
import { validateResource } from '../utils/validators';

export default function UploadPage() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', content: '', subject: '', semester: '',
    fileType: '', tags: [], file: null,
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  if (!isAuthenticated) { navigate('/login'); return null; }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, file });
      if (file.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag) && form.tags.length < 5) {
      setForm({ ...form, tags: [...form.tags, tag] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateResource(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('subject', form.subject);
      formData.append('fileType', form.fileType);
      formData.append('author', user._id);
      if (form.semester) formData.append('semester', form.semester);
      if (form.content) formData.append('content', form.content);
      if (form.tags.length > 0) formData.append('tags', JSON.stringify(form.tags));
      if (form.file) formData.append('file', form.file);

      await uploadResource(formData);
      showToast('Resource uploaded successfully!', 'success');
      navigate('/my-resources');
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fileTypeOptions = [
    { value: 'PDF', label: 'PDF Document', icon: FileText, desc: 'Upload a PDF file' },
    { value: 'IMAGE', label: 'Image', icon: ImageIcon, desc: 'Upload an image' },
    { value: 'NOTE', label: 'Note', icon: StickyNote, desc: 'Write a text note' },
  ];

  return (
    <PageWrapper className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-heading">Upload Resource</h1>
        <p className="text-sm text-muted mt-1">Share study materials with your peers</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File type selection */}
        <div>
          <label className="block text-sm font-medium text-heading mb-2">Resource Type</label>
          <div className="grid grid-cols-3 gap-3">
            {fileTypeOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, fileType: opt.value })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    form.fileType === opt.value
                      ? 'border-accent bg-accent/5 ring-2 ring-accent'
                      : 'border-border bg-surface hover:border-accent/30'
                  }`}
                >
                  <Icon size={24} className={form.fileType === opt.value ? 'text-accent' : 'text-muted'} />
                  <p className="text-sm font-medium text-heading mt-2">{opt.label}</p>
                  <p className="text-xs text-muted">{opt.desc}</p>
                </button>
              );
            })}
          </div>
          {errors.fileType && <p className="text-xs text-danger mt-1">{errors.fileType}</p>}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="upload-title" className="block text-sm font-medium text-heading mb-1.5">Title</label>
          <input
            id="upload-title" name="title" type="text" value={form.title} onChange={handleChange}
            placeholder="e.g., OS Unit 3 Notes — Process Scheduling"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-bg placeholder:text-muted focus:ring-2 focus:ring-accent outline-none ${errors.title ? 'border-danger' : 'border-border'}`}
          />
          {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="upload-desc" className="block text-sm font-medium text-heading mb-1.5">Description</label>
          <textarea
            id="upload-desc" name="description" value={form.description} onChange={handleChange}
            rows={3} placeholder="Brief description of this resource..."
            className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-bg placeholder:text-muted focus:ring-2 focus:ring-accent outline-none resize-none ${errors.description ? 'border-danger' : 'border-border'}`}
          />
          {errors.description && <p className="text-xs text-danger mt-1">{errors.description}</p>}
        </div>

        {/* Subject + Semester */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="upload-subject" className="block text-sm font-medium text-heading mb-1.5">Subject</label>
            <select
              id="upload-subject" name="subject" value={form.subject} onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-bg focus:ring-2 focus:ring-accent outline-none ${errors.subject ? 'border-danger' : 'border-border'}`}
            >
              <option value="">Select subject</option>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.subject && <p className="text-xs text-danger mt-1">{errors.subject}</p>}
          </div>
          <div>
            <label htmlFor="upload-semester" className="block text-sm font-medium text-heading mb-1.5">Semester</label>
            <select
              id="upload-semester" name="semester" value={form.semester} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm bg-bg focus:ring-2 focus:ring-accent outline-none"
            >
              <option value="">Optional</option>
              {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Tags (max 5)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-tag rounded-md text-xs text-text">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-muted hover:text-heading">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder="Add a tag..."
              className="flex-1 px-3 py-2 rounded-lg border border-border text-sm bg-bg placeholder:text-muted focus:ring-2 focus:ring-accent outline-none"
            />
            <button type="button" onClick={addTag} disabled={form.tags.length >= 5}
              className="px-3 py-2 bg-hover rounded-lg text-sm text-muted hover:text-heading disabled:opacity-50">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* File upload (for PDF/IMAGE) */}
        {form.fileType && form.fileType !== 'NOTE' && (
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Upload File</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl bg-bg hover:border-accent cursor-pointer transition-colors">
              <Upload size={24} className="text-muted mb-2" />
              <p className="text-sm text-muted">
                {form.file ? form.file.name : 'Click to upload or drag & drop'}
              </p>
              <p className="text-xs text-muted">JPG, PNG, WebP, PDF up to 10MB</p>
              <input type="file" className="hidden" onChange={handleFileChange}
                accept={form.fileType === 'PDF' ? '.pdf' : 'image/*'} />
            </label>
            {preview && <img src={preview} alt="Preview" className="mt-3 max-h-40 rounded-lg border border-border" />}
            {errors.file && <p className="text-xs text-danger mt-1">{errors.file}</p>}
          </div>
        )}

        {/* Content (for NOTE type) */}
        {form.fileType === 'NOTE' && (
          <div>
            <label htmlFor="upload-content" className="block text-sm font-medium text-heading mb-1.5">Note Content</label>
            <textarea
              id="upload-content" name="content" value={form.content} onChange={handleChange}
              rows={8} placeholder="Write your note here..."
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm bg-bg placeholder:text-muted focus:ring-2 focus:ring-accent outline-none resize-y font-mono"
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit" disabled={submitting}
          className="w-full py-3 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-heading transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? <Spinner size={18} /> : <><Upload size={16} /> Upload Resource</>}
        </button>
      </form>
    </PageWrapper>
  );
}
