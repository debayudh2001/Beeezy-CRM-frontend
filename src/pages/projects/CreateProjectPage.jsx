import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../../features/projects/projectsSlice';
import { fetchOrganizations } from '../../features/organizations/organizationsSlice';
import { fetchUsers } from '../../features/users/usersSlice';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import {
  PROJECT_STATUS,
  PROJECT_STATUS_LABELS,
  PRIORITY,
  PRIORITY_LABELS,
  SERVICE_TYPES,
  SERVICE_TYPE_LABELS,
  ROLES,
} from '../../utils/constants';
import { getFullName } from '../../utils/helpers';

const CreateProjectPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { organizations } = useSelector((state) => state.organizations);
  const { users } = useSelector((state) => state.users);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serviceType: '',
    status: PROJECT_STATUS.LEAD,
    priority: PRIORITY.LOW,
    startDate: '',
    endDate: '',
    budget: '',
    clientId: '',
    assignedTo: [], // Added for team assignment
  });
  
 const [errors, setErrors] = useState({});

  // Fetch organizations and users on component mount
  useEffect(() => {
    dispatch(fetchOrganizations());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Create client organization options for dropdown
  const clientOptions = organizations.map((org) => ({
    value: org._id,
    label: org.name,
  }));

  // Filter users to only admin and team_member for project assignment
  const assignableUsers = users.filter(
    (u) => u.role === ROLES.ADMIN || u.role === ROLES.TEAM_MEMBER
  );

  const userOptions = assignableUsers.map((u) => ({
    value: u._id,
    label: getFullName(u),
  }));
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleMultiSelectChange = (e) => {
    const { options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData((prev) => ({ ...prev, assignedTo: selectedValues }));
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Project name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.serviceType) newErrors.serviceType = 'Service type is required';
    if (!formData.clientId) newErrors.clientId = 'Client is required';
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
    const result = await dispatch(createProject(formData));
    setLoading(false);
    
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/projects');
    }
  };
  
  const statusOptions = Object.entries(PROJECT_STATUS).map(([key, value]) => ({
    value,
    label: PROJECT_STATUS_LABELS[value],
  }));
  
  const priorityOptions = Object.entries(PRIORITY).map(([key, value]) => ({
    value,
    label: PRIORITY_LABELS[value],
  }));
  
  const serviceTypeOptions = Object.entries(SERVICE_TYPES).map(([key, value]) => ({
    value,
    label: SERVICE_TYPE_LABELS[value],
  }));
  
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-600 mt-1">Fill in the project details below</p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Project Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter project name"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter project description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Service Type"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              options={serviceTypeOptions}
              error={errors.serviceType}
            />
            
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={priorityOptions}
            />
            
            <Input
              label="Budget (optional)"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter budget"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date (optional)"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
            />
            
            <Input
              label="End Date (optional)"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
          
          <Select
            label="Client"
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            options={clientOptions}
            error={errors.clientId}
            placeholder="Select a client"
          />

          {/* Team Assignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign Team Members (optional)
            </label>
            <select
              multiple
              value={formData.assignedTo}
              onChange={handleMultiSelectChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[120px]"
            >
              {userOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple team members
            </p>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/projects')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Create Project
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateProjectPage;
