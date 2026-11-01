import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, MapPin, CheckCircle, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getImageUrl } from '../../utils/imageUrl';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFavorited = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const imageSrc = getImageUrl(product.images?.[0]);

  return (
    <div className="product-card card">
      {/* Top Media & Badges */}
      <div className="card-media-wrapper">
        <Link to={`/products/${product._id}`}>
          <img
            src={imageSrc}
            alt={product.name}
            className="product-img"
            loading="lazy"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`wishlist-toggle-btn ${isFavorited ? 'active' : ''}`}
          title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={18} fill={isFavorited ? 'var(--color-danger)' : 'none'} color={isFavorited ? 'var(--color-danger)' : '#1C1917'} />
        </button>

        {/* Origin / Cluster Badge */}
        <div className="media-origin-badge">
          <MapPin size={12} />
          <span>{product.district ? `${product.district}, ${product.state}` : product.state}</span>
        </div>

        {/* Made to order / stock badge */}
        {product.isMadeToOrder ? (
          <div className="badge-made-to-order">Made to Order</div>
        ) : product.stock <= 3 && product.stock > 0 ? (
          <div className="badge-low-stock">Only {product.stock} Left</div>
        ) : null}
      </div>

      {/* Content Details */}
      <div className="product-card-body">
        {/* Craft Type & Artisan */}
        <div className="product-craft-meta">
          <span className="craft-tag">{product.craftType || product.categoryName}</span>
          {product.artisan?.verificationStatus === 'VERIFIED' && (
            <span className="verified-artisan-chip" title="Independently Verified Regional Artisan">
              <CheckCircle size={12} /> Verified
            </span>
          )}
        </div>

        {/* Artisan Business */}
        <Link to={`/artisans/${product.artisan?._id || ''}`} className="artisan-name-link">
          by {product.artisan?.businessName || 'Master Craftsman'}
        </Link>

        {/* Product Title */}
        <h3 className="product-title">
          <Link to={`/products/${product._id}`}>{product.name}</Link>
        </h3>

        {/* Price & Rating Row */}
        <div className="product-price-row">
          <div className="price-block">
            <span className="current-price">₹{product.price?.toLocaleString('en-IN')}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
            )}
          </div>

          {product.ratingAverage > 0 && (
            <div className="rating-pill">
              ⭐ {product.ratingAverage.toFixed(1)}
              {product.numReviews > 0 && <span className="review-count">({product.numReviews})</span>}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="product-card-footer">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`btn btn-sm btn-primary add-cart-btn ${addedAnimation ? 'added' : ''}`}
            disabled={!product.isMadeToOrder && product.stock <= 0}
          >
            <ShoppingBag size={15} />
            {addedAnimation ? 'Added!' : product.stock <= 0 && !product.isMadeToOrder ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <style>{`
        .product-card {
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
          height: 100%;
        }
        .card-media-wrapper {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
          background-color: var(--color-surface-soft);
        }
        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.45s ease;
        }
        .product-card:hover .product-img {
          transform: scale(1.05);
        }

        .wishlist-toggle-btn {
          position: absolute;
          top: 0.65rem;
          right: 0.65rem;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
          transition: var(--transition);
        }
        .wishlist-toggle-btn:hover {
          transform: scale(1.1);
          background: #FFFFFF;
        }

        .media-origin-badge {
          position: absolute;
          bottom: 0.65rem;
          left: 0.65rem;
          background: rgba(28, 25, 23, 0.8);
          color: #FFFDF9;
          backdrop-filter: blur(4px);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .badge-made-to-order {
          position: absolute;
          top: 0.65rem;
          left: 0.65rem;
          background-color: var(--color-saffron);
          color: #FFF;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }
        .badge-low-stock {
          position: absolute;
          top: 0.65rem;
          left: 0.65rem;
          background-color: var(--color-danger);
          color: #FFF;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        .product-card-body {
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .product-craft-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.35rem;
        }
        .craft-tag {
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--color-terracotta);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .verified-artisan-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--color-success);
        }

        .artisan-name-link {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          margin-bottom: 0.4rem;
          display: block;
        }
        .artisan-name-link:hover {
          color: var(--color-maroon);
          text-decoration: underline;
        }

        .product-title {
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text-main);
          line-height: 1.35;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.7rem;
        }
        .product-title a:hover {
          color: var(--color-terracotta);
        }

        .product-price-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-top: auto;
          margin-bottom: 1rem;
        }
        .price-block {
          display: flex;
          align-items: baseline;
          gap: 0.45rem;
        }
        .current-price {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-maroon);
        }
        .original-price {
          font-size: 0.85rem;
          color: var(--color-text-light);
          text-decoration: line-through;
        }

        .rating-pill {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-text-main);
          background: var(--color-surface-soft);
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-sm);
        }
        .review-count {
          color: var(--color-text-muted);
          font-weight: 500;
          margin-left: 0.15rem;
        }

        .product-card-footer {
          margin-top: auto;
        }
        .add-cart-btn {
          width: 100%;
          transition: var(--transition);
        }
        .add-cart-btn.added {
          background-color: var(--color-success);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
