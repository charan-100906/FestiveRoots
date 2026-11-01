import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Clock, AlertTriangle, ArrowRight, XCircle } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/common/StatusBadge';

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my-orders');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    if (!cancelModalOrder) return;

    try {
      setCancelling(true);
      const res = await api.post(`/orders/${cancelModalOrder._id}/cancel`, {
        reason: cancelReason
      });

      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        setCancelModalOrder(null);
        setCancelReason('');
        fetchOrders();
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to cancel order'
      });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1 className="orders-title">My Orders & Artisan Fulfilment Tracking</h1>
          <p className="orders-sub">
            Track status and coordination timelines for all your regional handcrafted purchases.
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
        ) : orders.length === 0 ? (
          <div className="empty-orders-card card">
            <div className="empty-icon">📦</div>
            <h3>No Orders Placed Yet</h3>
            <p>You haven't ordered any regional handicrafts yet. Discover authentic crafts from master artisans across India.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
              Explore Handcrafted Products <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const isCancellable = ['PLACED', 'AWAITING_ARTISAN_CONFIRMATION'].includes(order.overallStatus);

              return (
                <div key={order._id} className="order-card card">
                  {/* Top Bar */}
                  <div className="order-top-bar">
                    <div className="order-id-group">
                      <span className="order-id-label">Order Reference</span>
                      <span className="order-id-val">{order.orderNumber}</span>
                    </div>

                    <div className="order-meta-group">
                      <span className="order-date">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <StatusBadge status={order.overallStatus} />
                    </div>
                  </div>

                  {/* Items and Sub-orders */}
                  <div className="order-body">
                    <div className="order-items-column">
                      {order.orderItems?.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <img src={item.image} alt={item.name} className="order-item-img" />
                          <div className="order-item-desc">
                            <h4 className="order-item-name">
                              <Link to={`/products/${item.product}`}>{item.name}</Link>
                            </h4>
                            <span className="order-item-craft">
                              {item.craftType} • Handcrafted by <b>{item.artisanName}</b>
                            </span>
                            <div className="order-item-price-qty">
                              Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Fulfilments & Tracking Snapshot */}
                    <div className="order-fulfilments-column">
                      <h5 className="fulfilment-col-title">Artisan Sub-Orders & Tracking</h5>
                      {order.fulfilments?.length > 0 ? (
                        order.fulfilments.map((ful, fIdx) => (
                          <div key={fIdx} className="fulfilment-pill-box">
                            <div className="ful-box-top">
                              <span className="ful-artisan-name">
                                🧑‍🎨 {ful.artisan?.businessName || 'Artisan Workshop'}
                              </span>
                              <StatusBadge status={ful.fulfilmentStatus} />
                            </div>

                            {ful.simulatedTrackingCode && (
                              <div className="tracking-code-pill">
                                Tracking: <b>{ful.simulatedTrackingCode}</b>
                              </div>
                            )}

                            {ful.trackingHistory?.length > 0 && (
                              <div className="latest-tracking-note">
                                💬 "{ful.trackingHistory[ful.trackingHistory.length - 1].note}"
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                          Fulfilment assigned to workshop.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="order-footer-bar">
                    <div className="order-total-price">
                      Total: <b>₹{order.totalAmount?.toLocaleString('en-IN')}</b> ({order.paymentMethod})
                    </div>

                    <div className="order-actions-right">
                      {isCancellable && (
                        <button
                          type="button"
                          onClick={() => setCancelModalOrder(order)}
                          className="btn btn-sm btn-outline"
                          style={{ color: 'var(--color-danger)' }}
                        >
                          <XCircle size={15} /> Cancel Order
                        </button>
                      )}

                      <Link to={`/customer/orders/${order._id}`} className="btn btn-sm btn-outline-terracotta">
                        View Detailed Timeline <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Order Modal */}
      {cancelModalOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '0.75rem', color: 'var(--color-maroon)' }}>Cancel Order Confirmation</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Are you sure you want to cancel order <b>{cancelModalOrder.orderNumber}</b>? Stock will be restored to the artisan workshop.
            </p>

            <form onSubmit={handleCancelOrder}>
              <div className="form-group">
                <label className="form-label">Cancellation Reason</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select a reason...</option>
                  <option value="Changed mind / Ordered by mistake">Changed mind / Ordered by mistake</option>
                  <option value="Delivery address needs modification">Delivery address needs modification</option>
                  <option value="Found alternative festive craft">Found alternative festive craft</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="btn btn-outline"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="btn btn-primary"
                  style={{ backgroundColor: 'var(--color-danger)' }}
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .orders-page {
          padding: 3rem 0 6rem;
        }
        .orders-header {
          margin-bottom: 2rem;
        }
        .orders-title {
          font-size: 2.25rem;
          margin-bottom: 0.5rem;
        }
        .orders-sub {
          color: var(--color-text-muted);
          font-size: 1.05rem;
        }

        .empty-orders-card {
          text-align: center;
          padding: 4rem 2rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .order-card {
          background: #FFFFFF;
        }
        .order-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--color-border-light);
          background-color: var(--color-surface-soft);
        }
        .order-id-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-text-muted);
          text-transform: uppercase;
        }
        .order-id-val {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-maroon);
        }
        .order-meta-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .order-date {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .order-body {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 1.5rem;
          padding: 1.5rem;
          border-bottom: 1px solid var(--color-border-light);
        }
        .order-items-column {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .order-item-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .order-item-img {
          width: 65px;
          height: 65px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          flex-shrink: 0;
        }
        .order-item-name {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.2rem;
        }
        .order-item-name a:hover {
          color: var(--color-terracotta);
        }
        .order-item-craft {
          display: block;
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }
        .order-item-price-qty {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-text-main);
          margin-top: 0.2rem;
        }

        .order-fulfilments-column {
          background-color: var(--color-surface-soft);
          border-radius: var(--radius-md);
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .fulfilment-col-title {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--color-maroon);
        }
        .fulfilment-pill-box {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 0.75rem;
        }
        .ful-box-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.35rem;
        }
        .ful-artisan-name {
          font-size: 0.85rem;
          font-weight: 700;
        }
        .tracking-code-pill {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-bottom: 0.25rem;
        }
        .latest-tracking-note {
          font-size: 0.78rem;
          color: var(--color-terracotta);
          font-style: italic;
        }

        .order-footer-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
        }
        .order-total-price {
          font-size: 0.95rem;
          color: var(--color-text-main);
        }
        .order-actions-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        @media (max-width: 800px) {
          .order-body {
            grid-template-columns: 1fr;
          }
          .order-top-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .order-footer-bar {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          .order-actions-right {
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerOrdersPage;
