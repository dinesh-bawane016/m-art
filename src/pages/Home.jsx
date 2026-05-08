import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../utils/api';

const Home = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);

  useEffect(() => {
    API.get('/artworks')
      .then((res) => setFeaturedArtworks(res.data.slice(0, 8)))
      .catch(() => { });
  }, []);

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* ── Hero Section (Split Layout) ── */}
      <section className="relative px-6 lg:px-20 py-16 lg:py-24 max-w-[1440px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            <p className="label-uppercase text-neutral-400 mb-6">India's Premier Art Marketplace</p>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-[1.1] mb-8">
              Discover Original<br />Art You Love
            </h1>
            <p className="text-lg text-neutral-600 mb-10 leading-relaxed font-light">
              Explore curated collections from verified Indian artists. From classic oil paintings to cutting-edge digital art.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/gallery" className="btn-primary">
                View All Art
              </Link>
              <Link to="/register" className="btn-secondary">
                Sell Your Art
              </Link>
            </div>
          </div>

          {/* Right Content: Art Cluster */}
          <div className="relative h-[500px] lg:h-[600px] hero-grid animate-fade-in">
            <div className="hero-img-1 overflow-hidden shadow-2xl">
              <img src="/images/hero-1.png" alt="Featured Art 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="hero-img-2 overflow-hidden shadow-xl">
              <img src="/images/hero-2.png" alt="Featured Art 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="hero-img-3 overflow-hidden shadow-lg">
              <img src="/images/hero-3.png" alt="Featured Art 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Strip ── */}
      <section className="border-t border-b border-neutral-100 bg-neutral-50/30">
        <div className="max-w-[1440px] mx-auto px-6 py-10 overflow-x-auto">
          <div className="flex items-center justify-center gap-12 min-w-max mx-auto">
            {['Paintings', 'Digital Art', 'Photography', 'Sculpture', 'Watercolour', 'Mixed Media'].map((cat) => (
              <Link
                key={cat}
                to={`/gallery?category=${cat}`}
                className="text-[11px] uppercase tracking-[0.2em] font-bold text-neutral-500 hover:text-black transition-colors whitespace-nowrap"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Artworks (Grid) ── */}
      <section className="py-24 px-6 lg:px-20 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <p className="label-uppercase text-neutral-400 mb-3">Curated Selection</p>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold">Featured Artworks</h2>
          </div>
          <Link to="/gallery" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-neutral-500 transition-colors">
            View All Artworks
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {(featuredArtworks.length > 0 ? featuredArtworks : Array(4).fill({})).map((artwork, i) => (
            <Link to={`/gallery/${artwork._id}`} key={artwork._id || i} className="art-card group">
              <div className="aspect-[4/5] overflow-hidden mb-6 bg-neutral-100">
                {artwork.image_url ? (
                  <img src={artwork.image_url} alt={artwork.title} className="art-card-img" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-300">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                  {artwork.artist_id?.name || 'Unknown Artist'}
                </p>
                <h3 className="text-lg font-serif font-bold group-hover:underline">
                  {artwork.title || 'Original Piece'}
                </h3>
                <p className="text-sm font-medium">
                  {artwork.price ? `₹${artwork.price.toLocaleString('en-IN')}` : 'Contact for Price'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-6 lg:px-20 bg-neutral-50">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <p className="label-uppercase text-neutral-400 mb-3">Simple Process</p>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold">How It Works</h2>
        </div>

        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { step: '01', title: 'Browse & Discover', desc: 'Explore our curated gallery of artworks from verified artists across India.' },
            { step: '02', title: 'Add to Cart', desc: 'Found something you love? Add it to your cart with a single click.' },
            { step: '03', title: 'Checkout & Own', desc: 'Complete your purchase and become the proud owner of original artwork.' },
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <span className="inline-block text-7xl font-serif font-bold text-neutral-200 group-hover:text-black transition-colors duration-500 mb-6">{item.step}</span>
              <h3 className="text-xl font-serif font-bold mb-4">{item.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Buy Original Art (Re-implemented with new UI) ── */}
      <section className="py-24 px-6 lg:px-20 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <h2 className="text-4xl lg:text-6xl font-serif font-bold leading-tight mb-8">
              Why Buy<br />Original Art
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed font-light">
              More than décor, original art enriches your life—it is a daily source of joy, inspiration, and personal expression.
            </p>
          </div>
          <div className="lg:col-span-7 space-y-24">
            {[
              {
                title: 'TRANSFORM YOUR SPACE',
                desc: 'Original art creates an atmosphere in a way nothing else can. A single piece can define an entire room.',
                image: '/images/why-transform.png'
              },
              {
                title: 'SMART INVESTMENT',
                desc: 'Support an emerging artist before they\'re discovered. Art appreciates in value over time.',
                image: '/images/why-investment.png'
              },
              {
                title: 'CONNECT WITH AN ARTIST',
                desc: 'Every piece is created by hand. When you buy original, you own a part of the artist\'s vision and craft.',
                image: '/images/why-connect.png'
              },
              {
                title: 'START A CONVERSATION',
                desc: 'Original art draws people in and sparks connection. It tells a story that resonates with everyone who sees it.',
                image: '/images/why-conversation.png'
              }
            ].map((item, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center group">
                <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div>
                  <h3 className="label-uppercase text-black mb-4">{item.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-32 px-6 bg-neutral-950 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl lg:text-6xl font-serif font-bold mb-8 leading-tight">Are You an Artist?</h2>
          <p className="text-lg text-neutral-400 mb-12 font-light leading-relaxed">
            Join M-Art to showcase your work to thousands of art lovers. Get verified and start selling today.
          </p>
          <Link to="/register" className="inline-block px-12 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all">
            Start Selling
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
