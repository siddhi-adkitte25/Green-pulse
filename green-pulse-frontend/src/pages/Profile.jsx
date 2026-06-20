import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const result = await updateProfile(profileData);
    if (result.success) {
      setMessage('Profile updated successfully!');
    } else {
      setError(result.error);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Password update logic would go here
    setMessage('Password update feature coming soon!');
    setPasswordData({ currentPassword: '', newPassword: '' });
  };

  if (!user) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          Please log in to view your profile.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="text-center mb-4">
            <h2 className="text-success">👤 Your Profile</h2>
            <p className="text-muted">Manage your account settings and preferences</p>
          </div>

          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Tabs defaultActiveKey="profile" className="mb-3">
            <Tab eventKey="profile" title="Profile Information">
              <Card>
                <Card.Body>
                  <Form onSubmit={handleProfileUpdate}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            placeholder="Enter your full name"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            value={user.email}
                            disabled
                            className="bg-light"
                          />
                          <Form.Text className="text-muted">
                            Email cannot be changed
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control
                        type="tel"
                        value={profileData.mobile}
                        onChange={(e) => setProfileData({...profileData, mobile: e.target.value})}
                        placeholder="Enter your mobile number"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Account Type</Form.Label>
                      <Form.Control
                        type="text"
                        value={user.role}
                        disabled
                        className="bg-light"
                      />
                    </Form.Group>

                    <Button variant="success" type="submit">
                      Update Profile
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="security" title="Security">
              <Card>
                <Card.Body>
                  <Form onSubmit={handlePasswordUpdate}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        placeholder="Enter current password"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        placeholder="Enter new password"
                      />
                    </Form.Group>

                    <Button variant="success" type="submit">
                      Update Password
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="info" title="Account Info">
              <Card>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Member Since:</strong></p>
                      <p><strong>User ID:</strong></p>
                      <p><strong>Status:</strong></p>
                    </Col>
                    <Col md={6}>
                      <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                      <p>{user.userId}</p>
                      <p>
                        <span className="badge bg-success">Active</span>
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;