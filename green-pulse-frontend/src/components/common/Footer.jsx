// src/components/common/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={6}>
            <h5>🌿 Green Pulse</h5>
            <p className="mb-0">
              Making the world greener, one event at a time. Join our environmental community today!
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0">
              &copy; 2024 Green Pulse. All rights reserved.
            </p>
            <p className="mb-0">
              🌍 Together for a better planet
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; // Default export