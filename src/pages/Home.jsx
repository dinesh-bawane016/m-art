import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../utils/api';

const Home = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);

  useEffect(() => {
    API.get('/artworks')
      .then((res) => setFeaturedArtworks(res.data.slice(0, 8)))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Section ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" id="hero-section">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero.png"
            alt="Art gallery interior"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-6 opacity-90">India's Premier Art Marketplace</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-tight">
            Discover Original<br />Art You Love
          </h1>
          <p className="mt-6 text-base sm:text-lg opacity-80 max-w-xl mx-auto leading-relaxed font-light">
            Explore curated collections from verified Indian artists. From classic oil paintings to cutting-edge digital art.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              to="/gallery"
              className="px-10 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-black bg-white hover:bg-gray-100 transition-colors"
              id="hero-browse-btn"
            >
              View All Art
            </Link>
            <Link
              to="/register"
              className="px-10 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white border border-white/70 hover:bg-white hover:text-black transition-colors"
              id="hero-join-btn"
            >
              Sell Your Art
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-px h-8 bg-white/30 animate-pulse"></div>
        </div>
      </section>

      {/* ── Category Strip ── */}
      <section className="border-b border-gray-200 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8">
          {['Paintings', 'Digital Art', 'Photography', 'Sculpture', 'Watercolour', 'Mixed Media'].map((cat) => (
            <Link
              key={cat}
              to="/gallery"
              className="text-xs font-semibold uppercase tracking-[0.15em] text-black hover:opacity-50 transition-opacity"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Artworks ── */}
      {featuredArtworks.length > 0 && (
        <section className="py-20 px-6 max-w-6xl mx-auto" id="featured-section">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black mb-3">Curated Selection</p>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-black">Featured Artworks</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredArtworks.map((artwork) => (
              <Link
                to={`/gallery/${artwork._id}`}
                key={artwork._id}
                className="group"
              >
                <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-4 rounded-3xl shadow-sm border border-gray-200/50 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] group-hover:-translate-y-2 transition-all duration-700 ease-out">
                  {artwork.image_url ? (
                    <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-black mb-1">{artwork.artist_id?.name || 'Unknown'}</p>
                <h3 className="font-serif text-lg text-black group-hover:underline">{artwork.title}</h3>
                <p className="text-sm text-black mt-1">₹{artwork.price?.toLocaleString('en-IN')}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              to="/gallery"
              className="inline-block px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-black border border-black hover:bg-black hover:text-white transition-colors"
              id="view-all-btn"
            >
              View All Artworks
            </Link>
          </div>
        </section>
      )}

      {/* ── How It Works ── */}
      <section className="py-20 px-6 bg-[#F4F1EE]" id="how-it-works">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black mb-3">Simple Process</p>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-black">How It Works</h2>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { step: '01', title: 'Browse & Discover', desc: 'Explore our curated gallery of artworks from verified artists across India.' },
            { step: '02', title: 'Add to Cart', desc: 'Found something you love? Add it to your cart with a single click.' },
            { step: '03', title: 'Checkout & Own', desc: 'Complete your purchase and become the proud owner of original artwork.' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <span className="inline-block text-6xl font-serif font-bold text-black/15 mb-4">{item.step}</span>
              <h3 className="text-xl font-serif font-bold text-black">{item.title}</h3>
              <p className="text-sm text-black mt-3 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Buy Original Art ── */}
      <section className="py-24 px-6 bg-[#F7F7F7]" id="why-original">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left — Sticky heading */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <h2 className="text-4xl sm:text-5xl font-serif font-bold text-black leading-tight">
                  Why Buy<br />Original Art
                </h2>
                <p className="text-base text-black mt-6 leading-relaxed">
                  More than décor, original art enriches your life—it is a daily source of joy, inspiration, and personal expression.
                </p>
              </div>
            </div>

            {/* Right — Reason blocks with images */}
            <div className="lg:col-span-2 space-y-16">
              {[
                {
                  image: '/images/why-transform.png',
                  title: 'TRANSFORM YOUR SPACE',
                  desc: 'Original art creates an atmosphere in a way nothing else can. A single piece can define an entire room.',
                },
                {
                  image: '/images/why-investment.png',
                  title: 'SMART INVESTMENT',
                  desc: 'Support an emerging artist before they\'re discovered. Art appreciates in value over time.',
                },
                {
                  image: '/images/why-connect.png',
                  title: 'CONNECT WITH AN ARTIST',
                  desc: 'Every piece is created by hand. When you buy original, you own a part of the artist\'s vision and craft.',
                },
                {
                  image: '/images/why-conversation.png',
                  title: 'START A CONVERSATION',
                  desc: 'Original art draws people in and sparks connection. It tells a story that resonates with everyone who sees it.',
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-8 items-start">
                  <div className="w-full sm:w-3/5 aspect-[4/3] overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-black">{item.title}</h3>
                    <p className="text-base text-black mt-3 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black">Are You an Artist?</h2>
          <p className="text-sm text-black mt-4 leading-relaxed">
            Join M-Art to showcase your work to thousands of art lovers. Get verified and start selling today.
          </p>
          <Link
            to="/register"
            className="inline-block mt-8 px-10 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white bg-black hover:bg-gray-800 transition-colors"
          >
            Start Selling
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
