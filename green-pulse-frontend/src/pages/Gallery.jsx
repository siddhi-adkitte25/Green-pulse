import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Button, Form, Alert, Spinner, Carousel, Card, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import galleryService from '../services/gallery';
import { ToastContainer, toast } from 'react-toastify';
import '../styles/Gallery.css';

const Gallery = () => {
	const { user } = useAuth();
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const urlRef = useRef();
	const captionRef = useRef();

	useEffect(() => {
		fetchImages();
	}, []);

	const fetchImages = async () => {
		try {
			setLoading(true);
			const data = await galleryService.getImages();
			setImages(data || []);
		} catch (err) {
			console.error('Failed to load gallery images', err);
			toast.error(err?.response?.data?.message || err?.message || 'Failed to load images');
		} finally {
			setLoading(false);
		}
	};

	const handleUpload = async (e) => {
		e.preventDefault();
		const url = urlRef.current.value?.trim();
		const caption = captionRef.current.value?.trim();
		if (!url) return setError('Please provide image URL');

		const payload = { imageUrl: url };
		if (caption) payload.caption = caption;

		try {
			setUploading(true);
			setError(null);
			await galleryService.uploadImage(payload);
			urlRef.current.value = '';
			captionRef.current.value = '';
			setShowModal(false);
			await fetchImages();
			toast.success('Image added successfully!');
		} catch (err) {
			console.error('Upload failed', err);
			setError(err?.response?.data?.message || err?.message || 'Upload failed');
		} finally {
			setUploading(false);
		}
	};

	const handleDelete = async (id) => {
		if (!id) {
			toast.error('Invalid image ID');
			return;
		}
		if (!confirm('Delete this image?')) return;
		try {
			await galleryService.deleteImage(id);
			setImages((prev) => prev.filter((img) => img.imageId !== id));
			toast.success('Image deleted successfully');
		} catch (err) {
			console.error('Delete failed', err);
			toast.error(err?.response?.data?.message || err?.message || 'Delete failed');
		}
	};

	return (
		<Container className="py-5">
			<Row className="mb-4">
				<Col>
					<h2 className="mb-0 text-success">🖼️ Gallery</h2>
					<p className="text-muted">Explore photos from our environmental events and campaigns</p>
				</Col>
				{user?.role === 'ADMIN' && (
					<Col xs="auto">
						<Button 
							variant="success" 
							size="sm"
							onClick={() => setShowModal(true)}
						>
							➕ Add Image
						</Button>
					</Col>
				)}
			</Row>

			<ToastContainer position="top-right" autoClose={3000} />

			{loading ? (
				<div className="d-flex justify-content-center py-5">
					<Spinner animation="border" variant="success" />
					<span className="ms-2">Loading gallery...</span>
				</div>
			) : images.length === 0 ? (
				<div className="text-center py-5">
					<h4 className="text-muted mb-3">📷 No images available yet</h4>
					<p className="text-muted">Check back soon for photos from our environmental initiatives!</p>
				</div>
			) : (
				<>
					{/* Carousel View */}
					<Row className="mb-4">
						<Col>
							<Card className="shadow">
								<Card.Body className="p-0">
									<Carousel interval={5000} className="rounded">
										{images.slice(0, 10).map((img, index) => (
											<Carousel.Item key={img.imageId || `carousel-${index}`}>
												<img
													className="d-block w-100"
													src={img.imageUrl}
													alt={img.caption || `Gallery image ${img.imageId}`}
													style={{ height: '400px', objectFit: 'cover', cursor: 'pointer' }}
													onClick={() => setSelectedImage(img)}
													onError={(e) => {
														e.target.src = 'https://via.placeholder.com/800x400/28a745/ffffff?text=Image+Not+Found';
													}}
												/>
												{img.caption && (
													<Carousel.Caption className="bg-dark bg-opacity-75 rounded p-2">
														<p className="mb-0">{img.caption}</p>
													</Carousel.Caption>
												)}
												{user?.role === 'ADMIN' && (
													<Button
														variant="danger"
														size="sm"
														style={{ position: 'absolute', right: 15, top: 15 }}
														onClick={(e) => {
															e.stopPropagation();
															handleDelete(img.imageId);
														}}
														title="Delete image"
													>
														🗑️
													</Button>
												)}
											</Carousel.Item>
										))}
									</Carousel>
								</Card.Body>
							</Card>
						</Col>
					</Row>

					{/* Grid View */}
					<Row className="mb-4">
						<Col>
							<h4 className="mb-3">All Images ({images.length}) | Carousel shows 10 most recent</h4>
						</Col>
					</Row>

					<Row>
						{images.map((img, idx) => (
							<Col md={4} lg={3} className="mb-4" key={img.imageId || `gallery-img-${idx}`}>
								<Card className="h-100 shadow-sm hover-shadow" style={{ cursor: 'pointer' }}>
									<div className="position-relative">
										<Card.Img
											variant="top"
											src={img.imageUrl}
											alt={img.caption || `Gallery image ${img.imageId}`}
											style={{ height: '200px', objectFit: 'cover' }}
											onClick={() => setSelectedImage(img)}
											onError={(e) => {
												e.target.src = 'https://via.placeholder.com/300x200/28a745/ffffff?text=Image+Not+Found';
											}}
										/>
										{user?.role === 'ADMIN' && (
											<Button
												variant="danger"
												size="sm"
												className="position-absolute top-0 end-0 m-2"
												onClick={(e) => {
													e.stopPropagation();
													handleDelete(img.imageId);
												}}
												title="Delete image"
											>
												🗑️
											</Button>
										)}
									</div>
									{img.caption && (
										<Card.Body className="p-2">
											<Card.Text className="small text-muted mb-0">{img.caption}</Card.Text>
										</Card.Body>
									)}
								</Card>
							</Col>
						))}
					</Row>
				</>
			)}

			{/* Image Modal */}
			<Modal show={selectedImage !== null} onHide={() => setSelectedImage(null)} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>{selectedImage?.caption || 'Gallery Image'}</Modal.Title>
				</Modal.Header>
				<Modal.Body className="p-0">
					{selectedImage && (
						<img
							src={selectedImage.imageUrl}
							alt={selectedImage.caption || 'Gallery image'}
							className="w-100"
							style={{ maxHeight: '70vh', objectFit: 'contain' }}
							onError={(e) => {
								e.target.src = 'https://via.placeholder.com/800x600/28a745/ffffff?text=Image+Not+Found';
							}}
						/>
					)}
				</Modal.Body>
				{selectedImage?.caption && (
					<Modal.Footer>
						<p className="text-muted mb-0">{selectedImage.caption}</p>
					</Modal.Footer>
				)}
			</Modal>

			{/* Upload Modal */}
			<Modal show={showModal} onHide={() => setShowModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>📤 Add New Image</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
					<Form onSubmit={handleUpload}>
						<Form.Group className="mb-3">
							<Form.Label>Image URL *</Form.Label>
							<Form.Control 
								type="url" 
								placeholder="https://example.com/photo.jpg" 
								ref={urlRef} 
								required
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Caption</Form.Label>
							<Form.Control as="textarea" rows={2} placeholder="Short description" ref={captionRef} />
						</Form.Group>
						<div className="d-flex gap-2">
							<Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
							<Button type="submit" variant="success" disabled={uploading} className="flex-fill">
								{uploading ? (
									<>
										<Spinner animation="border" size="sm" className="me-2" />
										Uploading...
									</>
								) : (
									'📤 Add Image'
								)}
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</Container>
	);
};

export default Gallery;