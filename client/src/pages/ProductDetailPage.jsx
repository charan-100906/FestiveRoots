import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Clock,
  Truck,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  Star,
  Sparkles,
  Info
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import { getImageUrl } from '../utils/imageUrl';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedMessage, setAddedMessage] = useState(false);

  // Review submission state
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const [prodRes, revRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/reviews/product/${id}`)
        ]);

        if (prodRes.data.success) {
          setProduct(prodRes.data.data);
        }
        if (revRes.data.success) {
          setReviews(revRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setReviewMsg({ type: 'error', text: 'Please sign in to write a review' });
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewMsg(null);
      const res = await api.post('/reviews', {
        productId: id,
        rating,
        title: reviewTitle,
        comment: reviewComment
      });

      if (res.data.success) {
        setReviewMsg({ type: 'success', text: res.data.message });
        setReviews([res.data.data, ...reviews]);
        setReviewTitle('');
        setReviewComment('');
      }
    } catch (err) {
      setReviewMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit review'
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="spinner" style={{ color: 'var(--color-terracotta)', width: '3rem', height: '3rem' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Retrieving authentic artisan details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h2>Product Unavailable</h2>
        <p style={{ color: 'var(--color-text-muted)', margin: '1rem 0 2rem' }}>{error || 'This handcrafted product does not exist or has been removed.'}</p>
        <Link to="/products" className="btn btn-primary">Return to Catalogue</Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);
  const images = (product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80']).map(getImageUrl);

  return (
    <div className="product-detail-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-bar">
        <div className="container breadcrumb-inner">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products">Explore</Link>
          <ChevronRight size={14} />
          <Link to={`/products?category=${product.category?.slug || ''}`}>{product.categoryName}</Link>
          <ChevronRight size={14} />
          <span className="current-crumb">{product.name}</span>
        </div>
      </div>

      <div className="container detail-layout">
        {/* LEFT: Product Gallery */}
        <div className="gallery-column">
          <div className="main-image-frame card">
            <img src={images[activeImageIndex]} alt={product.name} className="main-display-image" />
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`wishlist-float-btn ${isFavorited ? 'active' : ''}`}
            >
              <Heart size={20} fill={isFavorited ? 'var(--color-danger)' : 'none'} color={isFavorited ? 'var(--color-danger)' : '#1C1917'} />
            </button>
          </div>

          {images.length > 1 && (
            <div className="thumbnails-row">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`thumbnail-btn ${activeImageIndex === idx ? 'active' : ''}`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          {/* Regional Provenance Notice Card */}
          <div className="provenance-card card">
            <div className="provenance-header">
              <div className="provenance-icon">
                {product.originVerificationStatus === 'INDEPENDENTLY_VERIFIED' ? (
                  <ShieldCheck size={22} color="var(--color-success)" />
                ) : (
                  <Info size={22} color="var(--color-saffron)" />
                )}
              </div>
              <div>
                <h4 className="provenance-title">
                  {product.originVerificationStatus === 'INDEPENDENTLY_VERIFIED'
                    ? 'Independently Verified Regional Origin'
                    : 'Artisan-Declared Regional Craftsmanship'}
                </h4>
                <div className="provenance-subtitle">
                  {product.originVerificationStatus === 'INDEPENDENTLY_VERIFIED'
                    ? 'Verified by cluster documentation and cooperative checks'
                    : 'Claimed by artisan; pending full platform cluster audit'}
                </div>
              </div>
            </div>
            <p className="provenance-details">
              <b>Claimed Origin:</b> {product.claimedOrigin}
            </p>
            <p className="provenance-notes">{product.originVerificationDetails}</p>
          </div>
        </div>

        {/* RIGHT: Product Information & Purchase Action */}
        <div className="info-column">
          {/* Category & Craft Badge */}
          <div className="detail-tags-row">
            <span className="craft-badge">{product.craftType}</span>
            {product.festivalName && (
              <span className="festival-badge">
                <Calendar size={12} /> {product.festivalName}
              </span>
            )}
            <span className="origin-pill">
              <MapPin size={12} /> {product.townVillage ? `${product.townVillage}, ` : ''}{product.district}, {product.state}
            </span>
          </div>

          <h1 className="product-title-detail">{product.name}</h1>

          {/* Artisan Sub-Header */}
          <div className="artisan-header-row">
            <span>Handcrafted by: </span>
            <Link to={`/artisans/${product.artisan?._id}`} className="artisan-direct-link">
              <b>{product.artisan?.businessName}</b>
            </Link>
            {product.artisan?.verificationStatus === 'VERIFIED' && (
              <span className="verified-chip-inline">
                <CheckCircle size={14} /> Certified Artisan
              </span>
            )}
          </div>

          {/* Price and Ratings */}
          <div className="price-rating-section">
            <div className="price-wrapper">
              <span className="detail-current-price">₹{product.price?.toLocaleString('en-IN')}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="detail-original-price">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                  <span className="savings-tag">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <div className="rating-pill-detail">
              <span>⭐ {product.ratingAverage?.toFixed(1) || '5.0'}</span>
              <span className="rating-count-detail">({product.numReviews} Verified Reviews)</span>
            </div>
          </div>

          {/* Inventory & Preparation Times */}
          <div className="timing-grid">
            <div className="timing-box">
              <Clock size={16} />
              <div>
                <span className="timing-label">Preparation Time</span>
                <span className="timing-value">{product.preparationTimeDays} Days Handcrafting</span>
              </div>
            </div>
            <div className="timing-box">
              <Truck size={16} />
              <div>
                <span className="timing-label">Estimated Dispatch</span>
                <span className="timing-value">{product.estimatedDispatchDays} Days from Workshop</span>
              </div>
            </div>
          </div>

          {/* Stock Availability */}
          <div className="stock-alert-bar">
            {product.isMadeToOrder ? (
              <span className="stock-status-text text-saffron">
                ✨ <b>Made to Order:</b> Specially handcrafted upon order placement.
              </span>
            ) : product.stock > 0 ? (
              <span className="stock-status-text text-success">
                ✓ <b>In Stock:</b> {product.stock} pieces ready in artisan workshop.
              </span>
            ) : (
              <span className="stock-status-text text-danger">
                ✗ <b>Currently Sold Out</b>
              </span>
            )}
          </div>

          {/* Purchase Controls */}
          <div className="purchase-controls-box">
            <div className="quantity-selector">
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => {
                  const max = product.isMadeToOrder ? 99 : product.stock;
                  setQuantity((q) => Math.min(max, q + 1));
                }}
                disabled={!product.isMadeToOrder && quantity >= product.stock}
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.isMadeToOrder && product.stock <= 0}
              className="btn btn-primary btn-lg add-to-cart-action-btn"
            >
              <ShoppingBag size={20} />
              {addedMessage ? 'Added to Cart!' : 'Add to Shopping Cart'}
            </button>
          </div>

          {/* Description */}
          <div className="product-description-section">
            <h3>About This Handcrafted Piece</h3>
            <p className="detail-desc-text">{product.description}</p>
          </div>

          {/* Artisan Profile Mini-Banner */}
          {product.artisan && (
            <div className="artisan-feature-box card">
              <div className="artisan-avatar-sm">
                <img
                  src={product.artisan.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80'}
                  alt={product.artisan.businessName}
                />
              </div>
              <div className="artisan-info-sm">
                <h4>{product.artisan.businessName}</h4>
                <p className="artisan-spec">{product.artisan.craftSpecialization} • {product.artisan.townVillage}, {product.artisan.state}</p>
                <p className="artisan-bio-preview">{product.artisan.bio}</p>
                <Link to={`/artisans/${product.artisan._id}`} className="artisan-view-link">
                  View Full Artisan Story & Workshop <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <section className="section section-bg" style={{ marginTop: '4rem' }}>
        <div className="container container-narrow">
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <h2>Verified Customer Reviews</h2>
            <p>Direct feedback from customers who received this handcrafted piece.</p>
          </div>

          {/* Review Submission Form */}
          <div className="review-form-card card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Review This Handcrafted Product</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Only verified purchasers who have received a delivered order of this item are eligible to submit reviews.
            </p>

            {reviewMsg && (
              <div className={`alert ${reviewMsg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {reviewMsg.text}
              </div>
            )}

            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div className="star-rating-select">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="star-btn"
                    >
                      <Star
                        size={24}
                        fill={star <= rating ? '#D97706' : 'none'}
                        color={star <= rating ? '#D97706' : '#A8A29E'}
                      />
                    </button>
                  ))}
                  <span style={{ marginLeft: '0.5rem', fontWeight: 600 }}>{rating} out of 5</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Stunning woodwork and intricate details!"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Detailed Review</label>
                <textarea
                  rows="4"
                  placeholder="Describe the craft quality, packaging, and traditions reflected in the product..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="form-textarea"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="btn btn-primary"
              >
                {submittingReview ? 'Submitting...' : 'Submit Verified Review'}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                No reviews yet. Be the first verified customer to share your thoughts after delivery!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="review-item card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="user-avatar-circle">{rev.userName?.charAt(0) || 'U'}</div>
                      <span style={{ fontWeight: 700 }}>{rev.userName}</span>
                      {rev.isVerifiedPurchase && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 600 }}>
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.5rem' }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={15}
                        fill={i < rev.rating ? '#D97706' : 'none'}
                        color={i < rev.rating ? '#D97706' : '#A8A29E'}
                      />
                    ))}
                  </div>

                  {rev.title && <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>{rev.title}</h4>}
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <style>{`
        .product-detail-page {
          padding-bottom: 5rem;
        }
        .breadcrumb-bar {
          background-color: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          padding: 0.85rem 0;
          margin-bottom: 2.5rem;
          font-size: 0.85rem;
        }
        .breadcrumb-inner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-muted);
        }
        .breadcrumb-inner a:hover {
          color: var(--color-terracotta);
        }
        .current-crumb {
          color: var(--color-text-main);
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .detail-layout {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 3.5rem;
          align-items: start;
        }

        .main-image-frame {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
          background: #FFFFFF;
          margin-bottom: 1rem;
        }
        .main-display-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .wishlist-float-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-md);
        }

        .thumbnails-row {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
        }
        .thumbnail-btn {
          width: 75px;
          height: 75px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          padding: 0;
          background: none;
        }
        .thumbnail-btn.active {
          border-color: var(--color-terracotta);
        }
        .thumbnail-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .provenance-card {
          padding: 1.25rem;
          background-color: var(--color-surface-soft);
          border: 1px solid var(--color-border);
        }
        .provenance-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .provenance-title {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-maroon);
        }
        .provenance-subtitle {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .provenance-details {
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
        }
        .provenance-notes {
          font-size: 0.82rem;
          color: var(--color-text-muted);
          line-height: 1.4;
        }

        .detail-tags-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
        }
        .craft-badge {
          background-color: var(--color-terracotta-light);
          color: var(--color-terracotta-dark);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }
        .festival-badge {
          background-color: var(--color-saffron-light);
          color: var(--color-saffron-dark);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .origin-pill {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 500;
        }

        .product-title-detail {
          font-size: 2.15rem;
          line-height: 1.25;
          margin-bottom: 0.75rem;
        }
        .artisan-header-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          color: var(--color-text-muted);
        }
        .artisan-direct-link {
          color: var(--color-maroon);
          text-decoration: underline;
        }
        .verified-chip-inline {
          color: var(--color-success);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
        }

        .price-rating-section {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding: 1.25rem 0;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 1.5rem;
        }
        .price-wrapper {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
        }
        .detail-current-price {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--color-maroon);
        }
        .detail-original-price {
          font-size: 1.15rem;
          color: var(--color-text-light);
          text-decoration: line-through;
        }
        .savings-tag {
          background-color: var(--color-success-bg);
          color: var(--color-success);
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        .rating-pill-detail {
          font-size: 0.9rem;
          font-weight: 700;
        }
        .rating-count-detail {
          color: var(--color-text-muted);
          font-weight: normal;
          margin-left: 0.25rem;
        }

        .timing-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .timing-box {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          padding: 0.85rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--color-terracotta);
        }
        .timing-label {
          display: block;
          font-size: 0.74rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }
        .timing-value {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-main);
        }

        .stock-alert-bar {
          margin-bottom: 1.5rem;
        }
        .stock-status-text {
          font-size: 0.88rem;
        }
        .text-success { color: var(--color-success); }
        .text-saffron { color: var(--color-saffron-dark); }
        .text-danger { color: var(--color-danger); }

        .purchase-controls-box {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .quantity-selector {
          display: flex;
          align-items: center;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .qty-btn {
          background: var(--color-surface-soft);
          border: none;
          width: 42px;
          height: 44px;
          font-size: 1.15rem;
          cursor: pointer;
          transition: var(--transition);
        }
        .qty-btn:hover {
          background: var(--color-surface-hover);
        }
        .qty-value {
          width: 45px;
          text-align: center;
          font-weight: 700;
        }
        .add-to-cart-action-btn {
          flex: 1;
        }

        .product-description-section {
          margin-bottom: 2.25rem;
        }
        .product-description-section h3 {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .detail-desc-text {
          font-size: 0.95rem;
          line-height: 1.65;
          color: var(--color-text-muted);
        }

        .artisan-feature-box {
          padding: 1.5rem;
          display: flex;
          gap: 1.25rem;
        }
        .artisan-avatar-sm {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px solid var(--color-terracotta-light);
        }
        .artisan-avatar-sm img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .artisan-info-sm h4 {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          margin-bottom: 0.25rem;
        }
        .artisan-spec {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-terracotta);
          margin-bottom: 0.5rem;
        }
        .artisan-bio-preview {
          font-size: 0.84rem;
          color: var(--color-text-muted);
          line-height: 1.45;
          margin-bottom: 0.75rem;
        }
        .artisan-view-link {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-maroon);
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .star-rating-select {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .star-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        @media (max-width: 900px) {
          .detail-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailPage;
