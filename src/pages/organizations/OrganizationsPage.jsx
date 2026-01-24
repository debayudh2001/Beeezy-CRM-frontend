import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Mail, Phone, Globe } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { fetchOrganizations } from '../../features/organizations/organizationsSlice';
import { ROLES } from '../../utils/constants';

const OrganizationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { organizations, loading } = useSelector((state) => state.organizations);

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  // Only admin and team_member can access
  if (user?.role !== ROLES.ADMIN && user?.role !== ROLES.TEAM_MEMBER) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300">403</h1>
          <p className="text-xl text-gray-600 mt-4">Access Denied</p>
          <p className="text-gray-500 mt-2">Only admins and team members can view organizations.</p>
          <Button variant="primary" className="mt-6" onClick={() => navigate('/')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader fullPage />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600 mt-1">Manage all organizations in the system</p>
        </div>
        {user?.role === ROLES.ADMIN && (
          <Button variant="primary" onClick={() => navigate('/organizations/create')}>
            <Plus size={20} />
            Create Organization
          </Button>
        )}
      </div>

      {/* Organizations Grid */}
      {organizations.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No organizations found</h3>
            <p className="mt-2 text-sm text-gray-500">Get started by creating a new organization.</p>
            {user?.role === ROLES.ADMIN && (
              <Button
                variant="primary"
                className="mt-6"
                onClick={() => navigate('/organizations/create')}
              >
                <Plus size={20} />
                Create Organization
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Card
              key={org._id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              onClick={() => navigate(`/organizations/${org._id}`)}
            >
              <div className="space-y-4">
                {/* Organization Icon & Name */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="text-primary-600" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{org.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {org.isActive ? (
                        <span className="text-green-600 font-medium">Active</span>
                      ) : (
                        <span className="text-gray-400">Inactive</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  {org.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{org.email}</span>
                    </div>
                  )}
                  {org.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} className="text-gray-400 flex-shrink-0" />
                      <span>{org.phone}</span>
                    </div>
                  )}
                  {org.website && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{org.website}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationsPage;
