import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    fetchWishlistArtworks();
  }, [wishlist.length]); // Re-fetch if items are removed

  const fetchWishlistArtworks = async () => {
    try {
      const { data } = await API.get('/users/wishlist');
      setArtworks(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 pt-32 pb-16 px-6 flex justify-center">
        <div className="w-8 h-8 border-2 border-primary-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 pt-32 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500 mb-2">Your Collection</p>
          <h1 className="text-4xl font-serif font-bold text-primary-950">Wishlist</h1>
        </div>

        {artworks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <svg className="w-16 h-16 mx-auto text-primary-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-xl font-serif text-primary-950">Your wishlist is empty</p>
            <p className="text-sm text-primary-500 mt-2 mb-6">Save artworks you love to find them later.</p>
            <Link to="/gallery" className="px-8 py-3 bg-primary-950 text-white text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-accent-hover transition-colors">
              Explore Gallery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
            {artworks.map((artwork) => {
              const inCart = cartItems.some((i) => i._id === artwork._id);
              return (
                <div key={artwork._id} className="group relative">
                  <Link to={`/gallery/${artwork._id}`}>
                    <div className="aspect-[4/5] overflow-hidden bg-surface-200 mb-4 rounded-3xl shadow-sm border border-gray-200/50 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] group-hover:-translate-y-2 transition-all duration-700 ease-out">
                      {artwork.image_url ? (
                        <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary-400">
                          No Image
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Remove from wishlist button overlay */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(artwork._id);
                    }}
                    className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-red-500 shadow-sm hover:scale-110 transition-transform z-10"
                    title="Remove from Wishlist"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>

                  <div className="px-1">
                    <p className="text-[10px] text-primary-500 uppercase tracking-wider font-semibold">{artwork.artist_id?.name || 'Unknown'}</p>
                    <Link to={`/gallery/${artwork._id}`}>
                      <h3 className="font-serif text-base text-primary-950 mt-1 truncate group-hover:underline">{artwork.title}</h3>
                    </Link>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-medium text-primary-700">₹{artwork.price?.toLocaleString('en-IN')}</span>
                      {artwork.status === 'Sold' && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Sold</span>
                      )}
                    </div>

                    {artwork.status === 'Available' && (
                      <button
                        onClick={() => addToCart(artwork)}
                        disabled={inCart}
                        className={`mt-4 w-full py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors ${
                          inCart
                            ? 'bg-primary-50 text-primary-500 border border-primary-200 cursor-default'
                            : 'bg-primary-950 text-white hover:bg-accent-hover'
                        }`}
                      >
                        {inCart ? 'In Cart' : 'Add to Cart'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
