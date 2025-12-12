import api from './api';

export const bookingService = {
  // Create booking (User)
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get user's bookings
  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  // Get single booking
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Cancel booking (User)
  cancelBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },

  // Get vendor's booking requests
  getVendorBookingRequests: async () => {
    const response = await api.get('/bookings/vendor/requests');
    return response.data;
  },

  // Accept booking (Vendor)
  acceptBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/accept`);
    return response.data;
  },

  // Reject booking (Vendor)
  rejectBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/reject`);
    return response.data;
  },

  // Get vendor revenue
  getVendorRevenue: async () => {
    const response = await api.get('/bookings/vendor/revenue');
    return response.data;
  },

  // Admin: Get all bookings
  getAllBookings: async () => {
    const response = await api.get('/bookings/admin/all');
    return response.data;
  },
};