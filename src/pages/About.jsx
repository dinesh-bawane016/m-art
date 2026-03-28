import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <section className="py-20 px-6 bg-[#F4F1EE]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black mb-4">About Us</p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-black leading-tight">
            Bridging Art & Collectors<br />Across India
          </h1>
          <p className="text-sm text-black mt-6 leading-relaxed max-w-xl mx-auto">
            M-Art is India's premier online art gallery and marketplace, connecting talented artists with passionate art collectors. We believe every home deserves original art.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black mb-3">Our Mission</p>
            <h2 className="text-3xl font-serif font-bold text-black">Making Art Accessible to Everyone</h2>
            <p className="text-sm text-black mt-4 leading-relaxed">
              We're on a mission to democratize the art world. By building a platform that empowers artists to sell directly to collectors, we eliminate the barriers of traditional galleries and make original art accessible to everyone.
            </p>
            <p className="text-sm text-black mt-4 leading-relaxed">
              Every artist on M-Art is verified by our team to ensure quality and authenticity, giving you confidence in every purchase.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '500+', label: 'Artworks' },
              { value: '120+', label: 'Artists' },
              { value: '2,000+', label: 'Collectors' },
              { value: '15+', label: 'Categories' },
            ].map((stat, i) => (
              <div key={i} className="border border-gray-200 p-6 text-center">
                <p className="text-3xl font-serif font-bold text-black">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.12em] text-black mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-[#F4F1EE]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black mb-3">What We Stand For</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Authenticity', desc: 'Every artist is manually verified. Every artwork is original. We guarantee what you see is what you get.' },
              { title: 'Transparency', desc: 'No hidden fees, no markups. Artists set their own prices and receive fair compensation for their work.' },
              { title: 'Community', desc: "We're building more than a marketplace — we're building a community of artists and art lovers across India." },
            ].map((v, i) => (
              <div key={i} className="text-center">
                <span className="inline-block text-5xl font-serif text-black/15 mb-3">0{i + 1}</span>
                <h3 className="text-xl font-serif font-bold text-black">{v.title}</h3>
                <p className="text-sm text-black mt-3 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-serif font-bold text-black">Ready to Explore?</h2>
        <p className="text-sm text-black mt-3">Discover original artworks from verified Indian artists.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link to="/gallery" className="px-10 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white bg-black hover:bg-gray-800 transition-colors">
            Browse Gallery
          </Link>
          <Link to="/register" className="px-10 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-black border border-black hover:bg-black hover:text-white transition-colors">
            Join as Artist
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
