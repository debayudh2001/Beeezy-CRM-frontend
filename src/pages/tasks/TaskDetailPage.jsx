import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTaskById, deleteTask, clearSelectedTask } from '../../features/tasks/tasksSlice';
import { fetchComments } from '../../features/comments/commentsSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CommentsList from '../../components/comments/CommentsList';
import { 
  TASK_STATUS_COLORS, 
  PRIORITY_COLORS,
  ENTITY_TYPES,
  ROLES,
} from '../../utils/constants';
import { formatDate, formatRelativeTime, isOverdue } from '../../utils/helpers';
import { ArrowLeft, Edit, Trash2, Calendar, User, FolderKanban } from 'lucide-react';

const TaskDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedTask: task, loading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    dispatch(fetchTaskById(id));
    dispatch(fetchComments({ entityType: ENTITY_TYPES.TASK, entityId: id }));
    
    return () => {
      dispatch(clearSelectedTask());
    };
  }, [dispatch, id]);
  
  const handleDelete = async () => {
    setDeleting(true);
    const result = await dispatch(deleteTask(id));
    setDeleting(false);
    
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/tasks');
    }
  };

  // Admins and team members can edit tasks, but team members have restricted fields
  const canEdit = user?.role === ROLES.ADMIN || user?.role === ROLES.TEAM_MEMBER;
  const canDelete = user?.role === ROLES.ADMIN;
  
  if (loading) {
    return <Loader fullPage size="lg" />;
  }
  
  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Task not found</p>
      </div>
    );
  }
  
  const overdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'completed';
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate('/tasks')}
            className="mt-1"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
            <div className="flex gap-2 mt-2">
              <Badge variant={TASK_STATUS_COLORS[task.status]} text={task.status} />
              <Badge variant={PRIORITY_COLORS[task.priority]} text={task.priority} />
              {overdue && <Badge variant="bg-red-100 text-red-800" text="Overdue" />}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {canEdit && (
            <Link to={`/tasks/${id}/edit`}>
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
          {task.description && (
            <Card title="Description">
              <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
            </Card>
          )}
          
          {/* Comments */}
          <Card title="Comments">
            <CommentsList entityType={ENTITY_TYPES.TASK} entityId={id} />
          </Card>
        </div>
        
        {/* Right Column - Metadata */}
        <div className="space-y-6">
          <Card title="Task Info">
            <div className="space-y-4">
              {/* Project */}
              {task.projectId && (
                <div className="flex items-center gap-3">
                  <FolderKanban size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Project</p>
                    <Link 
                      to={`/projects/${task.projectId._id}`}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {task.projectId.name}
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Assigned To */}
              {task.assignedTo && (
                <div className="flex items-center gap-3">
                  <User size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Assigned To</p>
                    <p className="font-medium text-gray-900">
                      {task.assignedTo.firstName} {task.assignedTo.lastName} {task.assignedTo.jobProfile && `(${task.assignedTo.jobProfile})`}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Due Date */}
              {task.dueDate && (
                <div className="flex items-center gap-3">
                  <Calendar size={20} className={overdue ? 'text-red-500' : 'text-gray-500'} />
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className={`font-medium ${overdue ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatDate(task.dueDate)}
                      {overdue && <span className="text-xs ml-1">(Overdue)</span>}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Created By */}
              {task.createdBy && (
                <div>
                  <p className="text-sm text-gray-600">Created By</p>
                  <p className="font-medium text-gray-900">
                    {task.createdBy.firstName} {task.createdBy.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatRelativeTime(task.createdAt)}
                  </p>
                </div>
              )}


              {task.organizationId && (
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-medium text-gray-900">
                    {task.organizationId.name}
                  </p>
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
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
};

export default TaskDetailPage;
