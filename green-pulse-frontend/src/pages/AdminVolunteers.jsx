import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaUsers } from 'react-icons/fa';

const AdminVolunteers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchVolunteers();
  }, [user, navigate]);

  const fetchVolunteers = async () => {
    try {
      const response = await api.get('/volunteers');
      setVolunteers(response.data);
    } catch (error) {
      toast.error('Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2><FaUsers className="me-2" />Manage Volunteers</h2>
        </Col>
      </Row>



      <Card>
        <Card.Body>
          {volunteers.length === 0 ? (
            <div className="text-center py-5">
              <h5>No volunteers found</h5>
            </div>
          ) : (
            <Table responsive striped>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map(volunteer => (
                  <tr key={volunteer.userId}>
                    <td>{volunteer.userId}</td>
                    <td>{volunteer.name}</td>
                    <td>{volunteer.email}</td>
                    <td>{volunteer.mobile}</td>
                    <td>{new Date(volunteer.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminVolunteers;