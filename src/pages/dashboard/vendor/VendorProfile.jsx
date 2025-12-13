import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { User, Mail, Calendar, Shield, AlertCircle } from 'lucide-react';

const VendorProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Vendor Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <img
              src={
                user?.photoURL ||
                `https://ui-avatars.com/api/?name=${user?.displayName}&background=3b82f6&color=fff&size=200`
              }
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-blue-500 object-cover"
            />
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold text-gray-800">{user?.displayName}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
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
              <p className="text-lg font-semibold text-gray-800 capitalize">{user?.role}</p>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-500 mb-1">
                <Calendar className="w-4 h-4 mr-2" />
                Member Since
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

            {/* Fraud Warning */}
            {user?.isFraud && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">Account Marked as Fraud</p>
                  <p className="text-sm text-red-600 mt-1">
                    Your account has been restricted. You cannot add or update tickets.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;