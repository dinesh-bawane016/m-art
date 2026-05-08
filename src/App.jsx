import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Artists from './pages/Artists';
import About from './pages/About';
import ArtworkDetail from './pages/ArtworkDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import ArtistDashboard from './pages/ArtistDashboard';
import ArtistProfile from './pages/ArtistProfile';
import AdminLayout from './pages/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  // Admin panel has its own layout (no Navbar)
  if (isAdmin && window.location.pathname.startsWith('/admin')) {
    return (
      <Routes>
        <Route path="/admin/*" element={
          <ProtectedRoute roles={['Admin']}>
            <AdminLayout />
          </ProtectedRoute>
        } />
        <Route path="*" element={<AdminLayout />} />
      </Routes>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-primary-950">
      <Navbar />
      <main className="flex-grow">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:id" element={<ArtworkDetail />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artist/:id" element={<ArtistProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={
          <ProtectedRoute roles={['Buyer']}>
            <Wishlist />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute roles={['Buyer', 'Artist']}>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute roles={['Buyer']}>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/artist/dashboard" element={
          <ProtectedRoute roles={['Artist']}>
            <ArtistDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute roles={['Admin']}>
            <AdminLayout />
          </ProtectedRoute>
        } />
      </Routes>
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
}

export default App;
