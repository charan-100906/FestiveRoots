import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Truck, MapPin } from 'lucide-react';
import api from '../services/api';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [orderData, setOrderData] = useState(location.state?.order || null);
  const [fulfilments, setFulfilments] = useState(location.state?.fulfilments || []);
  const [loading, setLoading] = useState(!orderData);

  useEffect(() => {
    if (!orderData && id) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/orders/${id}`);
          if (res.data.success) {
            setOrderData(res.data.data.order);
            setFulfilments(res.data.data.fulfilments);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, orderData]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="spinner" style={{ color: 'var(--color-terracotta)', width: '2.5rem', height: '2.5rem' }}></div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="container container-narrow">
        <div className="success-card card">
          <div className="success-icon-badge">
            <CheckCircle size={48} color="var(--color-success)" />
          </div>

          <h1 className="success-title">Order Placed Successfully!</h1>
          <p className="success-sub">
            Thank you for supporting traditional Indian artisans. Your order has been registered in the database and partitioned into artisan fulfilment sub-orders.
          </p>

          <div className="order-highlight-banner">
            <div>
              <span className="highlight-label">Order Reference Number</span>
              <span className="highlight-value">{orderData?.orderNumber || id}</span>
            </div>
            <div>
              <span className="highlight-label">Total Amount Paid / Payable</span>
              <span className="highlight-value">₹{orderData?.totalAmount?.toLocaleString('en-IN')} ({orderData?.paymentMethod})</span>
            </div>
          </div>

          {/* Fulfilment Partitioning Notice */}
          <div className="fulfilment-breakdown-section">
            <h3 className="section-sub-title">
              <Package size={18} /> Artisan Fulfilment Coordination
            </h3>
            <p className="sub-note">
              The platform has assigned your requested products to individual village workshops. Each artisan will prepare and dispatch their crafted items independently:
            </p>

            <div className="fulfilments-list">
              {fulfilments.map((ful, idx) => (
                <div key={ful._id || idx} className="fulfilment-sub-card">
                  <div className="ful-header">
                    <span className="ful-artisan-title">
                      Sub-Order #{idx + 1}: {ful.artisan?.businessName || 'Artisan Workshop'}
                    </span>
                    <span className="ful-status-chip">Awaiting Confirmation</span>
                  </div>
                  <div className="ful-items-preview">
                    {ful.items?.map((it, iIdx) => (
                      <span key={iIdx} className="ful-item-pill">
                        {it.name} (Qty: {it.quantity})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="success-actions">
            <Link to="/customer/orders" className="btn btn-primary btn-lg">
              View My Orders & Track Delivery <Truck size={18} />
            </Link>
            <Link to="/products" className="btn btn-outline btn-lg">
              Continue Shopping <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .order-success-page {
          padding: 4rem 0 6rem;
        }
        .success-card {
          text-align: center;
          padding: 3.5rem 2.5rem;
          background: #FFFFFF;
        }
        .success-icon-badge {
          margin-bottom: 1.25rem;
        }
        .success-title {
          font-size: 2.25rem;
          color: var(--color-maroon);
          margin-bottom: 0.75rem;
        }
        .success-sub {
          color: var(--color-text-muted);
          font-size: 1.05rem;
          line-height: 1.6;
          max-width: 620px;
          margin: 0 auto 2rem;
        }

        .order-highlight-banner {
          background-color: var(--color-surface-soft);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1.25rem 2rem;
          display: flex;
          justify-content: space-around;
          margin-bottom: 2.5rem;
          text-align: left;
        }
        .highlight-label {
          display: block;
          font-size: 0.78rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }
        .highlight-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-text-main);
        }

        .fulfilment-breakdown-section {
          text-align: left;
          border-top: 1px solid var(--color-border-light);
          padding-top: 2rem;
          margin-bottom: 2.5rem;
        }
        .section-sub-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.2rem;
          margin-bottom: 0.4rem;
        }
        .sub-note {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          margin-bottom: 1.25rem;
        }

        .fulfilments-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .fulfilment-sub-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
        }
        .ful-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .ful-artisan-title {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--color-maroon);
        }
        .ful-status-chip {
          background-color: var(--color-warning-bg);
          color: var(--color-warning);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.55rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }
        .ful-items-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .ful-item-pill {
          background-color: var(--color-surface-soft);
          border: 1px solid var(--color-border);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }

        .success-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .order-highlight-banner {
            flex-direction: column;
            gap: 1rem;
          }
          .success-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccessPage;
