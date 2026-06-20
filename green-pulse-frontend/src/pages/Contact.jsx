import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import { contactService } from '../services/contact';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Admin view state
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fetch admin contacts
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const data = await contactService.getAllContacts();
      setContacts(data || []);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast.error('Failed to load contact submissions');
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await contactService.submitContact(formData);
      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      toast.success('Thank you! Your message has been sent successfully.');
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      setError('Failed to send message. Please try again.');
      toast.error('Failed to send message');
    }
  };

  return (
    <Container className="mt-4">
      <ToastContainer />
      
      {/* Admin View - Only Table */}
      {user?.role === 'ADMIN' ? (
        <div>
          <div className="mb-4">
            <h2 className="text-success">📋 Contact Submissions</h2>
          </div>

          <Card className="shadow">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">All Contact Messages</h5>
            </Card.Header>
            <Card.Body>
              {loadingContacts ? (
                <LoadingSpinner />
              ) : contacts.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <p>No contact submissions yet</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover striped>
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map(contact => (
                        <tr key={contact.id}>
                          <td>{contact.name}</td>
                          <td>{contact.email}</td>
                          <td>{contact.subject}</td>
                          <td className="text-truncate" style={{ maxWidth: '200px' }} title={contact.message}>
                            {contact.message}
                          </td>
                          <td>{contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      ) : (
        /* User View - Only Form */
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="text-center mb-5">
              <h2 className="text-success">📞 Contact Us</h2>
              <p className="text-muted">
                Have questions or suggestions? We'd love to hear from you.
              </p>
            </div>

            {showSuccess && (
              <Alert variant="success" className="text-center">
                Thank you for your message! We'll get back to you soon. 🌟
              </Alert>
            )}

            {error && (
              <Alert variant="danger" onClose={() => setError('')} dismissible>
                {error}
              </Alert>
            )}

            <Card className="shadow">
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Enter your email"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What is this regarding?"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us more about your inquiry..."
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button variant="success" size="lg" type="submit">
                      Send Message
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Contact Info */}
            <Row className="mt-5">
              <Col md={4} className="text-center mb-3">
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <div className="display-6 text-success">📧</div>
                    <h6>Email Us</h6>
                    <p className="text-muted small">contact@greenpulse.com</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="text-center mb-3">
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <div className="display-6 text-success">📞</div>
                    <h6>Call Us</h6>
                    <p className="text-muted small">+91 98765 43210</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="text-center mb-3">
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <div className="display-6 text-success">🏢</div>
                    <h6>Visit Us</h6>
                    <p className="text-muted small">Mumbai, India</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Contact;