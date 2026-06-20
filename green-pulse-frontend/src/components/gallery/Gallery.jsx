import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const GalleryGrid = ({ images, onImageClick, onDelete, isAdmin }) => {
  return (
    <Row>
      {images.map((img) => (
        <Col md={4} lg={3} className="mb-4" key={img.id}>
          <Card className="h-100 shadow-sm hover-shadow gallery-item" style={{ cursor: 'pointer' }}>
            <div className="position-relative gallery-grid-item">
              <Card.Img
                variant="top"
                src={img.url || img.photo || img.link}
                alt={img.title || img.caption || `Gallery image ${img.id}`}
                style={{ height: '200px', objectFit: 'cover' }}
                onClick={() => onImageClick(img)}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200/28a745/ffffff?text=Image+Not+Found';
                }}
              />
              {isAdmin && (
                <button
                  className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 admin-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(img.id);
                  }}
                  title="Delete image"
                  style={{ border: 'none', borderRadius: '50%', width: '32px', height: '32px' }}
                >
                  🗑️
                </button>
              )}
            </div>
            {(img.title || img.caption) && (
              <Card.Body className="p-2">
                {img.title && <Card.Title className="h6 mb-1">{img.title}</Card.Title>}
                {img.caption && <Card.Text className="small text-muted mb-0">{img.caption}</Card.Text>}
              </Card.Body>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default GalleryGrid;