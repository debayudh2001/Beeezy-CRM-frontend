import { useSelector } from 'react-redux';
import { User, Mail, Briefcase, IdCard } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { ROLE_LABELS, SERVICE_TYPE_LABELS } from '../utils/constants';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  
  if (!user) return null;
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      
      <Card>
        <div className="space-y-6">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <Badge
                variant="bg-primary-100 text-primary-800"
                text={ROLE_LABELS[user.role]}
              />
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 space-y-4">
            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
            
            {/* Role */}
            <div className="flex items-center gap-3">
              <User size={20} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-medium text-gray-900 capitalize">{ROLE_LABELS[user.role]}</p>
              </div>
            </div>
            
            {/* Department */}
            {user.department && (
              <div className="flex items-center gap-3">
                <Briefcase size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium text-gray-900 capitalize">{SERVICE_TYPE_LABELS[user.department]}</p>
                </div>
              </div>
            )}

            {/* Job Profile */}
            {user.jobProfile && (
              <div className="flex items-center gap-3">
                <IdCard size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Job Profile</p>
                  <p className="font-medium text-gray-900 capitalize">{user.jobProfile}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
