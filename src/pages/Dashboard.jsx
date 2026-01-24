import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects } from '../features/projects/projectsSlice';
import { fetchTasks } from '../features/tasks/tasksSlice';
import { LayoutDashboard, FolderKanban, CheckSquare, AlertCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import { ROLES, PROJECT_STATUS_COLORS, TASK_STATUS_COLORS } from '../utils/constants';
import { formatDate, isOverdue } from '../utils/helpers';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { projects, loading: projectsLoading } = useSelector((state) => state.projects);
  const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);
  
  useEffect(() => {
    dispatch(fetchProjects({}));
    dispatch(fetchTasks({}));
  }, [dispatch]);
  
  // Calculate statistics
  const activeProjects = projects?.filter(p => p.status !== 'completed') || [];
  const overdueTasks = tasks?.filter(t => t.dueDate && isOverdue(t.dueDate) && t.status !== 'completed') || [];
  const myTasks = tasks?.filter(t => t.assignedTo?._id === (user?._id || user?.id)) || [];
  
  const stats = [
    {
      title: 'Total Projects',
      value: projects?.length || 0,
      icon: FolderKanban,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Projects',
      value: activeProjects.length,
      icon: LayoutDashboard,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: user?.role === ROLES.CLIENT ? 'Total Tasks' : 'My Tasks',
      value: user?.role === ROLES.CLIENT ? (tasks?.length || 0) : myTasks.length,
      icon: CheckSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Overdue Tasks',
      value: overdueTasks.length,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];
  
  const recentProjects = projects?.slice(0, 5) || [];
  const upcomingTasks = tasks?.filter(t => t.dueDate && !isOverdue(t.dueDate))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5) || [];
  
  if (projectsLoading || tasksLoading) {
    return <Loader fullPage size="lg" />;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.firstName}!</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-full`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card title="Recent Projects">
          {recentProjects.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{project.description}</p>
                    </div>
                    <Badge variant={PROJECT_STATUS_COLORS[project.status]} text={project.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
        
        {/* Upcoming Tasks */}
        <Card title="Upcoming Tasks">
          {upcomingTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming tasks</p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <Link
                  key={task._id}
                  to={`/tasks/${task._id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      {task.projectId && (
                        <p className="text-xs text-gray-500 mt-1">{task.projectId.name}</p>
                      )}
                      {task.dueDate && (
                        <p className="text-xs text-gray-600 mt-1">Due: {formatDate(task.dueDate)}</p>
                      )}
                    </div>
                    <Badge variant={TASK_STATUS_COLORS[task.status]} text={task.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
