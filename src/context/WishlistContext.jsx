import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'Buyer') {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data } = await API.get('/users/wishlist');
      setWishlist(data.map(item => item._id)); // store array of IDs for quick lookup
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    }
  };

  const toggleWishlist = async (artworkId) => {
    if (!user) return alert('Please login to use wishlist');
    try {
      const { data } = await API.post(`/users/wishlist/${artworkId}`);
      setWishlist(data.wishlist);
    } catch (err) {
      console.error('Failed to toggle wishlist', err);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
