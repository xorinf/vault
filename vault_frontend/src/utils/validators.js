/**
 * Validate email format.
 * @param {string} email
 * @returns {string|null} error message or null
 */
export function validateEmail(email) {
  if (!email) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Invalid email format';
  return null;
}

/**
 * Validate password strength.
 * @param {string} password
 * @returns {string|null} error message or null
 */
export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

/**
 * Validate username.
 * @param {string} username
 * @returns {string|null}
 */
export function validateUsername(username) {
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  return null;
}

/**
 * Validate resource upload form.
 * @param {Object} data
 * @returns {Object} errors object keyed by field
 */
export function validateResource(data) {
  const errors = {};
  if (!data.title?.trim()) errors.title = 'Title is required';
  if (!data.description?.trim()) errors.description = 'Description is required';
  if (!data.subject) errors.subject = 'Subject is required';
  if (!data.fileType) errors.fileType = 'File type is required';
  if (data.fileType !== 'NOTE' && !data.file && !data.fileUrl) {
    errors.file = 'File is required for PDF/Image resources';
  }
  return errors;
}
