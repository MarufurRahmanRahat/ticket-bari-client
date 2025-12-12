import api from './api';

export const userService = {
  // Get all users (Admin)
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Get user by ID (Admin)
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Get user statistics (Admin)
  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  // Search users (Admin)
  searchUsers: async (query) => {
    const response = await api.get('/users/search', { params: { query } });
    return response.data;
  },

  // Get users by role (Admin)
  getUsersByRole: async (role) => {
    const response = await api.get(`/users/role/${role}`);
    return response.data;
  },

  // Make user admin (Admin)
  makeUserAdmin: async (id) => {
    const response = await api.put(`/users/${id}/make-admin`);
    return response.data;
  },

  // Make user vendor (Admin)
  makeUserVendor: async (id) => {
    const response = await api.put(`/users/${id}/make-vendor`);
    return response.data;
  },

  // Mark vendor as fraud (Admin)
  markVendorAsFraud: async (id) => {
    const response = await api.put(`/users/${id}/mark-fraud`);
    return response.data;
  },

  // Unmark vendor as fraud (Admin)
  unmarkVendorAsFraud: async (id) => {
    const response = await api.put(`/users/${id}/unmark-fraud`);
    return response.data;
  },

  // Delete user (Admin)
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};