import axios from './axios';

/**
 * Projects API calls
 */

// Get all projects with optional filters
export const getProjects = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.serviceType) params.append('serviceType', filters.serviceType);
  
  const response = await axios.get(`/api/projects?${params.toString()}`);
  return response.data;
};

// Get single project by ID
export const getProjectById = async (id) => {
  const response = await axios.get(`/api/projects/${id}`);
  return response.data;
};

// Create new project
export const createProject = async (projectData) => {
  const response = await axios.post('/api/projects', projectData);
  return response.data;
};

// Update project
export const updateProject = async (id, projectData) => {
  const response = await axios.put(`/api/projects/${id}`, projectData);
  return response.data;
};

// Delete project
export const deleteProject = async (id) => {
  const response = await axios.delete(`/api/projects/${id}`);
  return response.data;
};
