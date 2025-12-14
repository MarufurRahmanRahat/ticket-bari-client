import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { User, Mail, Calendar, Shield, Crown } from 'lucide-react';

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${user?.displayName}&background=dc2626&color=fff&size=200`
                }
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-red-500 object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-red-600 text-white p-2 rounded-full">
                <Crown className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold text-gray-800">{user?.displayName}</p>
              <p className="text-sm text-red-600 font-semibold uppercase flex items-center justify-center">
                <Shield className="w-4 h-4 mr-1" />
                {user?.role}
              </p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-500 mb-1">
                <User className="w-4 h-4 mr-2" />
                Full Name
              </label>
              <p className="text-lg font-semibold text-gray-800">{user?.displayName}</p>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-500 mb-1">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </label>
              <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-500 mb-1">
                <Shield className="w-4 h-4 mr-2" />
                Role
              </label>
              <p className="text-lg font-semibold text-red-600 uppercase">{user?.role}</p>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-500 mb-1">
                <Calendar className="w-4 h-4 mr-2" />
                Admin Since
              </label>
              <p className="text-lg font-semibold text-gray-800">
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>

            {/* Admin Privileges Card */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-red-800 mb-2 flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                Admin Privileges
              </h3>
              <ul className="space-y-1 text-sm text-red-700">
                <li>• Approve or reject vendor tickets</li>
                <li>• Manage all users and roles</li>
                <li>• Mark vendors as fraud</li>
                <li>• Advertise tickets on homepage</li>
                <li>• Full system oversight and control</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;