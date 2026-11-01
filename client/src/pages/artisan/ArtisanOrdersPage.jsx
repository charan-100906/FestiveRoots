import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Check, X, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';

const ArtisanOrdersPage = () => {
  const [fulfilments, setFulfilments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalFul, setRejectModalFul] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/fulfilments/artisan/my-orders');
      if (res.data.success) {
        setFulfilments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (fulId, newStatus, note = '') => {
    try {
      setUpdatingId(fulId);
      setMessage(null);
      const res = await api.patch(`/fulfilments/${fulId}/status`, {
        status: newStatus,
        note
      });

      if (res.data.success) {
        setMessage({ type: 'success', text: `Order status updated to ${newStatus}` });
        fetchOrders();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update status' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectModalFul || !rejectionReason.trim()) return;

    try {
      setUpdatingId(rejectModalFul._id);
      const res = await api.patch(`/fulfilments/${rejectModalFul._id}/status`, {
        status: 'REJECTED',
        rejectionReason: rejectionReason.trim()
      });

      if (res.data.success) {
        setMessage({ type: 'success', text: 'Order item rejected and customer notified' });
        setRejectModalFul(null);
        setRejectionReason('');
        fetchOrders();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Rejection failed' });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="artisan-orders-page" style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem' }}>Incoming Orders & Craft Fulfilment</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Accept incoming customer requests, update craft preparation progress, and coordinate parcel collections.
          </p>
        </div>

        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1.5rem' }}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div className="spinner" style={{ color: 'var(--color-terracotta)', width: '2.5rem', height: '2.5rem' }}></div>
          </div>
        ) : fulfilments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#FFFFFF' }}>
            <h3>No Incoming Orders Currently</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: '0.75rem 0' }}>
              When conscious customers order your handcrafted treasures, they will appear here for workshop confirmation.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {fulfilments.map((ful) => (
              <div key={ful._id} className="card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
                {/* Top Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Assigned Sub-Order
                    </span>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-maroon)' }}>Order #{ful.orderNumber}</h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Subtotal: <b>₹{ful.subtotal?.toLocaleString('en-IN')}</b>
                    </span>
                    <StatusBadge status={ful.fulfilmentStatus} />
                  </div>
                </div>

                {/* Items in this suborder */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                    Items to Craft / Dispatch:
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {ful.items?.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={it.image} alt={it.name} style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600 }}>{it.name}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                            Quantity: <b>{it.quantity}</b> • Unit Price: ₹{it.price?.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Delivery Details */}
                {ful.order?.shippingAddress && (
                  <div style={{ backgroundColor: 'var(--color-surface-soft)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                    <b>Deliver to:</b> {ful.order.customerName} ({ful.order.shippingAddress.city}, {ful.order.shippingAddress.state} - {ful.order.shippingAddress.postalCode})
                  </div>
                )}

                {/* Status Stepper Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border-light)' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Current Phase: <b>{ful.fulfilmentStatus.replace(/_/g, ' ')}</b>
                  </div>

                  <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                    {/* Step 1: Initial Acceptance */}
                    {ful.fulfilmentStatus === 'AWAITING_ARTISAN_CONFIRMATION' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(ful._id, 'CONFIRMED', 'Artisan workshop confirmed item availability and craft feasibility.')}
                          disabled={updatingId === ful._id}
                          className="btn btn-sm btn-primary"
                        >
                          <Check size={14} /> Accept & Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectModalFul(ful)}
                          className="btn btn-sm btn-outline"
                          style={{ color: 'var(--color-danger)' }}
                        >
                          <X size={14} /> Reject with Reason
                        </button>
                      </>
                    )}

                    {/* Step 2: Preparing */}
                    {ful.fulfilmentStatus === 'CONFIRMED' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(ful._id, 'PREPARING', 'Artisan is actively handcrafting the requested pieces.')}
                        disabled={updatingId === ful._id}
                        className="btn btn-sm btn-primary"
                      >
                        Start Handcrafting / Preparing
                      </button>
                    )}

                    {/* Step 3: Ready for collection */}
                    {ful.fulfilmentStatus === 'PREPARING' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(ful._id, 'READY_FOR_COLLECTION', 'Items packaged safely and ready for regional workshop pickup.')}
                        disabled={updatingId === ful._id}
                        className="btn btn-sm btn-primary"
                      >
                        Mark Ready for Collection
                      </button>
                    )}

                    {/* Step 4: Schedule Collection (Simulated) */}
                    {ful.fulfilmentStatus === 'READY_FOR_COLLECTION' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(ful._id, 'COLLECTION_SCHEDULED', 'Platform logistics scheduled for workshop collection.')}
                        disabled={updatingId === ful._id}
                        className="btn btn-sm btn-secondary"
                      >
                        Schedule Pickup (Simulated)
                      </button>
                    )}

                    {/* Step 5: Mark as Shipped (Simulated) */}
                    {ful.fulfilmentStatus === 'COLLECTION_SCHEDULED' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(ful._id, 'SHIPPED', 'Consignment picked up and dispatched into transit.')}
                        disabled={updatingId === ful._id}
                        className="btn btn-sm btn-primary"
                      >
                        <Truck size={14} /> Mark as Shipped (Simulated)
                      </button>
                    )}

                    {/* Step 6: Mark as Delivered (Simulated) */}
                    {['SHIPPED', 'OUT_FOR_DELIVERY'].includes(ful.fulfilmentStatus) && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(ful._id, 'DELIVERED', 'Package delivered safely to customer doorstep.')}
                        disabled={updatingId === ful._id}
                        className="btn btn-sm btn-outline"
                        style={{ color: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                      >
                        Mark as Delivered (Simulated)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalFul && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ color: 'var(--color-danger)', marginBottom: '0.75rem' }}>Reject Order Assignment</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Please state why your workshop cannot fulfil order <b>#{rejectModalFul.orderNumber}</b>. This reason will be logged in the order records.
            </p>

            <form onSubmit={handleRejectSubmit}>
              <div className="form-group">
                <label className="form-label">Rejection Reason *</label>
                <textarea
                  rows="3"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Special raw wood unavailable; seasonal rains delaying clay firing..."
                  className="form-textarea"
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRejectModalFul(null)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingId === rejectModalFul._id}
                  className="btn btn-primary"
                  style={{ backgroundColor: 'var(--color-danger)' }}
                >
                  Submit Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtisanOrdersPage;
