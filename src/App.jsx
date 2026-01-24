import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { getCurrentUser } from './features/auth/authSlice';

// Layout
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';

// Pages
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import CreateProjectPage from './pages/projects/CreateProjectPage';
import EditProjectPage from './pages/projects/EditProjectPage';
import TasksPage from './pages/tasks/TasksPage';
import TaskDetailPage from './pages/tasks/TaskDetailPage';
import CreateTaskPage from './pages/tasks/CreateTaskPage';
import EditTaskPage from './pages/tasks/EditTaskPage';
import UsersPage from './pages/users/UsersPage';
import UserDetailPage from './pages/users/UserDetailPage';
import EditUserPage from './pages/users/EditUserPage';
import OrganizationsPage from './pages/organizations/OrganizationsPage';
import OrganizationDetailPage from './pages/organizations/OrganizationDetailPage';
import CreateOrganization from './pages/organizations/CreateOrganization';
import Profile from './pages/Profile';

import { ROLES } from './utils/constants';
import Loader from './components/common/Loader';

function App() {
  const dispatch = useDispatch();
  const { token, isAuthenticated, loading } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Check if token exists and fetch current user
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, isAuthenticated]);
  
  if (loading) {
    return <Loader fullPage size="lg" />;
  }
  
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        } />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Projects Routes */}
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/new" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <CreateProjectPage />
            </ProtectedRoute>
          } />
          <Route path="/projects/:id/edit" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <EditProjectPage />
            </ProtectedRoute>
          } />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          
          {/* Tasks Routes */}
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/new" element={<CreateTaskPage />} />
          <Route path="/tasks/:id/edit" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEAM_MEMBER]}>
              <EditTaskPage />
            </ProtectedRoute>
          } />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          
          {/* Users Routes (Admin only) */}
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <UsersPage />
            </ProtectedRoute>
          } />
          <Route path="/users/:id/edit" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <EditUserPage />
            </ProtectedRoute>
          } />
          <Route path="/users/:id" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <UserDetailPage />
            </ProtectedRoute>
          } />
          
          {/* Organizations Routes (Admin and Team Member) */}
          <Route path="/organizations" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEAM_MEMBER]}>
              <OrganizationsPage />
            </ProtectedRoute>
          } />
          <Route path="/organizations/create" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <CreateOrganization />
            </ProtectedRoute>
          } />
          <Route path="/organizations/:id" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEAM_MEMBER]}>
              <OrganizationDetailPage />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300">404</h1>
              <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
