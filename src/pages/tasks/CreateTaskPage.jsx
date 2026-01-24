import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../../features/tasks/tasksSlice';
import { fetchUsers } from '../../features/users/usersSlice';
import { fetchProjects } from '../../features/projects/projectsSlice';
import { fetchOrganizations } from '../../features/organizations/organizationsSlice';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import {
  TASK_STATUS,
  TASK_STATUS_LABELS,
  PRIORITY,
  PRIORITY_LABELS,
  ROLES,
} from '../../utils/constants';
import { getFullName } from '../../utils/helpers';

const CreateTaskPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { users } = useSelector((state) => state.users);
  const { projects } = useSelector((state) => state.projects);
  const { organizations } = useSelector((state) => state.organizations);
  
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

  // Fetch users, projects, and organizations on component mount
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProjects());
    dispatch(fetchOrganizations());
  }, [dispatch]);


  // Filter users to only admin and team_member, and create dropdown options
  const assignableUsers = users.filter(
    (user) => user.role === ROLES.ADMIN || user.role === ROLES.TEAM_MEMBER
  );

  const userOptions = assignableUsers.map((user) => ({
    value: user._id,
    label: getFullName(user),
  }));

  // Create project options for dropdown
  const projectOptions = projects.map((project) => ({
    value: project._id,
    label: project.name,
  }));

  // Create organization options for dropdown
  const organizationOptions = organizations.map((org) => ({
    value: org._id,
    label: org.name,
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
    if (!formData.organizationId) newErrors.organizationId = 'Organization is required';
    if (!formData.projectId) newErrors.projectId = 'Project is required';
    if (!formData.title) newErrors.title = 'Task title is required';
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    const result = await dispatch(createTask(formData));
    setLoading(false);
    
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/tasks');
    }
  };
  
  const statusOptions = Object.entries(TASK_STATUS).map(([key, value]) => ({
    value,
    label: TASK_STATUS_LABELS[value],
  }));
  
  const priorityOptions = Object.entries(PRIORITY).map(([key, value]) => ({
    value,
    label: PRIORITY_LABELS[value],
  }));
  
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
        <p className="text-gray-600 mt-1">Fill in the task details below</p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            
            <Select
              label="Assign To (optional)"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              options={userOptions}
              placeholder="Select a user"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/tasks')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Create Task
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateTaskPage;
