// src/pages/Donations.jsx (Updated for Mock Payments)
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { paymentService } from '../services/payment';

const Donations = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [paymentMode, setPaymentMode] = useState('mock'); // 'mock' or 'razorpay'
  
  const { user } = useAuth();

  const navigate = useNavigate();

  // If logged in user is admin, redirect to admin dashboard (donations are user-only)
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchRecentDonations();
    // No need to load Razorpay SDK for mock payments
  }, []);

  const fetchRecentDonations = async () => {
    try {
      const response = await api.get('/donations');
      const successfulDonations = response.data
        .filter(donation => donation.paymentStatus === 'SUCCESS')
        .slice(0, 5);
      setRecentDonations(successfulDonations);
    } catch (error) {
      console.error('Failed to fetch recent donations:', error);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) < 1) {
      setError('Minimum donation amount is ₹1');
      return;
    }

    setLoading(true);
    try {
      console.log('Creating mock order for amount:', amount);
      // For test/mock payments we don't need backend order creation and this
      // allows anonymous users (not logged in) to donate without authentication.
      if (paymentMode === 'mock') {
        const localOrder = {
          orderId: 'mock_' + Date.now(),
          amount: parseFloat(amount),
          currency: 'INR',
          keyId: 'TEST_KEY'
        };
        console.log('Using local mock order:', localOrder);
        setOrderData(localOrder);
        setShowPaymentModal(true);
      } else {
        // For real payments (Razorpay) we still need to create an order on the backend.
        const orderResponse = await paymentService.createOrder(parseFloat(amount));
        console.log('Order created:', orderResponse);
        setOrderData(orderResponse);
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      // If backend returns 401 for order creation, inform user to login for real payments
      if (error?.response?.status === 401) {
        setError('Real payments require login. Switch to Test Mode or sign in to proceed.');
      } else {
        setError(error.message || 'Failed to initialize payment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const processMockPayment = async () => {
    try {
      // Simulate payment processing
      setLoading(true);
      
      // Generate mock payment details
      const mockPaymentId = 'pay_mock_' + Date.now();
      const mockSignature = 'sig_mock_' + Math.random().toString(36).substring(7);
      
      // Verify payment with backend
      await paymentService.verifyPayment({
        orderId: orderData.orderId,
        paymentId: mockPaymentId,
        signature: mockSignature
      });

      // Create donation record
      const nowIso = new Date().toISOString();
      await api.post('/donations', {
        amount: parseFloat(amount),
        message: message || 'Supporting environmental causes',
        userId: user?.userId || null,
        userName: user?.name || 'Anonymous',
        donorName: user?.name || 'Anonymous',
        paymentId: mockPaymentId,
        paymentStatus: 'SUCCESS',
        donatedAt: nowIso,
        date: nowIso
      });

      setShowPaymentModal(false);
      setShowSuccess(true);
      setAmount('');
      setMessage('');
      fetchRecentDonations();
      
      setTimeout(() => setShowSuccess(false), 8000);
    } catch (error) {
      console.error('Mock payment error:', error);
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processRazorpayPayment = () => {
    if (!window.Razorpay) {
      setError('Payment system not loaded. Please refresh the page.');
      return;
    }

    const options = {
      key: orderData.keyId,
      amount: orderData.amount * 100,
      currency: orderData.currency,
      name: 'Green Pulse',
      description: 'Environmental Donation',
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          await paymentService.verifyPayment({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature
          });

          const nowIso = new Date().toISOString();
          await api.post('/donations', {
            amount: parseFloat(amount),
            message: message || 'Supporting environmental causes',
            userId: user?.userId || null,
            userName: user?.name || 'Anonymous',
            donorName: user?.name || 'Anonymous',
            paymentId: response.razorpay_payment_id,
            paymentStatus: 'SUCCESS',
            donatedAt: nowIso,
            date: nowIso
          });

          setShowPaymentModal(false);
          setShowSuccess(true);
          setAmount('');
          setMessage('');
          fetchRecentDonations();
        } catch (error) {
          setError('Payment verification failed.');
        }
      },
      prefill: {
        name: user?.name || 'Test User',
        email: user?.email || 'test@example.com',
        contact: user?.mobile || '9876543210'
      },
      theme: { color: '#198754' },
      modal: { ondismiss: () => setShowPaymentModal(false) }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const processPayment = () => {
    if (paymentMode === 'mock') {
      processMockPayment();
    } else {
      processRazorpayPayment();
    }
  };

  const presetAmounts = [100, 500, 1000, 2000, 5000];

  return (
    <Container className="mt-4">
      <Row>
        <Col lg={8}>
          <div className="text-center mb-4">
            <h2 className="text-success">💚 Make a Donation</h2>
            <p className="text-muted">
              Your contribution helps us organize more environmental events. 
              <Badge bg="warning" text="dark" className="ms-2">TEST MODE</Badge>
            </p>
          </div>

          {showSuccess && (
            <Alert variant="success" className="text-center">
              <h5>🎉 Thank you for your generous donation!</h5>
              <p className="mb-0">Your ₹{amount} donation was processed successfully! 🌟</p>
              <p className="mb-0 small text-muted">Transaction ID: {orderData?.orderId}</p>
              <p className="mb-0 small text-success">✅ Payment verified in test mode</p>
            </Alert>
          )}

          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

          <Card className="shadow">
            <Card.Body className="p-4">
              <Form onSubmit={handleDonate}>
                <Row className="mb-4">
                  <Col>
                    <h5>Quick Select Amount (₹)</h5>
                    <div className="d-flex gap-2 flex-wrap">
                      {presetAmounts.map(preset => (
                        <Button
                          key={preset}
                          variant={amount === preset.toString() ? 'success' : 'outline-success'}
                          type="button"
                          onClick={() => setAmount(preset.toString())}
                        >
                          ₹{preset}
                        </Button>
                      ))}
                    </div>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Donation Amount (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount in rupees"
                    min="1"
                    step="1"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Message (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a message with your donation..."
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    variant="success" 
                    size="lg" 
                    type="submit"
                    disabled={!amount || parseFloat(amount) <= 0 || loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Processing...
                      </>
                    ) : (
                      `Donate ₹${amount || 0}`
                    )}
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <Badge bg="info" text="dark">
                    🧪 Test Mode Active - No Real Payment
                  </Badge>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Payment Confirmation Modal */}
          <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
            <Modal.Header closeButton className="bg-success text-white">
              <Modal.Title>Confirm Donation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="text-center">
                <div className="display-4 text-success mb-3">💚</div>
                <h5>Ready to make a difference?</h5>
                <p className="mb-3">
                  You're about to donate <strong>₹{amount}</strong> to Green Pulse.
                </p>
                {message && (
                  <p className="text-muted">
                    <strong>Your message:</strong> "{message}"
                  </p>
                )}
                
                <Alert variant="warning" className="text-start">
                  <strong>🧪 Test Mode</strong>
                  <br />
                  This is a simulation. No real payment will be processed.
                  <br />
                  <small>Click "Complete Test Payment" to simulate donation.</small>
                </Alert>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={processPayment} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Processing...
                  </>
                ) : (
                  'Complete Test Payment'
                )}
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Impact Section */}
          <Row className="mt-5">
            <Col md={4} className="text-center mb-3">
              <Card className="border-0 bg-light card-hover">
                <Card.Body>
                  <div className="display-6 text-success">🌳</div>
                  <h5>Tree Plantation</h5>
                  <p className="text-muted small">₹100 plants one tree</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="text-center mb-3">
              <Card className="border-0 bg-light card-hover">
                <Card.Body>
                  <div className="display-6 text-success">🏖️</div>
                  <h5>Beach Cleanup</h5>
                  <p className="text-muted small">₹500 cleans one beach area</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="text-center mb-3">
              <Card className="border-0 bg-light card-hover">
                <Card.Body>
                  <div className="display-6 text-success">📚</div>
                  <h5>Education</h5>
                  <p className="text-muted small">₹1000 educates 10 students</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Recent Donations Sidebar */}
        <Col lg={4}>
          <Card className="shadow">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">🌟 Recent Donations</h5>
            </Card.Header>
            <Card.Body>
                    {recentDonations.length === 0 ? (
                      <p className="text-muted text-center">No donations yet. Be the first!</p>
                    ) : (
                      recentDonations.map(donation => {
                        const donorName = donation.userName || donation.donorName || 'Anonymous';
                        const dateValue = donation.donatedAt || donation.date || donation.createdAt || donation.timestamp;
                        const dateText = dateValue ? (() => {
                          const d = new Date(dateValue);
                          return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
                        })() : 'N/A';

                        return (
                          <div key={donation.donationId || donation.id} className="border-bottom pb-2 mb-2">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <strong>{donorName}</strong>
                                <Badge bg="success" className="ms-2">₹{donation.amount}</Badge>
                              </div>
                              <small className="text-muted">{dateText}</small>
                            </div>
                            {donation.message && (
                              <p className="text-muted small mb-0 mt-1">"{donation.message}"</p>
                            )}
                          </div>
                        );
                      })
                    )}
            </Card.Body>
          </Card>

          <Card className="mt-4 border-warning">
            <Card.Body className="text-center">
              <h6 className="text-warning">Test Mode Active</h6>
              <p className="text-muted small mb-2">
                All payments are simulated. No real transactions occur.
              </p>
              <Badge bg="warning" text="dark" className="mb-2">DEMO</Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Donations;