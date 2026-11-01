import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUrl';

const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryCharge,
    totalAmount
  } = useCart();
  const navigate = useNavigate();

  const freeDeliveryThreshold = 999;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  if (cartItems.length === 0) {
    return (
      <div className="container empty-cart-container">
        <div className="empty-cart-card card">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your FestiveRoots Cart is Empty</h2>
          <p>
            You haven't selected any regional handicrafts yet. Discover handcrafted treasures from traditional artisans across India.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg" style={{ marginTop: '1.5rem' }}>
            Explore Handcrafted Catalogue <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-page-title">Shopping Cart ({cartItems.length} Handcrafted {cartItems.length === 1 ? 'Item' : 'Items'})</h1>

        {/* Free Delivery Bar */}
        <div className="free-shipping-card card">
          <div className="free-shipping-text">
            {amountNeededForFreeDelivery > 0 ? (
              <span>Add <b>₹{amountNeededForFreeDelivery.toLocaleString('en-IN')}</b> more of authentic crafts to unlock <b>FREE Regional Delivery</b>!</span>
            ) : (
              <span className="unlocked-text">🎉 Congratulations! You have unlocked <b>FREE Regional Delivery</b>!</span>
            )}
          </div>
          <div className="shipping-progress-bg">
            <div className="shipping-progress-bar" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="cart-grid-layout">
          {/* Cart Items List */}
          <div className="cart-items-column">
            <div className="cart-items-card card">
              {cartItems.map((item) => (
                <div key={item.productId} className="cart-item-row">
                  <div className="cart-item-thumb">
                    <img src={getImageUrl(item.image)} alt={item.name} />
                  </div>

                  <div className="cart-item-details">
                    <span className="cart-item-craft">{item.craftType} • by {item.artisanName}</span>
                    <h3 className="cart-item-title">
                      <Link to={`/products/${item.productId}`}>{item.name}</Link>
                    </h3>
                    <div className="cart-item-price-unit">
                      ₹{item.price?.toLocaleString('en-IN')} each
                    </div>
                  </div>

                  <div className="cart-item-quantity-col">
                    <div className="quantity-pill">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="qty-btn-sm"
                      >
                        -
                      </button>
                      <span className="qty-val-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={!item.isMadeToOrder && item.quantity >= item.stock}
                        className="qty-btn-sm"
                      >
                        +
                      </button>
                    </div>
                    {!item.isMadeToOrder && item.stock <= 5 && (
                      <span className="stock-warning">Only {item.stock} in stock</span>
                    )}
                  </div>

                  <div className="cart-item-total-col">
                    <div className="cart-item-total-price">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="remove-item-btn"
                      title="Remove product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="cart-bottom-actions">
                <Link to="/products" className="continue-link">
                  <ArrowLeft size={16} /> Continue Exploring
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  className="clear-cart-btn"
                >
                  Clear Shopping Cart
                </button>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary-column">
            <div className="order-summary-card card">
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-row">
                <span>Handcrafted Items Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="summary-row">
                <span>Coordinated Regional Delivery</span>
                <span>{deliveryCharge === 0 ? <span className="free-pill">FREE</span> : `₹${deliveryCharge}`}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total-row">
                <span>Total Amount</span>
                <span className="total-val">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="btn btn-primary btn-lg checkout-cta-btn"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div className="summary-badges-list">
                <div className="summary-badge-item">
                  <ShieldCheck size={18} color="var(--color-terracotta)" />
                  <span>Fair compensation direct to artisan clusters</span>
                </div>
                <div className="summary-badge-item">
                  <Truck size={18} color="var(--color-terracotta)" />
                  <span>Doorstep collection from village workshops</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-page {
          padding: 3rem 0 5rem;
        }
        .cart-page-title {
          font-size: 2.25rem;
          margin-bottom: 1.5rem;
        }

        .empty-cart-container {
          padding: 6rem 1.5rem;
        }
        .empty-cart-card {
          text-align: center;
          padding: 4rem 2rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .empty-cart-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
        }
        .empty-cart-card h2 {
          font-size: 1.85rem;
          margin-bottom: 0.75rem;
        }
        .empty-cart-card p {
          color: var(--color-text-muted);
        }

        .free-shipping-card {
          padding: 1.15rem 1.5rem;
          margin-bottom: 2rem;
          background: #FFFFFF;
        }
        .free-shipping-text {
          font-size: 0.9rem;
          margin-bottom: 0.65rem;
        }
        .unlocked-text {
          color: var(--color-success);
          font-weight: 600;
        }
        .shipping-progress-bg {
          height: 8px;
          background-color: var(--color-surface-soft);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .shipping-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--color-saffron), var(--color-terracotta));
          border-radius: var(--radius-full);
          transition: width 0.3s ease;
        }

        .cart-grid-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 2rem;
          align-items: start;
        }

        .cart-items-card {
          background: #FFFFFF;
        }
        .cart-item-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
          border-bottom: 1px solid var(--color-border-light);
        }
        .cart-item-thumb {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-md);
          overflow: hidden;
          flex-shrink: 0;
          background: var(--color-surface-soft);
        }
        .cart-item-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cart-item-details {
          flex: 1;
        }
        .cart-item-craft {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--color-terracotta);
        }
        .cart-item-title {
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 600;
          margin: 0.2rem 0;
        }
        .cart-item-title a:hover {
          color: var(--color-terracotta);
        }
        .cart-item-price-unit {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .cart-item-quantity-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }
        .quantity-pill {
          display: flex;
          align-items: center;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .qty-btn-sm {
          background: var(--color-surface-soft);
          border: none;
          width: 32px;
          height: 32px;
          font-size: 1rem;
          cursor: pointer;
        }
        .qty-btn-sm:hover {
          background: var(--color-surface-hover);
        }
        .qty-val-sm {
          width: 34px;
          text-align: center;
          font-size: 0.88rem;
          font-weight: 700;
        }
        .stock-warning {
          font-size: 0.72rem;
          color: var(--color-danger);
          font-weight: 600;
        }

        .cart-item-total-col {
          text-align: right;
          min-width: 90px;
        }
        .cart-item-total-price {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-maroon);
          margin-bottom: 0.5rem;
        }
        .remove-item-btn {
          background: none;
          border: none;
          color: var(--color-text-light);
          cursor: pointer;
          transition: var(--transition);
        }
        .remove-item-btn:hover {
          color: var(--color-danger);
        }

        .cart-bottom-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
        }
        .continue-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--color-text-muted);
          font-weight: 600;
          font-size: 0.88rem;
        }
        .continue-link:hover {
          color: var(--color-terracotta);
        }
        .clear-cart-btn {
          background: none;
          border: none;
          color: var(--color-danger);
          font-size: 0.85rem;
          cursor: pointer;
          font-weight: 600;
        }

        .order-summary-card {
          padding: 1.75rem;
          background: #FFFFFF;
        }
        .summary-title {
          font-size: 1.25rem;
          margin-bottom: 1.25rem;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.92rem;
          margin-bottom: 0.85rem;
          color: var(--color-text-muted);
        }
        .free-pill {
          color: var(--color-success);
          font-weight: 700;
        }
        .summary-divider {
          height: 1px;
          background-color: var(--color-border);
          margin: 1.25rem 0;
        }
        .summary-total-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 1.5rem;
          font-weight: 700;
          color: var(--color-text-main);
          font-size: 1.05rem;
        }
        .total-val {
          font-size: 1.6rem;
          color: var(--color-maroon);
          font-weight: 800;
        }
        .checkout-cta-btn {
          width: 100%;
          margin-bottom: 1.5rem;
        }

        .summary-badges-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--color-border-light);
        }
        .summary-badge-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }

        @media (max-width: 900px) {
          .cart-grid-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;
