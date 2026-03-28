import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const ArtistProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    Promise.all([
      API.get(`/users/artist/${id}`),
      API.get(`/reviews/artist/${id}`)
    ])
      .then(([profileRes, reviewsRes]) => {
        setProfile(profileRes.data);
        setReviews(reviewsRes.data.reviews || []);
        setAvgRating(reviewsRes.data.avgRating || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16 px-6 flex justify-center">
        <div className="w-8 h-8 border-2 border-primary-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white pt-32 text-center px-4">
        <h1 className="text-3xl font-serif text-primary-950">Artist Not Found</h1>
        <p className="mt-4 text-primary-500">The artist you're looking for doesn't exist or isn't verified yet.</p>
        <Link to="/gallery" className="inline-block mt-8 px-8 py-3 bg-primary-950 text-white text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-accent-hover transition-colors">
          Back to Gallery
        </Link>
      </div>
    );
  }

  const { artist, artworks } = profile;

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-20">
      {/* Header Profile Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center text-center">
          {artist.avatar_url ? (
            <img src={artist.avatar_url} alt={artist.name} className="w-32 h-32 rounded-full object-cover shadow-sm mb-6 border border-gray-100" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-surface-200 flex items-center justify-center text-primary-950 font-serif font-bold text-4xl mb-6 shadow-sm border border-gray-100">
              {artist.name[0]}
            </div>
          )}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500 mb-2">Verified Artist</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-950">{artist.name}</h1>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-primary-950">{avgRating}</span>
            <span className="text-sm text-primary-500">({reviews.length} reviews)</span>
          </div>
          <p className="mt-4 text-sm text-primary-600 max-w-xl leading-relaxed">
            Member since {new Date(artist.createdAt).getFullYear()}
          </p>
        </div>
      </div>

      {/* Artworks Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-serif font-bold text-primary-950 mb-10 text-center">Portfolio ({artworks.length})</h2>

        {artworks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
            <p className="text-xl font-serif text-primary-950">No artworks yet</p>
            <p className="text-sm text-primary-500 mt-2">This artist hasn't uploaded any artworks.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
            {artworks.map((artwork) => {
              const inCart = cartItems.some((i) => i._id === artwork._id);
              const inWishlist = wishlist.includes(artwork._id);

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

                  {/* Wishlist Button Overlay */}
                  {user && user.role === 'Buyer' && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(artwork._id);
                      }}
                      className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform z-10"
                      title="Wishlist"
                    >
                      <svg className={`w-5 h-5 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'fill-transparent text-gray-500'}`} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  )}

                  <div className="px-1">
                    <p className="text-[10px] text-primary-500 uppercase tracking-wider font-semibold">{artist.name}</p>
                    <Link to={`/gallery/${artwork._id}`}>
                      <h3 className="font-serif text-base text-primary-950 mt-1 truncate group-hover:underline">{artwork.title}</h3>
                    </Link>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-medium text-primary-700">₹{artwork.price?.toLocaleString('en-IN')}</span>
                      {artwork.status === 'Sold' && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Sold</span>
                      )}
                    </div>

                    {artwork.status === 'Available' && (!user || user.role === 'Buyer') && (
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

      {/* Reviews Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-200">
        <h2 className="text-2xl font-serif font-bold text-primary-950 mb-10 text-center">Collector Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-center text-primary-500">No reviews yet.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review._id} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-200 flex items-center justify-center text-primary-950 font-bold uppercase overflow-hidden">
                      {review.buyer_id?.avatar_url ? (
                        <img src={review.buyer_id.avatar_url} alt="Buyer" className="w-full h-full object-cover" />
                      ) : (
                        review.buyer_id?.name[0] || '?'
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-950">{review.buyer_id?.name || 'Anonymous'}</p>
                      <p className="text-xs text-primary-500">Purchased: <span className="text-primary-700 italic">{review.artwork_id?.title}</span></p>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-primary-700 leading-relaxed">{review.comment}</p>
                <p className="text-[10px] text-primary-400 mt-4 uppercase tracking-wider">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ArtistProfile;
