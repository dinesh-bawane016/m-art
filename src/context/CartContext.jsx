import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Dynamically load cart data tied specifically to the logged-in user
  useEffect(() => {
    if (user && user.role === 'Buyer') {
      const saved = localStorage.getItem(`mart_cart_${user._id}`);
      setCartItems(saved ? JSON.parse(saved) : []);
    } else {
      // Intentionally clear memory if guest, artist, or admin
      setCartItems([]);
    }
  }, [user]);

  // Persist cart updates uniquely to this user's registry
  useEffect(() => {
    if (user && user.role === 'Buyer') {
      localStorage.setItem(`mart_cart_${user._id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = (artwork) => {
    setCartItems((prev) => {
      if (prev.find((item) => item._id === artwork._id)) return prev;
      return [...prev, artwork];
    });
  };

  const removeFromCart = (artworkId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== artworkId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const cartCount = cartItems.length;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
