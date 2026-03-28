import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);

  const inCart = cartItems.some((i) => i._id === artwork?._id);
  const inWishlist = wishlist.includes(artwork?._id);

  useEffect(() => {
    API.get(`/artworks/${id}`)
      .then((res) => setArtwork(res.data))
      .catch(() => navigate('/gallery'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!artwork) return null;

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary-500 mb-10">
          <Link to="/gallery" className="hover:text-primary-950 transition-colors">Gallery</Link>
          <span>›</span>
          <span className="text-primary-950">{artwork.title}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start mt-8">
          {/* Image */}
          <div className="w-full md:w-3/5">
            {artwork.image_url ? (
              <img 
                src={artwork.image_url} 
                alt={artwork.title} 
                className="w-full h-auto object-cover" 
              />
            ) : (
              <div className="w-full h-[500px] flex items-center justify-center bg-surface-100 text-primary-400">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="w-full md:w-2/5 md:pl-4 lg:pl-8">
            <h1 className="text-3xl sm:text-4xl font-serif text-primary-950 leading-tight" id="artwork-title">{artwork.title}</h1>
            
            {/* Artist */}
            <div className="mt-4">
              <Link to={`/artist/${artwork.artist_id?._id}`} className="text-lg text-primary-950 hover:underline">
                {artwork.artist_id?.name || 'Unknown Artist'}
              </Link>
            </div>

            <div className="mt-6 space-y-1">
              <p className="text-sm text-primary-700">{artwork.category}</p>
              {artwork.size && <p className="text-sm text-primary-700">{artwork.size}</p>}
              <p className="text-sm text-primary-700">Listed on {new Date(artwork.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="text-sm text-primary-700">Ready to Hang</p>
            </div>

            {/* Price */}
            <div className="mt-8">
              <p className="text-3xl font-serif text-primary-950">
                ₹{artwork.price?.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Actions */}
            {artwork.status === 'Available' && (!user || user.role === 'Buyer') && (
              <div className="flex flex-col gap-3 mt-8">
                <button
                  onClick={() => addToCart(artwork)}
                  disabled={inCart}
                  className={`w-full py-4 text-xs font-semibold uppercase tracking-widest transition-colors ${
                    inCart
                      ? 'bg-primary-950 text-white cursor-default'
                      : 'bg-primary-950 text-white hover:bg-accent-hover'
                  }`}
                  id="add-to-cart-btn"
                >
                  {inCart ? 'ADDED TO CART' : 'ADD TO CART'}
                </button>
                <button
                  onClick={() => toggleWishlist(artwork._id)}
                  className="w-full py-4 text-xs font-semibold uppercase tracking-widest border border-primary-950 text-primary-950 hover:bg-surface-100 transition-colors"
                >
                  {inWishlist ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
                </button>
              </div>
            )}

            {artwork.status === 'Sold' && (
              <div className="mt-8 py-4 text-center border border-red-300 text-red-700 text-xs font-semibold uppercase tracking-widest">
                This Artwork Has Been Sold
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
