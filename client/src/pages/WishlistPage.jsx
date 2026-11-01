import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/product/ProductCard';

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <div className="empty-wishlist-card card" style={{ padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>❤️</div>
          <h2>Your Wishlist is Empty</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '0.75rem 0 1.5rem' }}>
            Save your favorite regional handcrafted artifacts and pooja treasures to visit them anytime.
          </p>
          <Link to="/products" className="btn btn-primary">
            Explore Handcrafted Treasures <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page" style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>My Saved Heritage Wishlist</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>
          {wishlist.length} {wishlist.length === 1 ? 'handcrafted item' : 'handcrafted items'} saved for your home and festivities.
        </p>

        <div className="grid grid-4">
          {wishlist.map((item) => (
            <ProductCard key={item._id || item} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
