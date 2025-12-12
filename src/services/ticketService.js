import api from './api';

export const ticketService = {
  // Get all approved tickets with filters
  getAllTickets: async (params = {}) => {
    const response = await api.get('/tickets', { params });
    return response.data;
  },

  // Get latest tickets
  getLatestTickets: async (limit = 6) => {
    const response = await api.get('/tickets/latest', { params: { limit } });
    return response.data;
  },

  // Get advertised tickets
  getAdvertisedTickets: async () => {
    const response = await api.get('/tickets/advertised');
    return response.data;
  },

  // Get single ticket
  getTicketById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  // Get vendor's own tickets
  getMyTickets: async () => {
    const response = await api.get('/tickets/vendor/my-tickets');
    return response.data;
  },

  // Create ticket (Vendor)
  createTicket: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  // Update ticket (Vendor)
  updateTicket: async (id, ticketData) => {
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  },

  // Delete ticket (Vendor)
  deleteTicket: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },

  // Admin: Get all tickets
  getAllTicketsForAdmin: async () => {
    const response = await api.get('/tickets/admin/all');
    return response.data;
  },

  // Admin: Approve ticket
  approveTicket: async (id) => {
    const response = await api.put(`/tickets/${id}/approve`);
    return response.data;
  },

  // Admin: Reject ticket
  rejectTicket: async (id) => {
    const response = await api.put(`/tickets/${id}/reject`);
    return response.data;
  },

  // Admin: Toggle advertise
  toggleAdvertiseTicket: async (id) => {
    const response = await api.put(`/tickets/${id}/advertise`);
    return response.data;
  },
};