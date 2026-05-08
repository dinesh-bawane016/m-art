import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gallery?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/artists', label: 'Artists' },
    { to: '/about', label: 'About' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100" id="main-navbar">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center" id="navbar-logo">
             <span className="font-serif text-2xl font-bold tracking-tight text-black">M-Art</span>
          </Link>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-12">
            <form onSubmit={handleSearch} className="relative w-full">
              <input 
                type="search" 
                placeholder="Search by artist, style, or collection..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-50 border-none rounded-full px-6 py-2.5 text-sm focus:ring-1 focus:ring-neutral-200"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Right Side: Links & Auth */}
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="text-[11px] uppercase tracking-[0.2em] font-bold text-neutral-600 hover:text-black transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-5">
              {user ? (
                <div className="flex items-center gap-5">
                  {user.role === 'Buyer' && (
                    <>
                      <Link to="/wishlist" className="relative text-black hover:opacity-60 transition-opacity" title="Wishlist">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        {wishlist.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center">{wishlist.length}</span>}
                      </Link>
                      <Link to="/cart" className="relative text-black hover:opacity-60 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
                      </Link>
                    </>
                  )}
                  <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200">
                    {user.avatar_url 
                      ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="" />
                      : <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-[10px] font-bold">{user.name?.[0]}</div>
                    }
                  </Link>
                  <button onClick={handleLogout} className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 hover:text-black transition-colors">Logout</button>
                </div>
              ) : (
                <div className="flex items-center gap-5">
                  <Link to="/login" className="text-[11px] uppercase tracking-widest font-bold text-neutral-600 hover:text-black">Log In</Link>
                  <Link to="/register" className="bg-black text-white px-6 py-2.5 text-[11px] uppercase tracking-widest font-bold hover:bg-neutral-800 transition-colors">
                    Join
                  </Link>
                </div>
              )}

              {/* Mobile Toggle */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-black p-1">
                {mobileOpen ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 px-6 py-8 space-y-6 text-center animate-fade-in">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block text-xs uppercase tracking-widest font-bold">{link.label}</Link>
          ))}
          {!user ? (
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-xs uppercase tracking-widest font-bold">Log In</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="inline-block bg-black text-white px-12 py-4 text-xs uppercase tracking-widest font-bold">Sell Art</Link>
            </div>
          ) : (
            <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-xs uppercase tracking-widest font-bold text-red-500">Logout</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
