import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let data;
      if (isAdmin) {
        data = await adminLogin(email, password);
        navigate('/admin');
      } else {
        data = await login(email, password);
        if (data.role === 'Artist') navigate('/artist/dashboard');
        else navigate('/gallery');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-primary-950">Welcome Back</h1>
          <p className="text-sm text-primary-500 mt-2">Sign in to your M-Art account</p>
        </div>

        {/* Toggle */}
        <div className="flex border border-gray-300 mb-8">
          <button
            onClick={() => setIsAdmin(false)}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
              !isAdmin ? 'bg-primary-950 text-white' : 'bg-white text-primary-600 hover:text-primary-950'
            }`}
          >
            User
          </button>
          <button
            onClick={() => setIsAdmin(true)}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
              isAdmin ? 'bg-primary-950 text-white' : 'bg-white text-primary-600 hover:text-primary-950'
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
          {error && (
            <div className="p-3 border border-red-300 text-sm text-red-700 bg-red-50">{error}</div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-300 text-sm text-primary-950 placeholder-primary-400 focus:outline-none focus:border-primary-950 transition-colors"
              placeholder={isAdmin ? 'admin@m-art.com' : 'you@email.com'} id="login-email" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-300 text-sm text-primary-950 placeholder-primary-400 focus:outline-none focus:border-primary-950 transition-colors"
              placeholder="••••••••" id="login-password" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3.5 text-xs font-semibold uppercase tracking-widest text-white bg-primary-950 hover:bg-accent-hover transition-colors disabled:opacity-50"
            id="login-submit">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {!isAdmin && (
          <p className="text-center text-sm text-primary-500 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-950 font-medium underline hover:no-underline">Create one</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
