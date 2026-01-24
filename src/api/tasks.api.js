import axios from './axios';

/**
 * Tasks API calls
 */

// Get all tasks with optional filters
export const getTasks = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.projectId) params.append('projectId', filters.projectId);
  if (filters.status) params.append('status', filters.status);
  if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
  
  const response = await axios.get(`/api/tasks?${params.toString()}`);
  return response.data;
};

// Get single task by ID
export const getTaskById = async (id) => {
  const response = await axios.get(`/api/tasks/${id}`);
  return response.data;
};

// Create new task
export const createTask = async (taskData) => {
  const response = await axios.post('/api/tasks', taskData);
  return response.data;
};

// Update task
export const updateTask = async (id, taskData) => {
  const response = await axios.put(`/api/tasks/${id}`, taskData);
  return response.data;
};

// Delete task
export const deleteTask = async (id) => {
  const response = await axios.delete(`/api/tasks/${id}`);
  return response.data;
};
