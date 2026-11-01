import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        // Fallback to local storage
        try {
          const localSaved = localStorage.getItem('festiveroots_wishlist');
          setWishlist(localSaved ? JSON.parse(localSaved) : []);
        } catch {
          setWishlist([]);
        }
        return;
      }

      try {
        setLoading(true);
        const res = await api.get('/wishlist');
        if (res.data.success) {
          setWishlist(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load wishlist from server:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  const toggleWishlist = async (product) => {
    const productId = product._id || product.productId || product;
    const exists = wishlist.some((item) => (item._id || item) === productId);

    if (exists) {
      // Remove
      setWishlist((prev) => prev.filter((item) => (item._id || item) !== productId));
      if (isAuthenticated) {
        try {
          await api.delete(`/wishlist/${productId}`);
        } catch (e) {
          console.error(e);
        }
      } else {
        localStorage.setItem(
          'festiveroots_wishlist',
          JSON.stringify(wishlist.filter((item) => (item._id || item) !== productId))
        );
      }
    } else {
      // Add
      const updated = [...wishlist, product];
      setWishlist(updated);
      if (isAuthenticated) {
        try {
          await api.post(`/wishlist/${productId}`);
        } catch (e) {
          console.error(e);
        }
      } else {
        localStorage.setItem('festiveroots_wishlist', JSON.stringify(updated));
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
