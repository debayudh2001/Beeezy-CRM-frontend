import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProjectById, updateProject } from '../../features/projects/projectsSlice';
import { fetchUsers } from '../../features/users/usersSlice';
import { fetchOrganizations } from '../../features/organizations/organizationsSlice';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
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
import { ArrowLeft, Save } from 'lucide-react';

const EditProjectPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProject: project, loading: projectLoading } = useSelector((state) => state.projects);
  const { users } = useSelector((state) => state.users);
  const { organizations } = useSelector((state) => state.organizations);
  const { user } = useSelector((state) => state.auth);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serviceType: '',
    status: PROJECT_STATUS.LEAD,
    priority: PRIORITY.LOW,
    clientId: '',
    startDate: '',
    endDate: '',
    budget: '',
    assignedTo: [],
  });
  
  const [errors, setErrors] = useState({});

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchProjectById(id));
    dispatch(fetchUsers());
    dispatch(fetchOrganizations());
  }, [dispatch, id]);

  // Populate form when project loads
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        serviceType: project.serviceType || '',
        status: project.status || PROJECT_STATUS.LEAD,
        priority: project.priority || PRIORITY.LOW,
        clientId: project.clientId?._id || '',
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        budget: project.budget || '',
        assignedTo: project.assignedTo?.map(u => u._id) || [],
      });
    }
  }, [project]);

  // Only admins can access this page
  if (user?.role !== ROLES.ADMIN) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300">403</h1>
          <p className="text-xl text-gray-600 mt-4">Access Denied</p>
          <p className="text-gray-500 mt-2">Only administrators can edit projects.</p>
          <Button variant="primary" className="mt-6" onClick={() => navigate('/projects')}>
            Go to Projects
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

  const organizationOptions = organizations.map((org) => ({
    value: org._id,
    label: org.name,
  }));

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
    
    setUpdating(true);
    const result = await dispatch(updateProject({ 
      id, 
      projectData: formData 
    }));
    setUpdating(false);
    
    if (result.meta.requestStatus === 'fulfilled') {
      navigate(`/projects/${id}`);
    }
  };

  if (projectLoading) {
    return <Loader fullPage size="lg" />;
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(`/projects/${id}`)}
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
          <p className="text-gray-600 mt-1">Update project details</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="space-y-4">
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter project description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
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
                label="Client"
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                options={organizationOptions}
                error={errors.clientId}
                placeholder="Select a client"
              />
            </div>
          </div>
        </Card>

        {/* Status & Timeline */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Status & Timeline</h2>
          
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

            <Input
              label="Budget (optional)"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter budget amount"
            />
          </div>
        </Card>

        {/* Team Assignment */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Team Assignment</h2>
          
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
            <p className="text-sm text-gray-500 mt-1">
              Hold Ctrl (Cmd on Mac) to select multiple team members
            </p>
          </div>
        </Card>
        
        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(`/projects/${id}`)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={updating}>
            <Save size={20} />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectPage;
