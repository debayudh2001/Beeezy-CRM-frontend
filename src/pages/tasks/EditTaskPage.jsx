import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTaskById, updateTask } from '../../features/tasks/tasksSlice';
import { fetchUsers } from '../../features/users/usersSlice';
import { fetchProjects } from '../../features/projects/projectsSlice';
import { fetchOrganizations } from '../../features/organizations/organizationsSlice';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import {
  TASK_STATUS,
  TASK_STATUS_LABELS,
  PRIORITY,
  PRIORITY_LABELS,
  ROLES,
} from '../../utils/constants';
import { getFullName } from '../../utils/helpers';
import { ArrowLeft, Save } from 'lucide-react';

const EditTaskPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedTask: task, loading: taskLoading } = useSelector((state) => state.tasks);
  const { users } = useSelector((state) => state.users);
  const { projects } = useSelector((state) => state.projects);
  const { organizations } = useSelector((state) => state.organizations);
  const { user } = useSelector((state) => state.auth);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    organizationId: '',
    projectId: '',
    title: '',
    description: '',
    status: TASK_STATUS.TODO,
    priority: PRIORITY.LOW,
    dueDate: '',
    assignedTo: '',
  });
  
  const [errors, setErrors] = useState({});

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchTaskById(id));
    dispatch(fetchProjects());
    dispatch(fetchOrganizations());
    
    // Only fetch users if admin (needed for assignedTo dropdown)
    if (user?.role === ROLES.ADMIN) {
      dispatch(fetchUsers());
    }
  }, [dispatch, id, user?.role]);

  // Populate form when task loads
  useEffect(() => {
    if (task) {
      setFormData({
        organizationId: task.organizationId?._id || task.organizationId || '',
        projectId: task.projectId?._id || '',
        title: task.title || '',
        description: task.description || '',
        status: task.status || TASK_STATUS.TODO,
        priority: task.priority || PRIORITY.LOW,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assignedTo: task.assignedTo?._id || '',
      });
    }
  }, [task]);

  // Check user role permissions
  const isAdmin = user?.role === ROLES.ADMIN;
  const isTeamMember = user?.role === ROLES.TEAM_MEMBER;
  const canAccess = isAdmin || isTeamMember;

  // Only admins and team members can access this page
  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300">403</h1>
          <p className="text-xl text-gray-600 mt-4">Access Denied</p>
          <p className="text-gray-500 mt-2">Only administrators and team members can edit tasks.</p>
          <Button variant="primary" className="mt-6" onClick={() => navigate('/tasks')}>
            Go to Tasks
          </Button>
        </div>
      </div>
    );
  }

  // Filter users to only admin and team_member
  const assignableUsers = users.filter(
    (u) => u.role === ROLES.ADMIN || u.role === ROLES.TEAM_MEMBER
  );

  const userOptions = assignableUsers.map((u) => ({
    value: u._id,
    label: getFullName(u),
  }));

  const projectOptions = projects.map((project) => ({
    value: project._id,
    label: project.name,
  }));

  const organizationOptions = organizations.map((org) => ({
    value: org._id,
    label: org.name,
  }));

  const statusOptions = Object.entries(TASK_STATUS).map(([key, value]) => ({
    value,
    label: TASK_STATUS_LABELS[value],
  }));

  const priorityOptions = Object.entries(PRIORITY).map(([key, value]) => ({
    value,
    label: PRIORITY_LABELS[value],
  }));
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    // Only validate these fields for admins
    if (isAdmin) {
      if (!formData.organizationId) newErrors.organizationId = 'Organization is required';
      if (!formData.projectId) newErrors.projectId = 'Project is required';
      if (!formData.title) newErrors.title = 'Task title is required';
    }
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setUpdating(true);
    const result = await dispatch(updateTask({ 
      id, 
      taskData: formData 
    }));
    setUpdating(false);
    
    if (result.meta.requestStatus === 'fulfilled') {
      navigate(`/tasks/${id}`);
    }
  };

  if (taskLoading) {
    return <Loader fullPage size="lg" />;
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Task not found</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(`/tasks/${id}`)}
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Task</h1>
          <p className="text-gray-600 mt-1">Update task details</p>
        </div>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {isAdmin && (
            <>
              <Select
                label="Organization"
                name="organizationId"
                value={formData.organizationId}
                onChange={handleChange}
                options={organizationOptions}
                error={errors.organizationId}
                placeholder="Select an organization"
              />

              <Select
                label="Project"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                options={projectOptions}
                error={errors.projectId}
                placeholder="Select a project"
              />
              
              <Input
                label="Task Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                placeholder="Enter task title"
              />
            </>
          )}

          {isTeamMember && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Editing as Team Member:</strong> You can update task status, priority, description, and due date. 
                Contact an admin to change the title, project, or assignment.
              </p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter task description"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />
            
            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={priorityOptions}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Due Date (optional)"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
            />
            
            {isAdmin && (
              <Select
                label="Assign To (optional)"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                options={userOptions}
                placeholder="Select a user"
              />
            )}
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(`/tasks/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={updating}>
              <Save size={20} />
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditTaskPage;
