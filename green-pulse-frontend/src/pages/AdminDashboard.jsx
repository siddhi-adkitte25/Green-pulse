import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/admin';
import { FaUsers, FaHandsHelping, FaMoneyBillWave, FaCalendar, FaTrophy, FaChartLine, FaSync, FaLeaf } from 'react-icons/fa';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    fetchDashboardStats();
  }, [user, navigate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load dashboard statistics';
      setError(errorMessage);
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" role="status" variant="success">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="mb-2">
            <Link to="/admin" className="text-decoration-none text-dark">
              <span className="fw-bold text-success">
                <FaLeaf className="me-2" />Green Pulse
              </span>
            </Link>
          </h1>
          <p className="text-muted">Welcome to the Green Pulse Admin Panel</p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="outline-success" 
            size="sm"
            onClick={fetchDashboardStats}
            disabled={loading}
          >
            <FaSync className={`me-2 ${loading ? 'spinner' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row className="g-4 mb-5">
        {/* Total Volunteers Card */}
        <Col xs={12} sm={6} lg={4}>
          <Card className="stat-card shadow-sm border-0 h-100">
            <Card.Body className="d-flex flex-column align-items-center text-center">
              <div className="stat-icon stat-icon-volunteers"><FaHandsHelping /></div>
              <div className="stat-number text-info">{stats?.totalVolunteers || 0}</div>
              <div className="stat-label">Total Volunteers</div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Donations Card */}
        <Col xs={12} sm={6} lg={4}>
          <Card className="stat-card shadow-sm border-0 h-100">
            <Card.Body className="d-flex flex-column align-items-center text-center">
              <div className="stat-icon stat-icon-donations"><FaMoneyBillWave /></div>
              <div className="stat-number text-warning">{stats?.totalDonations || 0}</div>
              <div className="stat-label">Total Donations</div>
              <div className="stat-amount">₹{stats?.totalDonationAmount?.toLocaleString() || 0}</div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Events Card */}
        <Col xs={12} sm={6} lg={4}>
          <Card className="stat-card shadow-sm border-0 h-100">
            <Card.Body className="d-flex flex-column align-items-center text-center">
              <div className="stat-icon stat-icon-events"><FaCalendar /></div>
              <div className="stat-number text-danger">{stats?.totalEvents || 0}</div>
              <div className="stat-label">Total Events</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-5">
        {/* Upcoming Events Card */}
        <Col lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0"><FaCalendar className="me-2" />Upcoming Events ({stats?.upcomingEvents?.length || 0})</h5>
            </Card.Header>
            <Card.Body>
              {stats?.upcomingEvents && stats.upcomingEvents.length > 0 ? (
                <div className="event-list">
                  {stats.upcomingEvents.map((event) => (
                    <div key={event.id} className="event-item border-bottom pb-3 mb-3">
                      <h6 className="fw-bold mb-1">{event.title}</h6>
                      <p className="text-muted small mb-1">
                        📅 {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-muted small mb-1">
                        👥 {event.participants || 0} participants
                      </p>
                      <span className="badge bg-info">{event.category || 'Event'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-3">No upcoming events scheduled</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Donations Card */}
        <Col lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0"><FaMoneyBillWave className="me-2" />Recent Donations ({stats?.recentDonations?.length || 0})</h5>
            </Card.Header>
            <Card.Body>
              {stats?.recentDonations && stats.recentDonations.length > 0 ? (
                <div className="donation-list">
                  {stats.recentDonations.map((donation) => {
                    const donorName = donation.donorName || donation.userName || donation.donor || 'Anonymous';
                    const donorEmail = donation.donorEmail || donation.userEmail || donation.email || '';
                    const dateValue = donation.date || donation.donatedAt || donation.createdAt || donation.timestamp;
                    let dateText = 'N/A';
                    if (dateValue) {
                      const d = new Date(dateValue);
                      dateText = isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
                    }

                    return (
                      <div key={donation.id || donation.donationId || Math.random()} className="donation-item border-bottom pb-3 mb-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="fw-bold mb-1">{donorName}</h6>
                            {donorEmail && <p className="text-muted small mb-1">📧 {donorEmail}</p>}
                            <p className="text-muted small mb-0">📅 {dateText}</p>
                          </div>
                          <span className="badge bg-success fs-6">₹{donation.amount}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted text-center py-3">No recent donations</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Statistics Overview */}
      <Row className="g-4">
        <Col lg={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-dark text-white">
              <h5 className="mb-0">📈 Quick Stats</h5>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col md={3} className="py-3 border-end">
                  <div className="stat-item">
                    <div className="stat-value text-success fw-bold">{stats?.averageDonation || 0}</div>
                    <div className="stat-title small text-muted">Avg. Donation</div>
                  </div>
                </Col>
                <Col md={3} className="py-3 border-end">
                  <div className="stat-item">
                    <div className="stat-value text-info fw-bold">{stats?.activeUsers || 0}</div>
                    <div className="stat-title small text-muted">Active Users</div>
                  </div>
                </Col>
                <Col md={3} className="py-3 border-end">
                  <div className="stat-item">
                    <div className="stat-value text-warning fw-bold">{stats?.completedEvents || 0}</div>
                    <div className="stat-title small text-muted">Completed Events</div>
                  </div>
                </Col>
                <Col md={3} className="py-3">
                  <div className="stat-item">
                    <div className="stat-value text-danger fw-bold">{stats?.totalParticipants || 0}</div>
                    <div className="stat-title small text-muted">Total Participants</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
