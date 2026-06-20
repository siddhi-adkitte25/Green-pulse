import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaBell, FaPlus } from 'react-icons/fa';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications/public');
      setNotifications(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/notifications/${id}`);
      fetchNotifications();
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notifications', { title, message, type: 'GENERAL', isPublic: true });
      setTitle('');
      setMessage('');
      setShowForm(false);
      fetchNotifications();
      toast.success('Notification created');
    } catch (error) {
      toast.error('Failed to create notification');
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2><FaBell className="me-2" />Notifications</h2>
            {user?.role === 'ADMIN' && (
              <Button variant="success" onClick={() => setShowForm(true)}>
                <FaPlus className="me-1" />Add Notification
              </Button>
            )}
          </div>
        </Col>
      </Row>



      <Row>
        {notifications.length === 0 ? (
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <h5>No notifications yet</h5>
                <p className="text-muted">Check back later for updates!</p>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          notifications.map(notification => (
            <Col key={notification.notificationId} xs={12} className="mb-2">
              <Card>
                <Card.Body className="py-2">
                  <Row className="align-items-center">
                    <Col xs={9}>
                      <div className="d-flex align-items-center">
                        <span className="text-muted me-3">
                          {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString()}
                        </span>
                        <strong className="me-3">Title: {  notification.title}</strong>
                        <span className="text-muted"> Massage: {notification.message}</span>
                      </div>
                    </Col>
                    <Col xs={3} className="text-end">
                      {user?.role === 'ADMIN' && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.notificationId)}
                        >
                          Delete
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateNotification}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button variant="success" type="submit">
                Create
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Notifications;