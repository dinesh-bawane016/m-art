import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(name, email, password, role);
      if (data.role === 'Artist') navigate('/artist/dashboard');
      else navigate('/gallery');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-primary-950">Create Account</h1>
          <p className="text-sm text-primary-500 mt-2">Join M-Art as a buyer or artist</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" id="register-form">
          {error && (
            <div className="p-3 border border-red-300 text-sm text-red-700 bg-red-50">{error}</div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-300 text-sm text-primary-950 placeholder-primary-400 focus:outline-none focus:border-primary-950 transition-colors"
              placeholder="Your full name" id="register-name" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-300 text-sm text-primary-950 placeholder-primary-400 focus:outline-none focus:border-primary-950 transition-colors"
              placeholder="you@email.com" id="register-email" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              className="w-full px-4 py-3 border border-gray-300 text-sm text-primary-950 placeholder-primary-400 focus:outline-none focus:border-primary-950 transition-colors"
              placeholder="Min 6 characters" id="register-password" />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-3">I want to join as</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setRole('Buyer')}
                className={`py-4 text-center border transition-colors ${
                  role === 'Buyer' ? 'border-primary-950 bg-primary-950 text-white' : 'border-gray-300 text-primary-700 hover:border-primary-950'
                }`}>
                <span className="block text-xs font-semibold uppercase tracking-wider">Buyer</span>
                <span className="block text-[11px] text-primary-400 mt-1">Browse & purchase</span>
              </button>
              <button type="button" onClick={() => setRole('Artist')}
                className={`py-4 text-center border transition-colors ${
                  role === 'Artist' ? 'border-primary-950 bg-primary-950 text-white' : 'border-gray-300 text-primary-700 hover:border-primary-950'
                }`}>
                <span className="block text-xs font-semibold uppercase tracking-wider">Artist</span>
                <span className="block text-[11px] text-primary-400 mt-1">Upload & sell art</span>
              </button>
            </div>
          </div>

          {role === 'Artist' && (
            <div className="p-3 border border-amber-300 bg-amber-50 text-sm text-amber-800">
              ⏳ Your artist profile needs admin verification before your artworks appear in the gallery.
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 text-xs font-semibold uppercase tracking-widest text-white bg-primary-950 hover:bg-accent-hover transition-colors disabled:opacity-50"
            id="register-submit">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-primary-500 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-950 font-medium underline hover:no-underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
