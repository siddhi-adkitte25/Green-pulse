// src/services/payment.js
import api from './api';

export const paymentService = {
  // Create a new payment order
  createOrder: async (amount) => {
    try {
      const response = await api.post('/payments/create-order', { 
        amount: parseFloat(amount),
        currency: 'INR'
      });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error(error.response?.data || 'Failed to create payment order');
    }
  },

  // Verify payment after completion
  verifyPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/verify', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw new Error(error.response?.data || 'Payment verification failed');
    }
  },

  // Get payment status
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await api.get(`/payments/status/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw new Error('Failed to get payment status');
    }
  }
};

export default paymentService;