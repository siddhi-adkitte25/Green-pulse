// src/components/events/EventCard.jsx
import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const EventCard = ({ event, onRegister, onUnregister, isRegistered, onEdit, onDelete }) => {
  const { user } = useAuth();
  const eventDate = new Date(event.date).toLocaleDateString();
  const eventTime = new Date(event.date).toLocaleTimeString();

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg="success" className="mb-2">
            {eventDate} at {eventTime}
          </Badge>
        </div>

        <Card.Title className="text-success">{event.title}</Card.Title>
        <Card.Text className="text-muted flex-grow-1">
          {event.description}
        </Card.Text>

        <div className="mt-auto">
          <Card.Text>
            <strong>📍 Venue:</strong> {event.venue}
          </Card.Text>
          <Card.Text className="text-muted small">
            Created by: {event.createdByName}
          </Card.Text>

          {user && user.role === 'ADMIN' && (
            <div className="d-flex gap-2 mb-2">
              <Button variant="outline-primary" size="sm" onClick={() => onEdit && onEdit(event)}>
                Edit
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => onDelete && onDelete(event.eventId)}>
                Delete
              </Button>
            </div>
          )}

          {user && user.role !== 'ADMIN' && (
            <div className="d-grid gap-2">
              {isRegistered ? (
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => onUnregister(event.eventId)}
                >
                  Unregister
                </Button>
              ) : (
                <Button 
                  variant="success" 
                  size="sm"
                  onClick={() => onRegister(event.eventId)}
                >
                  Register for Event
                </Button>
              )}
            </div>
          )}

          {!user && (
            <Button 
              variant="outline-success" 
              size="sm" 
              className="w-100"
              disabled
            >
              Login to Register
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default EventCard; // Default export