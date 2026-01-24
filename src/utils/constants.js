// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const TOKEN_KEY = 'beeezy_token';

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  TEAM_MEMBER: 'team_member',
  CLIENT: 'client',
};

// Service Types / Departments
export const SERVICE_TYPES = {
  BUSINESS_CONSULTATION: 'business_consultation',
  BRANDING: 'branding',
  MARKETING: 'marketing',
  IT_SOLUTIONS: 'it_solutions',
  MEDIA_PRODUCTION: 'media_production',
};

export const SERVICE_TYPE_LABELS = {
  [SERVICE_TYPES.BUSINESS_CONSULTATION]: 'Business Consultation',
  [SERVICE_TYPES.BRANDING]: 'Branding',
  [SERVICE_TYPES.MARKETING]: 'Marketing',
  [SERVICE_TYPES.IT_SOLUTIONS]: 'IT Solutions',
  [SERVICE_TYPES.MEDIA_PRODUCTION]: 'Media Production',
};

// Project Status
export const PROJECT_STATUS = {
  LEAD: 'lead',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  COMPLETED: 'completed',
  ON_HOLD: 'on_hold',
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.LEAD]: 'Lead',
  [PROJECT_STATUS.IN_PROGRESS]: 'In Progress',
  [PROJECT_STATUS.REVIEW]: 'Review',
  [PROJECT_STATUS.COMPLETED]: 'Completed',
  [PROJECT_STATUS.ON_HOLD]: 'On Hold',
};

export const PROJECT_STATUS_COLORS = {
  [PROJECT_STATUS.LEAD]: 'bg-blue-100 text-blue-800',
  [PROJECT_STATUS.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
  [PROJECT_STATUS.REVIEW]: 'bg-purple-100 text-purple-800',
  [PROJECT_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
  [PROJECT_STATUS.ON_HOLD]: 'bg-gray-100 text-gray-800',
};

// Task Status
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  COMPLETED: 'completed',
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'To Do',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.REVIEW]: 'Review',
  [TASK_STATUS.COMPLETED]: 'Completed',
};

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.TODO]: 'bg-gray-100 text-gray-800',
  [TASK_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TASK_STATUS.REVIEW]: 'bg-yellow-100 text-yellow-800',
  [TASK_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
};

// Priority
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const PRIORITY_LABELS = {
  [PRIORITY.LOW]: 'Low',
  [PRIORITY.MEDIUM]: 'Medium',
  [PRIORITY.HIGH]: 'High',
  [PRIORITY.CRITICAL]: 'Critical',
};

export const PRIORITY_COLORS = {
  [PRIORITY.LOW]: 'bg-gray-100 text-gray-800',
  [PRIORITY.MEDIUM]: 'bg-blue-100 text-blue-800',
  [PRIORITY.HIGH]: 'bg-orange-100 text-orange-800',
  [PRIORITY.CRITICAL]: 'bg-red-100 text-red-800',
};

// Role Labels
export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.TEAM_MEMBER]: 'Team Member',
  [ROLES.CLIENT]: 'Client',
};

// Comment Entity Types
export const ENTITY_TYPES = {
  PROJECT: 'Project',
  TASK: 'Task',
};
