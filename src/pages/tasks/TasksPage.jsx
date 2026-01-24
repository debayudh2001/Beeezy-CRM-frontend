import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import { fetchTasks, setFilters, clearFilters } from '../../features/tasks/tasksSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { 
  TASK_STATUS, 
  TASK_STATUS_LABELS, 
  TASK_STATUS_COLORS,
  PRIORITY_COLORS,
  ROLES,
} from '../../utils/constants';
import { formatDate, isOverdue } from '../../utils/helpers';

const TasksPage = () => {
  const dispatch = useDispatch();
  const { tasks, filters, loading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);
  
  const handleFilterChange = (name, value) => {
    dispatch(setFilters({ [name]: value }));
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };
  
  const statusOptions = Object.entries(TASK_STATUS).map(([key, value]) => ({
    value,
    label: TASK_STATUS_LABELS[value],
  }));

  // Only admins can create tasks
  const canCreateTask = user?.role === ROLES.ADMIN;
  
  if (loading) {
    return <Loader fullPage size="lg" />;
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">{tasks?.length || 0} total tasks</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filters
          </Button>
          {canCreateTask && (
            <Link to="/tasks/new">
              <Button variant="primary">
                <Plus size={20} />
                New Task
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
            <div className="flex items-end">
              <Button variant="ghost" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Tasks List */}
      {tasks?.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tasks found</p>
            {canCreateTask && (
              <Link to="/tasks/new">
                <Button variant="primary" className="mt-4">
                  Create your first task
                </Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tasks?.map((task) => {
            const overdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'completed';
            
            return (
              <Link key={task._id} to={`/tasks/${task._id}`}>
                <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${overdue ? 'border-l-4 border-red-500' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {task.title}
                        </h3>
                        {overdue && (
                          <Badge variant="bg-red-100 text-red-800" text="Overdue" />
                        )}
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant={TASK_STATUS_COLORS[task.status]} text={task.status} />
                        <Badge variant={PRIORITY_COLORS[task.priority]} text={task.priority} />
                        {task.projectId && (
                          <Badge variant="bg-blue-100 text-blue-800" text={task.projectId.name} />
                        )}
                        {task.dueDate && (
                          <span className="text-xs text-gray-600">
                            Due: {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Assigned User */}
                    {task.assignedTo && (
                      <div className="flex items-center gap-2 ml-4">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {task.assignedTo.firstName?.charAt(0)}{task.assignedTo.lastName?.charAt(0)}
                        </div>
                        <div className="hidden md:block">
                          <p className="text-sm font-medium text-gray-900">
                            {task.assignedTo.firstName} {task.assignedTo.lastName}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
