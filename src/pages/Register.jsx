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
          <h1 className="text-3xl font-serif font-bold text-black">Create Account</h1>
          <p className="text-sm text-neutral-500 mt-2">Join M-Art as a buyer or artist</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" id="register-form">
          {error && (
            <div className="p-3 border border-red-300 text-sm text-red-700 bg-red-50">{error}</div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-300 text-sm text-black placeholder-neutral-300 focus:outline-none focus:border-black transition-colors"
              placeholder="Your full name" id="register-name" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-300 text-sm text-black placeholder-neutral-300 focus:outline-none focus:border-black transition-colors"
              placeholder="you@email.com" id="register-email" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
              className="w-full px-4 py-3 border border-gray-300 text-sm text-black placeholder-neutral-300 focus:outline-none focus:border-black transition-colors"
              placeholder="Min 8 characters" id="register-password" />
            <p className="mt-2 text-[10px] text-neutral-400 leading-normal">
              Must be 8+ characters with uppercase, lowercase, number, and symbol.
            </p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">I want to join as</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setRole('Buyer')}
                className={`py-4 text-center border transition-colors ${
                  role === 'Buyer' ? 'border-black bg-black text-white' : 'border-gray-200 text-neutral-500 hover:border-black'
                }`}>
                <span className="block text-xs font-bold uppercase tracking-wider">Buyer</span>
                <span className={`block text-[10px] mt-1 ${role === 'Buyer' ? 'text-neutral-400' : 'text-neutral-400'}`}>Browse & purchase</span>
              </button>
              <button type="button" onClick={() => setRole('Artist')}
                className={`py-4 text-center border transition-colors ${
                  role === 'Artist' ? 'border-black bg-black text-white' : 'border-gray-200 text-neutral-500 hover:border-black'
                }`}>
                <span className="block text-xs font-bold uppercase tracking-wider">Artist</span>
                <span className={`block text-[10px] mt-1 ${role === 'Artist' ? 'text-neutral-400' : 'text-neutral-400'}`}>Upload & sell art</span>
              </button>
            </div>
          </div>

          {role === 'Artist' && (
            <div className="p-3 border border-neutral-200 bg-neutral-50 text-[11px] text-neutral-600 italic">
              ⏳ Your artist profile requires admin verification before your works are listed.
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-4 text-xs font-bold uppercase tracking-widest text-white bg-black hover:bg-neutral-800 transition-colors disabled:opacity-50"
            id="register-submit">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-black font-bold underline hover:no-underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
