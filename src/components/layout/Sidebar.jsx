import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Building2, X } from 'lucide-react';
import { ROLES } from '../../utils/constants';
import { cn } from '../../utils/helpers';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  
  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      roles: [ROLES.ADMIN, ROLES.TEAM_MEMBER, ROLES.CLIENT],
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: FolderKanban,
      roles: [ROLES.ADMIN, ROLES.TEAM_MEMBER, ROLES.CLIENT],
    },
    {
      name: 'Tasks',
      path: '/tasks',
      icon: CheckSquare,
      roles: [ROLES.ADMIN, ROLES.TEAM_MEMBER, ROLES.CLIENT],
    },
    {
      name: 'Organizations',
      path: '/organizations',
      icon: Building2,
      roles: [ROLES.ADMIN, ROLES.TEAM_MEMBER],
    },
    {
      name: 'Users',
      path: '/users',
      icon: Users,
      roles: [ROLES.ADMIN],
    },
    {
      name: 'Create Organization',
      path: '/organizations/create',
      icon: Building2,
      roles: [ROLES.ADMIN],
    },
  ];
  
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role)
  );
  
  const navLinkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
      isActive
        ? 'bg-primary-100 text-primary-700 font-medium'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    );
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/75 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 pt-16',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <X size={24} />
        </button>
        
        <nav className="px-4 py-6 space-y-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClass}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              end={item.path === '/'}
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
