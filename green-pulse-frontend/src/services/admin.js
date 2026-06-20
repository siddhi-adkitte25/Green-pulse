import api from './api';

// Create a safe request wrapper that won't trigger logout on 401
const safeRequest = async (url) => {
  try {
    const res = await api.get(url);
    return { data: res.data || [] };
  } catch (error) {
    // Silently catch errors including 401, return empty data
    // This prevents dashboard from causing logout if user lacks permissions
    console.warn(`Dashboard endpoint ${url} failed:`, error.message);
    return { data: [] };
  }
};

export const adminService = {
  getDashboardStats: async () => {
    try {
      // Fetch data from database via backend APIs using safe requests
      const [usersRes, volunteersRes, donationsRes, eventsRes, upcomingRes, recentDonationsRes] = await Promise.all([
        safeRequest('/users'),
        safeRequest('/volunteers'),
        safeRequest('/donations'),
        safeRequest('/events'),
        safeRequest('/events/upcoming'),
        safeRequest('/donations?limit=4&sort=date&order=desc')
      ]);

      const users = usersRes.data || [];
      const volunteers = volunteersRes.data || [];
      const donations = donationsRes.data || [];
      const events = eventsRes.data || [];
      const upcomingEvents = upcomingRes.data || [];
      const recentDonations = recentDonationsRes.data || [];

      // Calculate statistics from real database data
      const totalDonationAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
      const averageDonation = donations.length > 0 ? Math.round(totalDonationAmount / donations.length) : 0;
      const completedEvents = events.filter(e => new Date(e.date) < new Date()).length;
      const totalParticipants = events.reduce((sum, e) => sum + (e.participants || 0), 0);
      const activeUsers = users.filter(u => u.isActive !== false).length;

      return {
        totalVolunteers: volunteers.length,
        totalDonations: donations.length,
        totalDonationAmount: totalDonationAmount,
        totalEvents: events.length,
        activeUsers: activeUsers,
        completedEvents: completedEvents,
        totalParticipants: totalParticipants,
        averageDonation: averageDonation,
        upcomingEvents: upcomingEvents.slice(0, 3),
        recentDonations: recentDonations.slice(0, 4)
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getVolunteers: async () => {
    const response = await api.get('/volunteers');
    return response.data;
  },

  getDonations: async () => {
    const response = await api.get('/donations');
    return response.data;
  },

  getEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  getUpcomingEvents: async () => {
    const response = await api.get('/events/upcoming');
    return response.data;
  }
};
