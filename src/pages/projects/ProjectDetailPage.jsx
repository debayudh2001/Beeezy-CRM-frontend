import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectById, deleteProject, clearSelectedProject } from '../../features/projects/projectsSlice';
import { fetchComments } from '../../features/comments/commentsSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CommentsList from '../../components/comments/CommentsList';
import { 
  PROJECT_STATUS_COLORS, 
  PRIORITY_COLORS, 
  SERVICE_TYPE_LABELS,
  ENTITY_TYPES,
  ROLES 
} from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import { ArrowLeft, Edit, Trash2, Calendar, IndianRupee } from 'lucide-react';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProject: project, loading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    dispatch(fetchProjectById(id));
    dispatch(fetchComments({ entityType: ENTITY_TYPES.PROJECT, entityId: id }));
    
    return () => {
      dispatch(clearSelectedProject());
    };
  }, [dispatch, id]);
  
  const handleDelete = async () => {
    setDeleting(true);
    const result = await dispatch(deleteProject(id));
    setDeleting(false);
    
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/projects');
    }
  };
  
  
  const canEdit = user?.role === ROLES.ADMIN;
  const canDelete = user?.role === ROLES.ADMIN;
  
  if (loading) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate('/projects')}
            className="mt-1"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <div className="flex gap-2 mt-2">
              <Badge variant={PROJECT_STATUS_COLORS[project.status]} text={project.status} />
              <Badge variant={PRIORITY_COLORS[project.priority]} text={project.priority} />
              <Badge variant="bg-gray-100 text-gray-800" text={SERVICE_TYPE_LABELS[project.serviceType]} />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {canEdit && (
            <Link to={`/projects/${id}/edit`}>
              <Button variant="outline">
                <Edit size={18} />
                Edit
              </Button>
            </Link>
          )}
          {canDelete && (
            <Button variant="danger" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 size={18} />
              Delete
            </Button>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Description">
            <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
          </Card>
          
          {/* Team Members */}
          {project.assignedTo && project.assignedTo.length > 0 && (
            <Card title="Team Members">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.assignedTo.map((member) => (
                  <div key={member._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                      {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      {member.department && (
                        <p className="text-xs text-gray-500">{SERVICE_TYPE_LABELS[member.department]}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          
          {/* Comments */}
          <Card title="Comments">
            <CommentsList entityType={ENTITY_TYPES.PROJECT} entityId={id} />
          </Card>
        </div>
        
        {/* Right Column - Metadata */}
        <div className="space-y-6">
          <Card title="Project Info">
            <div className="space-y-4">
              {/* Budget - Admin Only */}
              {project.budget && user?.role === ROLES.ADMIN && (
                <div className="flex items-center gap-3">
                  <IndianRupee size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-medium text-gray-900">{project.budget.toLocaleString()}</p>
                  </div>
                </div>
              )}
              
              {project.startDate && (
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium text-gray-900">{formatDate(project.startDate)}</p>
                  </div>
                </div>
              )}
              
              {project.endDate && (
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-medium text-gray-900">{formatDate(project.endDate)}</p>
                  </div>
                </div>
              )}
              
              {project.createdBy && (
                <div>
                  <p className="text-sm text-gray-600">Created By</p>
                  <p className="font-medium text-gray-900">
                    {project.createdBy.firstName} {project.createdBy.lastName}
                  </p>
                </div>
              )}
              
              {project.clientId && (
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-medium text-gray-900">{project.clientId.name || project.clientId.email}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
};

export default ProjectDetailPage;
