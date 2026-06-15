import api from './axios';

/**
 * Register a new student user.
 * @param {FormData} formData - { username, email, password, role, college, avatar? }
 */
export async function register(formData) {
  const { data } = await api.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/**
 * Login user.
 * @param {Object} credentials - { email, password }
 */
export async function login(credentials) {
  const { data } = await api.post('/auth/login', credentials);
  return data;
}

/**
 * Restore session from cookie/token.
 */
export async function checkAuth() {
  const { data } = await api.get('/auth/check-auth');
  return data;
}

/**
 * Logout user.
 */
export async function logout() {
  const { data } = await api.get('/auth/logout');
  return data;
}

/**
 * Change password.
 * @param {Object} passwords - { current_pass, new_pass }
 */
export async function changePassword(passwords) {
  const { data } = await api.put('/auth/password', passwords);
  return data;
}

/**
 * Update user profile photo.
 * @param {FormData} formData - Contains the file field 'avatar'
 */
export async function updateProfile(formData) {
  const { data } = await api.put('/auth/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

