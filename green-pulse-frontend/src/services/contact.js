import api from './api';

export const contactService = {
  // Submit a contact form
  submitContact: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  // Get all contact submissions (admin only)
  getAllContacts: async () => {
    const response = await api.get('/contact');
    return response.data;
  },

  // Delete a contact submission (admin only)
  deleteContact: async (contactId) => {
    const response = await api.delete(`/contact/${contactId}`);
    return response.data;
  },

  // Mark contact as read/replied (admin only)
  updateContact: async (contactId, data) => {
    const response = await api.put(`/contact/${contactId}`, data);
    return response.data;
  }
};
