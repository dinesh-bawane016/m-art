import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.role === 'Artist') navigate('/artist/dashboard');
      else navigate('/gallery');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-black">Welcome Back</h1>
          <p className="text-sm text-neutral-500 mt-2">Sign in to your M-Art account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
          {error && (
            <div className="p-3 border border-red-300 text-sm text-red-700 bg-red-50">{error}</div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-300 text-sm text-black placeholder-neutral-300 focus:outline-none focus:border-black transition-colors"
              placeholder="you@email.com" id="login-email" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-300 text-sm text-black placeholder-neutral-300 focus:outline-none focus:border-black transition-colors"
              placeholder="••••••••" id="login-password" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-4 text-xs font-bold uppercase tracking-widest text-white bg-black hover:bg-neutral-800 transition-colors disabled:opacity-50"
            id="login-submit">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-black font-bold underline hover:no-underline">Join</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
