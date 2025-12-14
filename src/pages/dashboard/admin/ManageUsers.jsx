import React, { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';
import toast from 'react-hot-toast';
import {
  Loader2,
  Shield,
  Store,
  AlertTriangle,
  CheckCircle,
  User as UserIcon,
} from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await userService.getUserStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleMakeAdmin = async (userId) => {
    if (!window.confirm('Are you sure you want to make this user an admin?')) {
      return;
    }

    setActionLoading(userId);
    try {
      await userService.makeUserAdmin(userId);
      toast.success('User promoted to admin');
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to make admin');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMakeVendor = async (userId) => {
    if (!window.confirm('Are you sure you want to make this user a vendor?')) {
      return;
    }

    setActionLoading(userId);
    try {
      await userService.makeUserVendor(userId);
      toast.success('User promoted to vendor');
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to make vendor');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkFraud = async (userId) => {
    if (!window.confirm('Are you sure you want to mark this vendor as fraud? All their tickets will be hidden.')) {
      return;
    }

    setActionLoading(userId);
    try {
      await userService.markVendorAsFraud(userId);
      toast.success('Vendor marked as fraud');
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark as fraud');
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </span>
        );
      case 'vendor':
        return (
          <span className="flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
            <Store className="w-3 h-3 mr-1" />
            Vendor
          </span>
        );
      default:
        return (
          <span className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
            <UserIcon className="w-3 h-3 mr-1" />
            User
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Users</h1>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">Total Users</p>
            <p className="text-2xl font-bold text-blue-700">{stats.totalUsers}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-purple-600 font-medium">Vendors</p>
            <p className="text-2xl font-bold text-purple-700">{stats.totalVendors}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-sm text-red-600 font-medium">Admins</p>
            <p className="text-2xl font-bold text-red-700">{stats.totalAdmins}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <p className="text-sm text-orange-600 font-medium">Fraud Vendors</p>
            <p className="text-2xl font-bold text-orange-700">{stats.fraudVendors}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4">
                    {user.isFraud && (
                      <span className="flex items-center text-orange-600 text-sm font-medium">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Fraud
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {user.role === 'user' && (
                        <>
                          <button
                            onClick={() => handleMakeAdmin(user._id)}
                            disabled={actionLoading === user._id}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition disabled:opacity-50"
                          >
                            {actionLoading === user._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Make Admin'}
                          </button>
                          <button
                            onClick={() => handleMakeVendor(user._id)}
                            disabled={actionLoading === user._id}
                            className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                          >
                            Make Vendor
                          </button>
                        </>
                      )}
                      {user.role === 'vendor' && !user.isFraud && (
                        <button
                          onClick={() => handleMarkFraud(user._id)}
                          disabled={actionLoading === user._id}
                          className="px-3 py-1 bg-orange-600 text-white rounded text-xs font-semibold hover:bg-orange-700 transition disabled:opacity-50"
                        >
                          Mark Fraud
                        </button>
                      )}
                      {user.role === 'admin' && <span className="text-xs text-gray-500">Protected</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-gray-200">
          {users.map((user) => (
            <div key={user._id} className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getRoleBadge(user.role)}
                {user.isFraud && (
                  <span className="flex items-center text-orange-600 text-xs font-medium">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Fraud
                  </span>
                )}
              </div>

              {user.role === 'user' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMakeAdmin(user._id)}
                    disabled={actionLoading === user._id}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
                  >
                    Make Admin
                  </button>
                  <button
                    onClick={() => handleMakeVendor(user._id)}
                    disabled={actionLoading === user._id}
                    className="flex-1 px-3 py-2 bg-purple-600 text-white rounded text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    Make Vendor
                  </button>
                </div>
              )}
              {user.role === 'vendor' && !user.isFraud && (
                <button
                  onClick={() => handleMarkFraud(user._id)}
                  disabled={actionLoading === user._id}
                  className="w-full px-3 py-2 bg-orange-600 text-white rounded text-sm font-semibold hover:bg-orange-700 transition disabled:opacity-50"
                >
                  Mark as Fraud
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;