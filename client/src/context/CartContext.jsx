import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('festiveroots_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('festiveroots_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((it) => it.productId === product._id);
      if (existing) {
        const maxStock = product.isMadeToOrder ? 99 : product.stock;
        const newQty = Math.min(existing.quantity + quantity, maxStock);
        return prevItems.map((it) =>
          it.productId === product._id ? { ...it, quantity: newQty } : it
        );
      } else {
        return [
          ...prevItems,
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            craftType: product.craftType || '',
            artisanName: product.artisan?.businessName || 'Artisan',
            stock: product.stock,
            isMadeToOrder: product.isMadeToOrder,
            quantity: Math.max(1, quantity)
          }
        ];
      }
    });
  };

  // Remove item
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((it) => it.productId !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((it) => {
        if (it.productId === productId) {
          const maxStock = it.isMadeToOrder ? 99 : it.stock;
          return { ...it, quantity: Math.min(quantity, maxStock) };
        }
        return it;
      })
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Subtotal & Calculations
  const subtotal = cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const deliveryCharge = subtotal >= 999 || subtotal === 0 ? 0 : 80;
  const totalAmount = subtotal + deliveryCharge;
  const totalItemsCount = cartItems.reduce((count, it) => count + it.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryCharge,
        totalAmount,
        totalItemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
