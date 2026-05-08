import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const CATEGORIES = ['All', 'Oil Painting', 'Digital Art', 'Watercolour', 'Acrylic', 'Mixed Media', 'Sculpture', 'Photography'];

const ArtCard = ({ artwork }) => {
  const cardRef = useRef(null);
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  
  const inCart = cartItems.some((i) => i._id === artwork._id);
  const inWishlist = wishlist.includes(artwork._id);

  // GSAP 3D hover tilt effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let gsap;
    import('gsap').then((mod) => {
      gsap = mod.gsap;
    });

    const handleMouseMove = (e) => {
      if (!gsap) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
      });
    };

    const handleMouseLeave = () => {
      if (!gsap) return;
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={cardRef} className="group relative" style={{ transformStyle: 'preserve-3d' }}>
      <Link to={`/gallery/${artwork._id}`}>
        <div className="aspect-[4/5] overflow-hidden bg-surface-200 mb-4 rounded-3xl shadow-sm border border-gray-200/50 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] group-hover:-translate-y-2 transition-all duration-700 ease-out">
          {artwork.image_url ? (
            <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist Button Overlay */}
      {(!user || user.role === 'Buyer') && (
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

      <div style={{ transform: 'translateZ(15px)' }} className="relative z-20">
        <Link to={`/artist/${artwork.artist_id?._id || artwork.artist_id}`}>
          <p className="text-[10px] text-primary-500 uppercase tracking-wider font-semibold hover:text-primary-950 transition-colors inline-block relative z-30">{artwork.artist_id?.name || 'Unknown'}</p>
        </Link>
        <Link to={`/gallery/${artwork._id}`}>
          <h3 className="font-serif text-lg text-primary-950 mt-1 group-hover:underline">{artwork.title}</h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-primary-700">₹{artwork.price?.toLocaleString('en-IN')}</span>
          {artwork.status === 'Sold' && (
            <span className="text-xs font-semibold uppercase tracking-wider text-red-600">Sold</span>
          )}
        </div>

        {artwork.status === 'Available' && (!user || user.role === 'Buyer') && (
          <button
            onClick={() => addToCart(artwork)}
            disabled={inCart}
            className={`mt-3 w-full py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
              inCart
                ? 'bg-white text-primary-500 border border-primary-300 cursor-default'
                : 'bg-primary-950 text-white hover:bg-accent-hover'
            }`}
          >
            {inCart ? '✓ In Cart' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
};

const Gallery = () => {
  const [searchParams] = useSearchParams();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');

  // Sync state with URL params
  useEffect(() => {
    const s = searchParams.get('search');
    const c = searchParams.get('category');
    if (s !== null) setSearch(s);
    if (c !== null) setCategory(c);
  }, [searchParams]);

  useEffect(() => {
    fetchArtworks();
  }, [category, search, minPrice, maxPrice, sort]);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'All') params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (search) params.append('search', search);
      if (sort !== 'newest') params.append('sort', sort);

      const { data } = await API.get(`/artworks?${params.toString()}`);
      setArtworks(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchArtworks();
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-12" id="gallery-header">
          <p className="label-uppercase text-primary-500 mb-3">Discover Art</p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-primary-950">Gallery</h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3 mb-10">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search artworks, artists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 text-sm text-primary-950 placeholder-primary-400 focus:outline-none focus:border-primary-950 transition-colors"
              id="gallery-search"
            />
          </div>
          <button type="submit" className="px-6 py-3 bg-primary-950 text-white text-xs font-semibold uppercase tracking-widest hover:bg-accent-hover transition-colors">
            Search
          </button>
        </form>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                category === cat
                  ? 'bg-primary-950 text-white'
                  : 'bg-white text-primary-700 border border-gray-300 hover:border-primary-950 hover:text-primary-950'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort and Price controls */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-10 bg-surface-100 p-4 rounded-2xl border border-gray-200/50">
          
          {/* Sort */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-primary-500 uppercase tracking-wider font-semibold">Sort By:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 border border-gray-300 text-sm text-primary-950 focus:outline-none focus:border-primary-950 transition-colors bg-white rounded-xl shadow-sm hover:border-gray-400"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <div className="hidden sm:block w-px h-8 bg-gray-300"></div>

          {/* Price range */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-primary-500 uppercase tracking-wider font-semibold">Price:</span>
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-28 px-3 py-2 border border-gray-300 text-sm text-primary-950 placeholder-primary-400 focus:outline-none focus:border-primary-950 transition-colors rounded-xl shadow-sm"
              id="price-min"
            />
            <span className="text-primary-400">—</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-28 px-3 py-2 border border-gray-300 text-sm text-primary-950 placeholder-primary-400 focus:outline-none focus:border-primary-950 transition-colors rounded-xl shadow-sm"
              id="price-max"
            />
          </div>
        </div>

        {/* Results */}
        <p className="text-xs text-primary-500 uppercase tracking-wider font-semibold mb-6">
          {artworks.length} Artworks
        </p>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary-950 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-primary-950">No artworks found</p>
            <p className="text-sm text-primary-500 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8" id="gallery-grid">
            {artworks.map((artwork) => (
              <ArtCard key={artwork._id} artwork={artwork} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
