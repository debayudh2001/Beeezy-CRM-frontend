import axios from './axios';

/**
 * Comments API calls
 */

// Get comments for a specific entity (Task or Project)
export const getComments = async (entityType, entityId) => {
  const params = new URLSearchParams();
  if (entityType) params.append('entityType', entityType);
  if (entityId) params.append('entityId', entityId);
  
  const response = await axios.get(`/api/comments?${params.toString()}`);
  return response.data;
};

// Get single comment by ID
export const getCommentById = async (id) => {
  const response = await axios.get(`/api/comments/${id}`);
  return response.data;
};

// Create new comment
export const createComment = async (commentData) => {
  const response = await axios.post('/api/comments', commentData);
  return response.data;
};
