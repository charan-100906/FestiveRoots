import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Truck, Clock, ShieldCheck, CheckCircle } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/common/StatusBadge';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [fulfilments, setFulfilments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.data.order);
          setFulfilments(res.data.data.fulfilments);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="spinner" style={{ color: 'var(--color-terracotta)', width: '2.5rem', height: '2.5rem' }}></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h2>Order Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', margin: '1rem 0 2rem' }}>{error}</p>
        <Link to="/customer/orders" className="btn btn-primary">Return to Orders</Link>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="container container-narrow">
        <Link to="/customer/orders" className="back-link">
          <ArrowLeft size={16} /> Back to My Orders
        </Link>

        {/* Top Header Card */}
        <div className="card header-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Order Reference
              </span>
              <h1 style={{ fontSize: '1.75rem', color: 'var(--color-maroon)' }}>{order.orderNumber}</h1>
            </div>
            <StatusBadge status={order.overallStatus} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border-light)' }}>
            <div>
              <span className="meta-lbl">Date Placed</span>
              <span className="meta-val">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="meta-lbl">Payment Status</span>
              <span className="meta-val">{order.paymentStatus} ({order.paymentMethod})</span>
            </div>
            <div>
              <span className="meta-lbl">Total Paid / Payable</span>
              <span className="meta-val" style={{ color: 'var(--color-terracotta)' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="var(--color-terracotta)" /> Destination Delivery Address
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            <b>{order.customerName}</b><br />
            {order.shippingAddress?.street}<br />
            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}<br />
            {order.shippingAddress?.country}
          </p>
        </div>

        {/* Fulfilment Timeline Sub-Orders */}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>Artisan Fulfilment Tracking & Sub-Orders</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {fulfilments.map((ful, idx) => (
            <div key={ful._id || idx} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.15rem', color: 'var(--color-maroon)' }}>
                    Workshop #{idx + 1}: {ful.artisan?.businessName}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-terracotta)', fontWeight: 600 }}>
                    {ful.artisan?.craftSpecialization} • {ful.artisan?.state}
                  </span>
                </div>
                <StatusBadge status={ful.fulfilmentStatus} />
              </div>

              {/* Items from this artisan */}
              <div style={{ marginBottom: '1.5rem' }}>
                {ful.items?.map((it, iIdx) => (
                  <div key={iIdx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <img src={it.image} alt={it.name} style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <Link to={`/products/${it.product}`} style={{ fontWeight: 600, fontSize: '0.92rem' }}>{it.name}</Link>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Qty: {it.quantity} × ₹{it.price?.toLocaleString('en-IN')}</div>
                    </div>
                    {ful.fulfilmentStatus === 'DELIVERED' && (
                      <Link to={`/products/${it.product}`} className="btn btn-sm btn-outline-terracotta">
                        Write Review
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Tracking Timeline Stepper */}
              <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                Coordinated Progress History (Simulated)
              </h5>

              <div className="timeline-stepper">
                {ful.trackingHistory?.map((step, sIdx) => (
                  <div key={sIdx} className="timeline-step">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-status-line">
                        <b>{step.status.replace(/_/g, ' ')}</b>
                        <span className="timeline-time">
                          {new Date(step.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="timeline-note">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .order-detail-page {
          padding: 3rem 0 6rem;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--color-text-muted);
          font-weight: 600;
          font-size: 0.88rem;
          margin-bottom: 1.5rem;
        }
        .back-link:hover {
          color: var(--color-terracotta);
        }

        .meta-lbl {
          display: block;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }
        .meta-val {
          font-weight: 700;
          font-size: 0.95rem;
        }

        .timeline-stepper {
          position: relative;
          padding-left: 1.5rem;
          border-left: 2px solid var(--color-terracotta-light);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .timeline-step {
          position: relative;
        }
        .timeline-dot {
          position: absolute;
          left: -1.95rem;
          top: 4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: var(--color-terracotta);
          border: 2px solid #FFFFFF;
          box-shadow: 0 0 0 2px var(--color-terracotta-light);
        }
        .timeline-status-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          margin-bottom: 0.2rem;
        }
        .timeline-time {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .timeline-note {
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
};

export default OrderDetailPage;
