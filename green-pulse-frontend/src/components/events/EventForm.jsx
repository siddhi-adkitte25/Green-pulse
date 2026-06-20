import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../../services/api';

const EventForm = ({ event, onSuccess, onCancel }) => {
	const isEdit = !!event;
	const [title, setTitle] = useState(event?.title || '');
	const [description, setDescription] = useState(event?.description || '');
	const [date, setDate] = useState(event?.date ? event.date.slice(0, 16) : ''); // ISO string for datetime-local
	const [venue, setVenue] = useState(event?.venue || '');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			const payload = {
				title,
				description,
				date,
				venue
			};
			let response;
			if (isEdit) {
				response = await api.put(`/events/${event.eventId}`, payload);
			} else {
				response = await api.post('/events', payload);
			}
			onSuccess(response.data, isEdit);
		} catch (err) {
			setError(err.response?.data || 'Failed to save event');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			{error && <Alert variant="danger">{error}</Alert>}
			<Form.Group className="mb-3" controlId="eventTitle">
				<Form.Label>Title</Form.Label>
				<Form.Control
					type="text"
					value={title}
					onChange={e => setTitle(e.target.value)}
					required
				/>
			</Form.Group>
			<Form.Group className="mb-3" controlId="eventDescription">
				<Form.Label>Description</Form.Label>
				<Form.Control
					as="textarea"
					rows={3}
					value={description}
					onChange={e => setDescription(e.target.value)}
					required
				/>
			</Form.Group>
			<Form.Group className="mb-3" controlId="eventDate">
				<Form.Label>Date & Time</Form.Label>
				<Form.Control
					type="datetime-local"
					value={date}
					onChange={e => setDate(e.target.value)}
					required
				/>
			</Form.Group>
			<Form.Group className="mb-3" controlId="eventVenue">
				<Form.Label>Venue</Form.Label>
				<Form.Control
					type="text"
					value={venue}
					onChange={e => setVenue(e.target.value)}
					required
				/>
			</Form.Group>
			<div className="d-flex justify-content-end gap-2">
				<Button variant="secondary" onClick={onCancel} disabled={loading} type="button">
					Cancel
				</Button>
				<Button variant="success" type="submit" disabled={loading}>
					{isEdit ? 'Update Event' : 'Create Event'}
				</Button>
			</div>
		</Form>
	);
};

export default EventForm;
