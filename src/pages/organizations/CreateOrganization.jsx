import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, UserPlus, Users } from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { registerOrganization } from '../../api/auth.api';
import { fetchUsers } from '../../features/users/usersSlice';
import toast from 'react-hot-toast';
import { ROLES } from '../../utils/constants';
import { getFullName } from '../../utils/helpers';

const CreateOrganization = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);
  const [loading, setLoading] = useState(false);
  const [adminOption, setAdminOption] = useState('new'); // 'new' or 'existing'
  
  const [formData, setFormData] = useState({
    // Organization details
    organizationName: '',
    organizationEmail: '',
    organizationPhone: '',
    organizationAddress: '',
    organizationWebsite: '',
    // Existing admin
    existingAdminId: '',
    // New admin user details
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filter only admin users
  const adminUsers = users.filter((u) => u.role === ROLES.ADMIN);
  const adminOptions = adminUsers.map((admin) => ({
    value: admin._id,
    label: `${getFullName(admin)} (${admin.email})`,
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
    
    // Organization validation
    if (!formData.organizationName) newErrors.organizationName = 'Organization name is required';
    if (!formData.organizationEmail) newErrors.organizationEmail = 'Organization email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.organizationEmail)) newErrors.organizationEmail = 'Email is invalid';
    
    // Admin validation based on option
    if (adminOption === 'existing') {
      if (!formData.existingAdminId) newErrors.existingAdminId = 'Please select an admin user';
    } else {
      // New admin validation
      if (!formData.adminFirstName) newErrors.adminFirstName = 'First name is required';
      if (!formData.adminLastName) newErrors.adminLastName = 'Last name is required';
      if (!formData.adminEmail) newErrors.adminEmail = 'Admin email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) newErrors.adminEmail = 'Email is invalid';
      if (!formData.adminPassword) newErrors.adminPassword = 'Password is required';
      else if (formData.adminPassword.length < 6) newErrors.adminPassword = 'Password must be at least 6 characters';
      if (formData.adminPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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
    
    setLoading(true);
    try {
      const payload = {
        organizationName: formData.organizationName,
        organizationEmail: formData.organizationEmail,
        organizationPhone: formData.organizationPhone,
        organizationAddress: formData.organizationAddress,
        organizationWebsite: formData.organizationWebsite,
      };

      // Add admin data based on option
      if (adminOption === 'existing') {
        payload.existingAdminId = formData.existingAdminId;
      } else {
        payload.firstName = formData.adminFirstName;
        payload.lastName = formData.adminLastName;
        payload.email = formData.adminEmail;
        payload.password = formData.adminPassword;
      }

      await registerOrganization(payload);
      
      toast.success('Organization created successfully!');
      navigate('/organizations');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };
  
  // Only admins can access this page
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300">403</h1>
          <p className="text-xl text-gray-600 mt-4">Access Denied</p>
          <p className="text-gray-500 mt-2">Only administrators can create organizations.</p>
          <Button variant="primary" className="mt-6" onClick={() => navigate('/')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/organizations')}
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Organization</h1>
          <p className="text-gray-600 mt-1">Set up a new organization with an administrator</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Details */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Building2 className="text-primary-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Organization Details</h2>
              <p className="text-sm text-gray-600">Basic information about the organization</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Organization Name"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                error={errors.organizationName}
                placeholder="Acme Corporation"
              />
            </div>
            
            <Input
              label="Organization Email"
              type="email"
              name="organizationEmail"
              value={formData.organizationEmail}
              onChange={handleChange}
              error={errors.organizationEmail}
              placeholder="contact@organization.com"
            />
            
            <Input
              label="Phone Number (optional)"
              name="organizationPhone"
              value={formData.organizationPhone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
            
            <div className="md:col-span-2">
              <Input
                label="Address (optional)"
                name="organizationAddress"
                value={formData.organizationAddress}
                onChange={handleChange}
                placeholder="123 Business St, City, Country"
              />
            </div>
            
            <Input
              label="Website (optional)"
              name="organizationWebsite"
              value={formData.organizationWebsite}
              onChange={handleChange}
              placeholder="https://organization.com"
            />
          </div>
        </Card>
        
        {/* Admin User Configuration */}
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Admin User</h2>
            <p className="text-sm text-gray-600">Choose how to assign an administrator</p>
          </div>

          {/* Admin Option Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Administrator Assignment
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAdminOption('new')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  adminOption === 'new'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    adminOption === 'new' ? 'bg-primary-100' : 'bg-gray-100'
                  }`}>
                    <UserPlus className={adminOption === 'new' ? 'text-primary-600' : 'text-gray-600'} size={20} />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${adminOption === 'new' ? 'text-primary-900' : 'text-gray-900'}`}>
                      Create New Admin
                    </p>
                    <p className="text-xs text-gray-500">Set up a new administrator account</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAdminOption('existing')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  adminOption === 'existing'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    adminOption === 'existing' ? 'bg-primary-100' : 'bg-gray-100'
                  }`}>
                    <Users className={adminOption === 'existing' ? 'text-primary-600' : 'text-gray-600'} size={20} />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${adminOption === 'existing' ? 'text-primary-900' : 'text-gray-900'}`}>
                      Use Existing Admin
                    </p>
                    <p className="text-xs text-gray-500">Assign an existing administrator</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Form Fields */}
          {adminOption === 'existing' ? (
            <Select
              label="Select Existing Administrator"
              name="existingAdminId"
              value={formData.existingAdminId}
              onChange={handleChange}
              options={adminOptions}
              error={errors.existingAdminId}
              placeholder="Choose an administrator"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="adminFirstName"
                value={formData.adminFirstName}
                onChange={handleChange}
                error={errors.adminFirstName}
                placeholder="John"
              />
              
              <Input
                label="Last Name"
                name="adminLastName"
                value={formData.adminLastName}
                onChange={handleChange}
                error={errors.adminLastName}
                placeholder="Doe"
              />
              
              <div className="md:col-span-2">
                <Input
                  label="Admin Email"
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  error={errors.adminEmail}
                  placeholder="admin@organization.com"
                />
              </div>
              
              <Input
                label="Password"
                type="password"
                name="adminPassword"
                value={formData.adminPassword}
                onChange={handleChange}
                error={errors.adminPassword}
                placeholder="••••••••"
              />
              
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="••••••••"
              />
            </div>
          )}
        </Card>
        
        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/organizations')}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            <Building2 size={20} />
            Create Organization
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrganization;
