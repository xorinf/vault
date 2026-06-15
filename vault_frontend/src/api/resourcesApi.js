import api from './axios';

/**
 * Get all active resources (student view).
 */
export async function getResources() {
  const { data } = await api.get('/student-api/resources');
  return data;
}

/**
 * Get a single resource by ID (student view, increments viewCount).
 * @param {string} id
 */
export async function getResource(id) {
  const { data } = await api.get(`/student-api/resource/${id}`);
  return data;
}

/**
 * Add a comment to a resource.
 * @param {string} resourceId
 * @param {string} comment
 */
export async function addComment(resourceId, comment) {
  const { data } = await api.put('/student-api/comment', {
    resource_id: resourceId,
    comment,
  });
  return data;
}

/**
 * Edit a comment.
 * @param {string} resourceId
 * @param {string} commentId
 * @param {string} comment
 */
export async function editComment(resourceId, commentId, comment) {
  const { data } = await api.put('/student-api/comment/edit', {
    resourceId,
    commentId,
    comment,
  });
  return data;
}

/**
 * Delete a comment.
 * @param {string} resourceId
 * @param {string} commentId
 */
export async function deleteComment(resourceId, commentId) {
  const { data } = await api.delete(`/student-api/comment/${resourceId}/${commentId}`);
  return data;
}


/**
 * Cast a vote on a resource.
 * @param {string} resourceId
 * @param {"UPVOTE"|"DOWNVOTE"} type
 */
export async function vote(resourceId, type) {
  const { data } = await api.post('/student-api/vote', {
    resource_id: resourceId,
    type,
  });
  return data;
}

/**
 * Remove a vote from a resource.
 * @param {string} resourceId
 */
export async function removeVote(resourceId) {
  const { data } = await api.delete(`/student-api/vote/${resourceId}`);
  return data;
}

/**
 * Search resources.
 * @param {string} query
 */
export async function searchResources(query) {
  const { data } = await api.get(`/student-api/search?q=${encodeURIComponent(query)}`);
  return data;
}

/**
 * Upload a new resource.
 * @param {FormData} formData
 */
export async function uploadResource(formData) {
  const { data } = await api.post('/resource-api/resource', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/**
 * Get own uploaded resources.
 */
export async function getMyResources() {
  const { data } = await api.get('/resource-api/resources');
  return data;
}

/**
 * Update an existing resource.
 * @param {FormData} formData - must include _id field
 */
export async function updateResource(formData) {
  const { data } = await api.put('/resource-api/resource', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/**
 * Soft delete a resource.
 * @param {string} id
 */
export async function deleteResource(id) {
  const { data } = await api.patch(`/resource-api/resource/delete/${id}`);
  return data;
}

/**
 * Restore a soft-deleted resource.
 * @param {string} id
 */
export async function restoreResource(id) {
  const { data } = await api.patch(`/resource-api/resource/restore/${id}`);
  return data;
}

/**
 * Get all resources including inactive (admin only).
 */
export async function getAllResources() {
  const { data } = await api.get('/resource-api/all-resources');
  return data;
}

/**
 * Get all users (admin only).
 */
export async function getUsers() {
  const { data } = await api.get('/resource-api/users');
  return data;
}

/**
 * Toggle user active status (admin only).
 * @param {string} userId
 */
export async function toggleUserStatus(userId) {
  const { data } = await api.patch(`/resource-api/users/status/${userId}`);
  return data;
}

/**
 * Toggle resource active status (admin only).
 * @param {string} resourceId
 */
export async function toggleResourceStatus(resourceId) {
  const { data } = await api.patch(`/resource-api/resources/status/${resourceId}`);
  return data;
}
