import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLeaf, FaSignOutAlt } from 'react-icons/fa';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="success" variant="dark" expand="lg" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <FaLeaf className="me-2" style={{ color: '#fff' }} />Green Pulse
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {user?.role === 'ADMIN' ? (
              <>
                <Nav.Link as={Link} to="/admin" className="text-warning">
                  Admin Panel
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/volunteers">Volunteers</Nav.Link>
                <Nav.Link as={Link} to="/events">Events</Nav.Link>
                <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>
                <Nav.Link as={Link} to="/notifications">Notifications</Nav.Link>
                <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/events">Events</Nav.Link>
                <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>
                <Nav.Link as={Link} to="/donations">Donations</Nav.Link>
                <Nav.Link as={Link} to="/notifications">Notifications</Nav.Link>
                <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile" className="text-light">
                  👋 Hello, {user.name}
                </Nav.Link>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  <FaSignOutAlt className="me-1" />Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  className="me-2"
                  as={Link}
                  to="/login"
                >
                  Login
                </Button>
                <Button 
                  variant="light" 
                  size="sm"
                  as={Link}
                  to="/register"
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;