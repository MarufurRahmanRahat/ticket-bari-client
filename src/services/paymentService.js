import api from './api';

export const paymentService = {
  // Get Stripe config
  getStripeConfig: async () => {
    const response = await api.get('/payments/config');
    return response.data;
  },

  // Create payment intent
  createPaymentIntent: async (bookingId) => {
    const response = await api.post('/payments/create-payment-intent', {
      bookingId,
    });
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (bookingId, paymentIntentId) => {
    const response = await api.post('/payments/confirm-payment', {
      bookingId,
      paymentIntentId,
    });
    return response.data;
  },

  // Get transaction history
  getTransactionHistory: async () => {
    const response = await api.get('/payments/transactions');
    return response.data;
  },

  // Get single transaction
  getTransactionById: async (id) => {
    const response = await api.get(`/payments/transactions/${id}`);
    return response.data;
  },

  // Admin: Get all transactions
  getAllTransactions: async () => {
    const response = await api.get('/payments/admin/transactions');
    return response.data;
  },
};