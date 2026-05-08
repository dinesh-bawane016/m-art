import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

gsap.registerPlugin(ScrollTrigger);

/* ─── Sub-Components ─────────────────────────────────── */

const StarRating = ({ rating, size = 'sm' }) => {
  const s = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`${s} ${i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

/* ─── Artwork Card ────────────────────────────────────── */

const ArtworkCard = ({ artwork, artist, isHero = false, user, addToCart, cartItems, wishlist, toggleWishlist }) => {
  const inCart = cartItems.some(i => i._id === artwork._id);
  const inWishlist = wishlist.includes(artwork._id);
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.fromTo(el,
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  }, []);

  if (isHero) {
    return (
      <div ref={cardRef} className="relative group w-full" style={{ opacity: 0 }}>
        <Link to={`/gallery/${artwork._id}`}>
          <div className="relative overflow-hidden bg-gray-100" style={{ height: '70vh' }}>
            {artwork.image_url
              ? <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" loading="lazy" />
              : <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No Image</div>
            }
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 mb-2">Featured Work</p>
              <h3 className="font-serif text-3xl md:text-4xl font-bold">{artwork.title}</h3>
              <p className="mt-2 text-white/80 text-sm">₹{artwork.price?.toLocaleString('en-IN')}</p>
            </div>
            {artwork.status === 'Sold' && (
              <div className="absolute top-6 right-6 bg-white/90 text-red-600 text-[10px] uppercase tracking-widest font-bold px-3 py-1">SOLD</div>
            )}
          </div>
        </Link>
        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
          <div className="flex gap-3">
            {user && user.role === 'Buyer' && (
              <button onClick={() => toggleWishlist(artwork._id)} className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                <svg className={`w-4 h-4 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'fill-transparent text-gray-500'}`} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                Save
              </button>
            )}
          </div>
          {artwork.status === 'Available' && (!user || user.role === 'Buyer') && (
            <button
              onClick={() => addToCart(artwork)}
              disabled={inCart}
              className={`text-[10px] uppercase tracking-widest font-bold px-6 py-2.5 transition-colors ${inCart ? 'bg-gray-100 text-gray-400 cursor-default' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              {inCart ? 'In Cart' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="group relative" style={{ opacity: 0 }}>
      <Link to={`/gallery/${artwork._id}`}>
        <div className="relative overflow-hidden bg-gray-100 aspect-[4/5]">
          {artwork.image_url
            ? <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Image</div>
          }
          {artwork.status === 'Sold' && (
            <div className="absolute top-3 right-3 bg-white text-red-600 text-[9px] uppercase tracking-widest font-bold px-2 py-0.5">SOLD</div>
          )}
          {user && user.role === 'Buyer' && (
            <button
              onClick={e => { e.preventDefault(); toggleWishlist(artwork._id); }}
              className="absolute top-3 left-3 p-1.5 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className={`w-4 h-4 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'fill-transparent text-gray-500'}`} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          )}
        </div>
      </Link>
      <div className="pt-3">
        <h3 className="font-serif text-sm text-black truncate">{artwork.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">₹{artwork.price?.toLocaleString('en-IN')}</span>
        </div>
        {artwork.status === 'Available' && (!user || user.role === 'Buyer') && (
          <button
            onClick={() => addToCart(artwork)}
            disabled={inCart}
            className={`mt-3 w-full text-[9px] uppercase tracking-widest font-bold py-2 transition-colors ${inCart ? 'bg-gray-100 text-gray-400 cursor-default' : 'border border-black text-black hover:bg-black hover:text-white'}`}
          >
            {inCart ? 'In Cart' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────────── */

const ArtistProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  // GSAP refs
  const heroRef = useRef(null);
  const nameRef = useRef(null);
  const taglineRef = useRef(null);
  const metaRef = useRef(null);
  const dividerRef = useRef(null);

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
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // GSAP hero entrance
  useEffect(() => {
    if (!profile) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // Animate the name by splitting into chars
      const nameEl = nameRef.current;
      if (nameEl) {
        const chars = nameEl.textContent.split('');
        nameEl.innerHTML = chars.map(c => `<span class="inline-block" style="opacity:0;transform:translateY(60px)">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
        tl.to(nameEl.querySelectorAll('span'), {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.03, ease: 'power3.out'
        }, 0.2);
      }

      tl.fromTo(taglineRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.6)
        .fromTo(metaRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, 0.9)
        .fromTo(dividerRef.current, { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 1.2, ease: 'power4.inOut' }, 0.4);
    }, heroRef);
    return () => ctx.revert();
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white pt-32 text-center px-4">
        <h1 className="text-3xl font-serif text-black">Artist Not Found</h1>
        <p className="mt-4 text-gray-400 text-sm">The artist you're looking for doesn't exist or isn't verified yet.</p>
        <Link to="/gallery" className="inline-block mt-8 px-8 py-3 border border-black text-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
          Back to Gallery
        </Link>
      </div>
    );
  }

  const { artist, artworks } = profile;
  const [heroArtwork, ...restArtworks] = artworks;

  const sharedCardProps = { artist, user, addToCart, cartItems, wishlist, toggleWishlist };

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO: Cinematic Artist Intro ── */}
      <section ref={heroRef} className="pt-28 pb-0 px-6 md:px-16 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">

          {/* Left: Identity Column */}
          <div className="md:col-span-5 lg:col-span-4">
            {/* Verified Badge */}
            <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-6">Verified Artist · M-Art</p>

            {/* Avatar */}
            <div className="mb-8">
              {artist.avatar_url
                ? <img src={artist.avatar_url} alt={artist.name} className="w-20 h-20 object-cover grayscale contrast-125" />
                : <div className="w-20 h-20 bg-black flex items-center justify-center text-white font-serif font-bold text-3xl">{artist.name[0]}</div>
              }
            </div>

            {/* Name — GSAP animates chars */}
            <h1 ref={nameRef} className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-none tracking-tight">
              {artist.name}
            </h1>

            {/* Animated horizontal rule */}
            <div ref={dividerRef} className="h-px bg-black mt-6 mb-6 w-full" style={{ transform: 'scaleX(0)' }} />

            {/* Tagline / Bio placeholder */}
            <p ref={taglineRef} className="text-sm text-gray-500 leading-relaxed max-w-xs" style={{ opacity: 0 }}>
              Independent artist based in India. Exploring form, colour, and the human condition through original works.
            </p>

            {/* Meta info */}
            <div ref={metaRef} className="mt-8 space-y-3" style={{ opacity: 0 }}>
              <div className="flex items-center gap-3">
                <StarRating rating={avgRating} size="sm" />
                <span className="text-xs text-gray-400">{avgRating.toFixed(1)} · {reviews.length} collector reviews</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Member since {new Date(artist.createdAt).getFullYear()}</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">{artworks.length} original {artworks.length === 1 ? 'work' : 'works'}</p>
            </div>
          </div>

          {/* Right: Hero Artwork */}
          <div className="md:col-span-7 lg:col-span-8">
            {heroArtwork
              ? <ArtworkCard artwork={heroArtwork} isHero {...sharedCardProps} />
              : (
                <div className="w-full bg-gray-50 flex items-center justify-center text-gray-300 text-sm" style={{ height: '70vh' }}>
                  No artworks yet
                </div>
              )
            }
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO: Editorial Asymmetric Grid ── */}
      {restArtworks.length > 0 && (
        <section className="mt-24 px-6 md:px-16 max-w-screen-xl mx-auto pb-24">
          {/* Section Header */}
          <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-14">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-1">Complete Works</p>
              <h2 className="font-serif text-2xl font-bold text-black">Portfolio</h2>
            </div>
            <span className="text-xs text-gray-400 tracking-widest uppercase">{artworks.length} pieces</span>
          </div>

          {/* Asymmetric 3-column masonry-style grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            {restArtworks.map((artwork, index) => (
              <div key={artwork._id} className={index % 5 === 2 ? 'md:col-span-1 md:mt-16' : ''}>
                <ArtworkCard artwork={artwork} {...sharedCardProps} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── REVIEWS: Editorial Pull-Quote Style ── */}
      <section className="border-t border-gray-100 bg-[#F7F6F4]">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-2">What Collectors Say</p>
            <h2 className="font-serif text-3xl font-bold text-black">Reviews</h2>
            {reviews.length > 0 && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <StarRating rating={avgRating} size="lg" />
                <span className="text-sm text-gray-500">{avgRating.toFixed(1)} out of 5</span>
              </div>
            )}
          </div>

          {reviews.length === 0 ? (
            <p className="text-center text-gray-400 text-sm tracking-wide">No reviews yet. Be the first collector.</p>
          ) : (
            <div className="space-y-px">
              {reviews.map((review, index) => {
                const reviewRef = { current: null };
                return (
                  <div
                    key={review._id}
                    ref={el => { reviewRef.current = el; }}
                    className="py-8 border-b border-gray-200 grid grid-cols-12 gap-6"
                  >
                    {/* Reviewer */}
                    <div className="col-span-12 md:col-span-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-black flex items-center justify-center text-white text-xs font-bold uppercase overflow-hidden flex-shrink-0">
                          {review.buyer_id?.avatar_url
                            ? <img src={review.buyer_id.avatar_url} alt="" className="w-full h-full object-cover" />
                            : (review.buyer_id?.name?.[0] || '?')
                          }
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-black">{review.buyer_id?.name || 'Anonymous'}</p>
                          <p className="text-[9px] text-gray-400 uppercase tracking-wider">{new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                      {review.artwork_id?.title && (
                        <p className="text-[9px] text-gray-400 mt-2 uppercase tracking-wider">On: <span className="italic normal-case text-gray-500">{review.artwork_id.title}</span></p>
                      )}
                    </div>

                    {/* Review Text */}
                    <div className="col-span-12 md:col-span-9">
                      <p className="text-sm text-gray-700 leading-relaxed font-light">
                        <span className="text-2xl font-serif text-gray-300 leading-none mr-1">"</span>
                        {review.comment}
                        <span className="text-2xl font-serif text-gray-300 leading-none ml-1">"</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default ArtistProfile;
