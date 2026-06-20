import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-success text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                🌿 Welcome to Green Pulse
              </h1>
              <p className="lead mb-4">
                Join our community of environmental enthusiasts. Participate in events, 
                make donations, and help create a sustainable future for our planet.
              </p>
              {!user ? (
                <div>
                  <Button 
                    as={Link} 
                    to="/register" 
                    variant="light" 
                    size="lg" 
                    className="me-3"
                  >
                    Join Now
                  </Button>
                  <Button 
                    as={Link} 
                    to="/events" 
                    variant="outline-light" 
                    size="lg"
                  >
                    View Events
                  </Button>
                </div>
              ) : (
                <Button 
                  as={Link} 
                  to="/events" 
                  variant="light" 
                  size="lg"
                >
                  Explore Events
                </Button>
              )}
            </Col>
            <Col lg={6} className="text-center">
              <div className="display-1">🌍</div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="text-success">How You Can Make a Difference</h2>
            <p className="text-muted">Join us in our mission to protect the environment</p>
          </Col>
        </Row>

        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="display-6 mb-3">📅</div>
                <Card.Title>Join Events</Card.Title>
                <Card.Text>
                  Participate in beach cleanups, tree plantations, and environmental awareness campaigns.
                </Card.Text>
                <Button as={Link} to="/events" variant="outline-success">
                  View Events
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="display-6 mb-3">💰</div>
                <Card.Title>Make Donations</Card.Title>
                <Card.Text>
                  Support our environmental initiatives through donations. Every contribution helps.
                </Card.Text>
                <Button as={Link} to="/donations" variant="outline-success">
                  Donate Now
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="display-6 mb-3">🌱</div>
                <Card.Title>Get Involved</Card.Title>
                <Card.Text>
                  Become part of our growing community dedicated to environmental conservation.
                </Card.Text>
                <Button as={Link} to="/register" variant="outline-success">
                  Join Community
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Stats Section */}
      <div className="bg-light py-5">
        <Container>
          <Row className="text-center">
            <Col md={3} className="mb-3">
              <h3 className="text-success fw-bold">100+</h3>
              <p className="text-muted">Events Organized</p>
            </Col>
            <Col md={3} className="mb-3">
              <h3 className="text-success fw-bold">500+</h3>
              <p className="text-muted">Active Volunteers</p>
            </Col>
            <Col md={3} className="mb-3">
              <h3 className="text-success fw-bold">1000+</h3>
              <p className="text-muted">Trees Planted</p>
            </Col>
            <Col md={3} className="mb-3">
              <h3 className="text-success fw-bold">50+</h3>
              <p className="text-muted">Beaches Cleaned</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;