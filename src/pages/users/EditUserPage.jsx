import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUsers, updateUser } from '../../features/users/usersSlice';
import { fetchOrganizations } from '../../features/organizations/organizationsSlice';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import {
  ROLES,
  ROLE_LABELS,
  SERVICE_TYPES,
  SERVICE_TYPE_LABELS,
} from '../../utils/constants';
import { ArrowLeft, Save } from 'lucide-react';

const EditUserPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { organizations } = useSelector((state) => state.organizations);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: ROLES.CLIENT,
    department: '',
    organizationId: '',
    isActive: true,
    jobProfile: '', // Added for team member job profile
  });
  
  const [errors, setErrors] = useState({});

  // Get the user being edited
  const userToEdit = users.find((u) => u._id === id);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchOrganizations());
  }, [dispatch]);

  // Populate form when user loads
  useEffect(() => {
    if (userToEdit) {
      setFormData({
        firstName: userToEdit.firstName || '',
        lastName: userToEdit.lastName || '',
        email: userToEdit.email || '',
        role: userToEdit.role || ROLES.CLIENT,
        department: userToEdit.department || '',
        organizationId: userToEdit.organizationId?._id || userToEdit.organizationId || '',
        isActive: userToEdit.isActive !== undefined ? userToEdit.isActive : true,
        jobProfile: userToEdit.jobProfile || '',
      });
    }
  }, [userToEdit]);

  // Only admins can access this page
  if (currentUser?.role !== ROLES.ADMIN) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300">403</h1>
          <p className="text-xl text-gray-600 mt-4">Access Denied</p>
          <p className="text-gray-500 mt-2">Only administrators can edit users.</p>
          <Button variant="primary" className="mt-6" onClick={() => navigate('/users')}>
            Go to Users
          </Button>
        </div>
      </div>
    );
  }

  const roleOptions = Object.entries(ROLES).map(([key, value]) => ({
    value,
    label: ROLE_LABELS[value],
  }));

  const departmentOptions = Object.entries(SERVICE_TYPES).map(([key, value]) => ({
    value,
    label: SERVICE_TYPE_LABELS[value],
  }));

  const organizationOptions = organizations.map((org) => ({
    value: org._id,
    label: org.name,
  }));

  const statusOptions = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ];

  // Check if organization field should be shown (all roles can have organization)
  const showOrganizationField = formData.role === ROLES.ADMIN || formData.role === ROLES.CLIENT || formData.role === ROLES.TEAM_MEMBER;
  
  // Check if department field should be shown (admin and team_member only)
  const showDepartmentField = formData.role === ROLES.ADMIN || formData.role === ROLES.TEAM_MEMBER;
  
  // Check if job profile field should be shown (team_member only)
  const showJobProfileField = formData.role === ROLES.TEAM_MEMBER;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.role) newErrors.role = 'Role is required';
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
    
    // Convert isActive string to boolean
    const userData = {
      ...formData,
      isActive: formData.isActive === 'true' || formData.isActive === true,
    };

    // Remove organizationId if not client or team_member
    if (!showOrganizationField) {
      delete userData.organizationId;
    }

    const result = await dispatch(updateUser({ 
      id, 
      userData 
    }));
    setUpdating(false);
    
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/users');
    }
  };

  if (usersLoading) {
    return <Loader fullPage size="lg" />;
  }

  if (!userToEdit) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/users')}
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600 mt-1">Update user details</p>
        </div>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              placeholder="Enter first name"
            />
            
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              placeholder="Enter last name"
            />
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter email address"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={roleOptions}
              error={errors.role}
            />

            <Select
              label="Status"
              name="isActive"
              value={String(formData.isActive)}
              onChange={handleChange}
              options={statusOptions}
            />
          </div>

          {showDepartmentField && (
            <Select
              label="Department (optional)"
              name="department"
              value={formData.department}
              onChange={handleChange}
              options={departmentOptions}
              placeholder="Select a department"
            />
          )}

          {showJobProfileField && (
            <Input
              label="Job Profile (optional)"
              name="jobProfile"
              value={formData.jobProfile}
              onChange={handleChange}
              placeholder="e.g. Senior Developer, Marketing Manager"
            />
          )}

          {showOrganizationField && (
            <Select
              label="Organization (optional)"
              name="organizationId"
              value={formData.organizationId}
              onChange={handleChange}
              options={organizationOptions}
              placeholder="Select an organization"
            />
          )}
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/users')}
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

export default EditUserPage;
