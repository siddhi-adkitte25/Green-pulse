import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminCreateEvent = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [participants, setParticipants] = useState(0);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const payload = { title, date, participants, category, description };
      await api.post('/events', payload);
      navigate('/events');
    } catch (err) {
      console.error('Create event failed', err);
      setError(err.response?.data?.message || err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h3>Create Event</h3>
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control value={title} onChange={e => setTitle(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="date">
          <Form.Label>Date</Form.Label>
          <Form.Control type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="participants">
          <Form.Label>Participants (expected)</Form.Label>
          <Form.Control type="number" value={participants} onChange={e => setParticipants(Number(e.target.value))} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control value={category} onChange={e => setCategory(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
        </Form.Group>
        <Button type="submit" variant="success" disabled={loading}>{loading ? 'Creating...' : 'Create Event'}</Button>
      </Form>
    </Container>
  );
};

export default AdminCreateEvent;
