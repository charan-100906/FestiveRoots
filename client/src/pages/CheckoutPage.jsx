import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const CheckoutPage = () => {
  const { cartItems, subtotal, deliveryCharge, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: 'India',
    paymentMethod: 'COD'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h2>Your Cart is Empty</h2>
        <p style={{ color: 'var(--color-text-muted)', margin: '1rem 0 2rem' }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link to="/products" className="btn btn-primary">Browse Catalogue</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
      return;
    }

    if (!formData.street || !formData.city || !formData.state || !formData.postalCode) {
      setError('Please provide complete shipping address details');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare payload: server will revalidate every product price and inventory from MongoDB
      const orderPayload = {
        items: cartItems.map((it) => ({
          productId: it.productId,
          quantity: it.quantity
        })),
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.success) {
        clearCart();
        navigate(`/order-success/${res.data.data.order._id}`, {
          state: { order: res.data.data.order, fulfilments: res.data.data.fulfilments }
        });
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please review your cart.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <Link to="/cart" className="back-to-cart">
            <ArrowLeft size={16} /> Back to Cart
          </Link>
          <h1 className="checkout-title">Coordinated Regional Checkout</h1>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="checkout-layout">
          {/* LEFT: Shipping Address & Payment Selection */}
          <div className="checkout-forms-column">
            {/* Customer Details Box */}
            <div className="card form-card">
              <h3 className="form-card-title">1. Customer Information</h3>
              <div className="user-info-display">
                <p><b>Name:</b> {user?.name}</p>
                <p><b>Email:</b> {user?.email}</p>
                <p><b>Phone:</b> {user?.phone || 'Not provided in profile'}</p>
              </div>
            </div>

            {/* Shipping Address Box */}
            <div className="card form-card">
              <h3 className="form-card-title">2. Doorstep Delivery Address</h3>
              <div className="form-group">
                <label className="form-label">Street Address / House No. / Landmark</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="e.g. 42 Heritage Residency, Temple Road"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">City / Town</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Hyderabad"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Telangana"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">PIN / Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="e.g. 500034"
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="card form-card">
              <h3 className="form-card-title">3. Payment Selection</h3>

              <div className="payment-options">
                {/* Cash on Delivery */}
                <label className={`payment-option-card ${formData.paymentMethod === 'COD' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleChange}
                  />
                  <div className="option-icon"><Banknote size={24} /></div>
                  <div className="option-info">
                    <div className="option-title">Cash on Delivery (COD)</div>
                    <div className="option-sub">Pay safely in cash or UPI when the artisan package arrives.</div>
                  </div>
                </label>

                {/* Simulated Online Payment (DEMO) */}
                <label className={`payment-option-card ${formData.paymentMethod === 'ONLINE_DEMO' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE_DEMO"
                    checked={formData.paymentMethod === 'ONLINE_DEMO'}
                    onChange={handleChange}
                  />
                  <div className="option-icon"><CreditCard size={24} /></div>
                  <div className="option-info">
                    <div className="option-title">
                      Simulated Online Payment <span className="demo-tag">ACADEMIC DEMO</span>
                    </div>
                    <div className="option-sub">Simulates instant online card / UPI authorization for project testing.</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary Snapshot */}
          <div className="checkout-summary-column">
            <div className="card summary-box">
              <h3 className="summary-title">Order Overview ({cartItems.length} Handcrafted {cartItems.length === 1 ? 'Piece' : 'Pieces'})</h3>

              <div className="checkout-items-list">
                {cartItems.map((it) => (
                  <div key={it.productId} className="checkout-item-preview">
                    <img src={getImageUrl(it.image)} alt={it.name} className="checkout-thumb" />
                    <div className="checkout-thumb-info">
                      <div className="checkout-prod-name">{it.name}</div>
                      <div className="checkout-prod-meta">Qty: {it.quantity} × ₹{it.price.toLocaleString('en-IN')}</div>
                      <div className="checkout-artisan-sub">by {it.artisanName}</div>
                    </div>
                    <div className="checkout-item-subtotal">
                      ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="summary-row">
                <span>Coordinated Delivery</span>
                <span>{deliveryCharge === 0 ? <span className="free-pill">FREE</span> : `₹${deliveryCharge}`}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total-row">
                <span>Final Total Payable</span>
                <span className="total-val">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg submit-order-btn"
              >
                {loading ? 'Validating & Placing Order...' : 'Confirm and Place Order'}
              </button>

              <div className="fulfilment-flow-notice">
                <Truck size={16} />
                <span>
                  Our platform will split your order into individual artisan sub-orders for direct village workshop coordination.
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .checkout-page {
          padding: 3rem 0 5rem;
        }
        .checkout-header {
          margin-bottom: 2rem;
        }
        .back-to-cart {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--color-text-muted);
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }
        .back-to-cart:hover {
          color: var(--color-terracotta);
        }
        .checkout-title {
          font-size: 2.25rem;
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2.5rem;
          align-items: start;
        }

        .form-card {
          padding: 1.75rem;
          margin-bottom: 1.5rem;
          background: #FFFFFF;
        }
        .form-card-title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          margin-bottom: 1.25rem;
          color: var(--color-maroon);
        }

        .user-info-display {
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--color-text-muted);
        }

        .form-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }

        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .payment-option-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
        }
        .payment-option-card.selected {
          border-color: var(--color-terracotta);
          background-color: var(--color-surface-soft);
          box-shadow: 0 0 0 2px rgba(194, 65, 12, 0.15);
        }
        .option-icon {
          color: var(--color-terracotta);
        }
        .option-info {
          flex: 1;
        }
        .option-title {
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .option-sub {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .demo-tag {
          font-size: 0.65rem;
          font-weight: 800;
          background-color: var(--color-terracotta);
          color: #FFF;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-sm);
        }

        .summary-box {
          padding: 1.75rem;
          background: #FFFFFF;
        }
        .summary-title {
          font-size: 1.2rem;
          margin-bottom: 1.25rem;
        }

        .checkout-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          max-height: 280px;
          overflow-y: auto;
          margin-bottom: 1rem;
          padding-right: 0.35rem;
        }
        .checkout-item-preview {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
        }
        .checkout-thumb {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          flex-shrink: 0;
        }
        .checkout-thumb-info {
          flex: 1;
        }
        .checkout-prod-name {
          font-weight: 600;
          line-height: 1.2;
          margin-bottom: 0.2rem;
        }
        .checkout-prod-meta {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .checkout-artisan-sub {
          font-size: 0.7rem;
          color: var(--color-terracotta);
        }
        .checkout-item-subtotal {
          font-weight: 700;
        }

        .submit-order-btn {
          width: 100%;
          margin-bottom: 1.25rem;
        }
        .fulfilment-flow-notice {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          font-size: 0.78rem;
          color: var(--color-text-muted);
          background-color: var(--color-surface-soft);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          line-height: 1.4;
        }

        @media (max-width: 900px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }
          .form-row-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
