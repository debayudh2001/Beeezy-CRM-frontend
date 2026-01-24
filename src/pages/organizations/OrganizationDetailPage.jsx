import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Building2, Mail, Phone, Globe, MapPin, Calendar, ArrowLeft, FolderKanban, CheckSquare } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { getOrganizations } from '../../api/auth.api';
import { formatDate } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';

const OrganizationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const data = await getOrganizations();
        const org = data.organizations.find((o) => o._id === id);
        setOrganization(org);
      } catch (error) {
        console.error('Error fetching organization:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

  // Only admin and team_member can access
  if (user?.role !== ROLES.ADMIN && user?.role !== ROLES.TEAM_MEMBER) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300">403</h1>
          <p className="text-xl text-gray-600 mt-4">Access Denied</p>
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

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Organization Not Found</h2>
          <p className="mt-2 text-gray-600">The organization you're looking for doesn't exist.</p>
          <Button variant="primary" className="mt-6" onClick={() => navigate('/organizations')}>
            Back to Organizations
          </Button>
        </div>
      </div>
    );
  }

  console.log(organization)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/organizations')}>
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{organization.name}</h1>
            <Badge variant={organization.isActive ? 'success' : 'secondary'}>
              {organization.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">Organization details and information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Organization Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card title="Organization Information">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Organization Name</label>
                  <p className="mt-1 text-gray-900">{organization.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <p className="mt-1">
                    {organization.isActive ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-gray-500">Inactive</span>
                    )}
                  </p>
                </div>
              </div>

              {organization.createdAt && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar size={16} />
                    Created Date
                  </label>
                  <p className="mt-1 text-gray-900">{formatDate(organization.createdAt)}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Contact Information */}
          <Card title="Contact Information">
            <div className="space-y-4">
              {organization.email && (
                <div className="flex items-start gap-3">
                  <Mail className="text-gray-400 mt-0.5" size={20} />
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">
                      <a href={`mailto:${organization.email}`} className="text-primary-600 hover:underline">
                        {organization.email}
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {organization.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="text-gray-400 mt-0.5" size={20} />
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Phone</label>
                    <p className="mt-1 text-gray-900">
                      <a href={`tel:${organization.phone}`} className="text-primary-600 hover:underline">
                        {organization.phone}
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {organization.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-0.5" size={20} />
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Address</label>
                    <p className="mt-1 text-gray-900">{organization.address}</p>
                  </div>
                </div>
              )}

              {organization.website && (
                <div className="flex items-start gap-3">
                  <Globe className="text-gray-400 mt-0.5" size={20} />
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Website</label>
                    <p className="mt-1 text-gray-900">
                      <a
                        href={organization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        {organization.website}
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card title="Quick Stats">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FolderKanban className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{organization.projects?.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckSquare className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{organization.tasks?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetailPage;
