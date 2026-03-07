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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/artists', label: 'Artists' },
    { to: '/about', label: 'About' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" id="navbar-logo">
            <img src="/logo.png" alt="M-Art Logo" className="h-8 w-auto object-contain" />
          </Link>

          {/* Center Links — Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-black hover:opacity-50 transition-opacity" id={`nav-${link.label.toLowerCase()}`}>
                {link.label}
              </Link>
            ))}
            {user?.role === 'Artist' && (
              <Link to="/artist/dashboard" className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-black hover:opacity-50 transition-opacity" id="nav-artist-dashboard">
                Dashboard
              </Link>
            )}
            {user?.role === 'Admin' && (
              <Link to="/admin" className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-black hover:opacity-50 transition-opacity" id="nav-admin">
                Admin
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            {user && user.role === 'Buyer' && (
              <Link to="/wishlist" className="relative p-2 text-black hover:text-red-500 transition-colors" title="Wishlist">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            {user && user.role === 'Buyer' && (
              <Link to="/cart" className="relative p-2 text-black hover:opacity-50 transition-opacity" id="nav-cart">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="hidden sm:flex items-center gap-2 hover:opacity-50 transition-opacity" id="nav-profile">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="w-9 h-9 rounded-full object-cover border border-gray-300 shadow-sm" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold uppercase shadow-sm">
                      {user.name?.[0] || user.username?.[0] || '?'}
                    </div>
                  )}
                </Link>
                <button onClick={handleLogout} className="text-xs font-semibold uppercase tracking-[0.15em] text-black hover:opacity-50 transition-opacity" id="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-xs font-semibold uppercase tracking-[0.15em] text-black hover:opacity-50 transition-opacity" id="nav-login">
                  Log In
                </Link>
                <Link to="/register" className="px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white bg-black hover:bg-gray-800 transition-colors" id="nav-register">
                  Join
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-black" id="mobile-menu-btn">
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
              className="block py-3 text-xs font-semibold uppercase tracking-[0.15em] text-black border-b border-gray-100">
              {link.label}
            </Link>
          ))}
          {user && (
            <Link to="/profile" onClick={() => setMobileOpen(false)}
              className="block py-3 text-xs font-semibold uppercase tracking-[0.15em] text-black border-b border-gray-100">
              Profile
            </Link>
          )}
          {!user && (
            <div className="flex gap-3 pt-3">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-black border border-black">Log In</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-white bg-black">Join</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
