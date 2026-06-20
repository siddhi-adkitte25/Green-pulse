// src/components/events/EventList.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Button, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventCard from './EventCard';
import EventForm from './EventForm';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';


const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchUserRegistrations();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      const response = await api.get('/registrations/my-registrations');
      setRegistrations(response.data.map(reg => reg.eventId));
    } catch (error) {
      console.error('Failed to fetch registrations');
    }
  };

  const handleRegister = async (eventId) => {
    if (!user) {
      setError('Please login to register for events');
      return;
    }

    try {
      await api.post('/registrations/register', { eventId });
      setRegistrations([...registrations, eventId]);
    } catch (error) {
      setError(error.response?.data || 'Registration failed');
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      await api.delete(`/registrations/event/${eventId}`);
      setRegistrations(registrations.filter(id => id !== eventId));
    } catch (error) {
      setError(error.response?.data || 'Unregistration failed');
    }
  };

  const isRegistered = (eventId) => {
    return registrations.includes(eventId);
  };

  // Admin: Delete event
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${eventId}`);
      setEvents(events.filter(e => e.eventId !== eventId));
      toast.success('Event deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || 'Failed to delete event';
      setError(errorMsg);
      toast.error(`Error: ${errorMsg}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Error deleting event:', error);
    }
  };

  // Admin: Edit event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  // Admin: Create event
  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  // After form submit (create or edit)
  const handleFormSuccess = (savedEvent, isEdit) => {
    setShowForm(false);
    setEditingEvent(null);
    if (isEdit) {
      setEvents(events.map(e => (e.eventId === savedEvent.eventId ? savedEvent : e)));
    } else {
      setEvents([savedEvent, ...events]);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="mt-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success">🌍 Upcoming Events</h2>
        {user?.role === 'ADMIN' && (
          <Button variant="success" onClick={handleCreateEvent}>
            + Create Event
          </Button>
        )}
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      {events.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">No events scheduled yet</h4>
          <p className="text-muted">Check back later for upcoming environmental events!</p>
        </div>
      ) : (
        <Row>
          {events.map(event => (
            <Col key={event.eventId} md={6} lg={4} className="mb-4">
              <EventCard
                event={event}
                onRegister={handleRegister}
                onUnregister={handleUnregister}
                isRegistered={isRegistered(event.eventId)}
                onEdit={user?.role === 'ADMIN' ? handleEditEvent : undefined}
                onDelete={user?.role === 'ADMIN' ? handleDeleteEvent : undefined}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Admin Event Form Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingEvent ? 'Edit Event' : 'Create Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventForm
            event={editingEvent}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EventList; // Default export