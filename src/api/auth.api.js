import axios from './axios';

/**
 * Auth API calls
 */

// Login user
export const login = async (email, password) => {
  const response = await axios.post('/api/auth/login', { email, password });
  return response.data;
};

// Register new user
export const register = async (userData) => {
  const response = await axios.post('/api/auth/register/user', userData);
  return response.data;
};

// Get current logged in user
export const getCurrentUser = async () => {
  const response = await axios.get('/api/auth/me');
  return response.data;
};

// Register new organization & new admin (admin only)
export const registerOrganization = async (orgData) => {
  const response = await axios.post('/api/auth/register', orgData);
  return response.data;
};

// Get all organizations (admin and team_member only)
export const getOrganizations = async () => {
  const response = await axios.get('/api/auth/organizations');
  return response.data;
};
