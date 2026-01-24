import axios from './axios';

/**
 * Users API calls
 */

// Get all users in organization
export const getUsers = async () => {
  const response = await axios.get('/api/users');
  return response.data;
};

// Get single user by ID
export const getUserById = async (id) => {
  const response = await axios.get(`/api/users/${id}`);
  return response.data;
};

// Create new user
export const createUser = async (userData) => {
  const response = await axios.post('/api/users', userData);
  return response.data;
};

// Update user
export const updateUser = async (id, userData) => {
  const response = await axios.put(`/api/users/${id}`, userData);
  return response.data;
};

// Delete user
export const deleteUser = async (id) => {
  const response = await axios.delete(`/api/users/${id}`);
  return response.data;
};
