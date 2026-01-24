import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import { fetchProjects, setFilters, clearFilters } from '../../features/projects/projectsSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { 
  PROJECT_STATUS, 
  PROJECT_STATUS_LABELS, 
  PROJECT_STATUS_COLORS,
  SERVICE_TYPES,
  SERVICE_TYPE_LABELS,
  ROLES,
  PRIORITY_COLORS
} from '../../utils/constants';

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { projects, filters, loading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    dispatch(fetchProjects(filters));
  }, [dispatch, filters]);
  
  const handleFilterChange = (name, value) => {
    dispatch(setFilters({ [name]: value }));
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };
  
  const statusOptions = Object.entries(PROJECT_STATUS).map(([key, value]) => ({
    value,
    label: PROJECT_STATUS_LABELS[value],
  }));
  
  const serviceTypeOptions = Object.entries(SERVICE_TYPES).map(([key, value]) => ({
    value,
    label: SERVICE_TYPE_LABELS[value],
  }));
  
  // Only admins can create projects
  const canCreateProject = user?.role === ROLES.ADMIN;
  
  if (loading) {
    return <Loader fullPage size="lg" />;
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">{projects?.length || 0} total projects</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filters
          </Button>
          {canCreateProject && (
            <Link to="/projects/new">
              <Button variant="primary">
                <Plus size={20} />
                New Project
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              options={statusOptions}
              placeholder="All statuses"
            />
            <Select
              label="Service Type"
              value={filters.serviceType}
              onChange={(e) => handleFilterChange('serviceType', e.target.value)}
              options={serviceTypeOptions}
              placeholder="All services"
            />
            <div className="flex items-end">
              <Button variant="ghost" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Projects Grid */}
      {projects?.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects found</p>
            {canCreateProject && (
              <Link to="/projects/new">
                <Button variant="primary" className="mt-4">
                  Create your first project
                </Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Link key={project._id} to={`/projects/${project._id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                      {project.name}
                    </h3>
                    <Badge variant={PRIORITY_COLORS[project.priority]} text={project.priority} />
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={PROJECT_STATUS_COLORS[project.status]} text={project.status} />
                    <Badge variant="bg-gray-100 text-gray-800" text={SERVICE_TYPE_LABELS[project.serviceType]} />
                  </div>
                  
                  {project.assignedTo && project.assignedTo.length > 0 && (
                    <div className="flex -space-x-2">
                      {project.assignedTo.slice(0, 3).map((member, idx) => (
                        <div
                          key={idx}
                          className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                          title={`${member.firstName} ${member.lastName}`}
                        >
                          {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                        </div>
                      ))}
                      {project.assignedTo.length > 3 && (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-xs font-medium border-2 border-white">
                          +{project.assignedTo.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
