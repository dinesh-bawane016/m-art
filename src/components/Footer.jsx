import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-4 gap-10">
        <div>
          <span className="font-serif text-2xl font-bold text-white">M-Art</span>
          <p className="text-xs text-white/60 mt-3 leading-relaxed">India's premier online art gallery and marketplace.</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-4">Explore</p>
          <div className="space-y-2">
            {['Gallery', 'Paintings', 'Digital Art', 'Photography'].map((l) => (
              <Link key={l} to="/gallery" className="block text-sm text-white/80 hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-4">For Artists</p>
          <div className="space-y-2">
            {['Sell on M-Art', 'Artist Dashboard', 'Verification'].map((l) => (
              <Link key={l} to="/register" className="block text-sm text-white/80 hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-4">Support</p>
          <div className="space-y-2">
            {['Help Center', 'Contact Us', 'Terms of Service', 'Privacy Policy'].map((l) => (
              <span key={l} className="block text-sm text-white/50">{l}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/50">© {new Date().getFullYear()} M-Art. All rights reserved.</p>
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">Built with ❤️ for Indian Artists</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
