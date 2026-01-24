import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, UserPlus } from 'lucide-react';
import { fetchUsers, createUser, deleteUser } from '../../features/users/usersSlice';
import { fetchOrganizations } from '../../features/organizations/organizationsSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import {
  ROLES,
  ROLE_LABELS,
  SERVICE_TYPES,
  SERVICE_TYPE_LABELS,
} from '../../utils/constants';

const UsersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state) => state.users);
  const { organizations } = useSelector((state) => state.organizations);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ROLES.CLIENT,
    department: '',
    organizationId: '', // Added for organization selection
    jobProfile: '', // Added for team member job profile
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchOrganizations());
  }, [dispatch]);
  
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
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
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
    
    setCreating(true);
    const result = await dispatch(createUser(formData));
    setCreating(false);
    
    if (result.meta.requestStatus === 'fulfilled') {
      setShowCreateModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: ROLES.CLIENT,
        department: '',
        organizationId: '',
        jobProfile: '',
      });
      setErrors({});
    }
  };
  
  const handleDelete = async () => {
    setDeleting(true);
    await dispatch(deleteUser(selectedUserId));
    setDeleting(false);
    setShowDeleteDialog(false);
    setSelectedUserId(null);
  };
  
  
  const roleOptions = Object.entries(ROLES).map(([key, value]) => ({
    value,
    label: ROLE_LABELS[value],
  }));
  
  const departmentOptions = Object.entries(SERVICE_TYPES).map(([key, value]) => ({
    value,
    label: SERVICE_TYPE_LABELS[value],
  }));

  // Create organization options for dropdown
  const organizationOptions = organizations.map((org) => ({
    value: org._id,
    label: org.name,
  }));

  // Check if organization field should be shown (all roles can have organization)
  const showOrganizationField = formData.role === ROLES.ADMIN || formData.role === ROLES.CLIENT || formData.role === ROLES.TEAM_MEMBER;

  // Check if department field should be shown (admin and team_member only)
  const showDepartmentField = formData.role === ROLES.ADMIN || formData.role === ROLES.TEAM_MEMBER;

  // Check if job profile field should be shown (team_member only)
  const showJobProfileField = formData.role === ROLES.TEAM_MEMBER;
  
  if (loading) {
    return <Loader fullPage size="lg" />;
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">{users?.length || 0} total users</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <UserPlus size={20} />
          Add User
        </Button>
      </div>
      
      {/* Users Table */}
      <Card>
        {users?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No users found</p>
            <Button variant="primary" className="mt-4" onClick={() => setShowCreateModal(true)}>
              Add your first user
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant="bg-blue-100 text-blue-800" text={ROLE_LABELS[user.role]} />
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {user.department ? SERVICE_TYPE_LABELS[user.department] : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} 
                        text={user.isActive ? 'Active' : 'Inactive'} 
                      />
                    </td>
                  <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/users/${user._id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUserId(user._id);
                            setShowDeleteDialog(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New User"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
            />
          </div>
          
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          
          <Select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={roleOptions}
            error={errors.role}
          />
          
          {showDepartmentField && (
            <Select
              label="Department (optional)"
              name="department"
              value={formData.department}
              onChange={handleChange}
              options={departmentOptions}
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
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={creating}>
              Add User
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedUserId(null);
        }}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
};

export default UsersPage;
