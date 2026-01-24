import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { logout } from '../../features/auth/authSlice';
import { getFullName } from '../../utils/helpers';

const Navbar = ({ onMenuToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 fixed w-full z-40 top-0 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-primary-50 transition-all duration-200"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              {/* Brand Mark */}
              <img 
                src="/beeezy logos & bbrandmark/2.svg" 
                alt="Beeezy Brand Mark" 
                className="h-10 w-10 object-contain"
              />
              {/* Logo Text */}
              <img 
                src="/beeezy logos & bbrandmark/1.svg" 
                alt="Beeezy Logo" 
                className="h-15 w-auto object-contain"
              />
              <span className="text-lg font-semibold text-gray-700">CRM</span>
            </div>
          </div>
          
          {/* Right side - User menu */}
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md ring-2 ring-white group-hover:ring-primary-100 transition-all">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-gray-900">
                    {getFullName(user)}
                  </div>
                  <div className="text-xs text-gray-500 capitalize font-medium">
                    {user?.role?.replace('_', ' ')}
                  </div>
                </div>
              </button>
              
              {/* Dropdown menu */}
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{getFullName(user)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/profile');
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      <User size={16} className="text-gray-500" />
                      Profile Overview
                    </button>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
