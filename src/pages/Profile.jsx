import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const Profile = () => {
  const { user } = useAuth();
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar_file: null,
  });
  const [profileStatus, setProfileStatus] = useState({ loading: false, error: '', success: '' });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || '');

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: '', success: '' });
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  // Orders and Reviews State
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'orders'
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ showFor: null, rating: 5, comment: '' });
  const [reviewStatus, setReviewStatus] = useState({ loading: false, error: '', success: '' });

  useEffect(() => {
    if (activeTab === 'orders' && user?.role === 'Buyer') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await API.get('/orders/my');
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
    setOrdersLoading(false);
  };

  const handleReviewSubmit = async (e, order) => {
    e.preventDefault();
    setReviewStatus({ loading: true, error: '', success: '' });
    try {
      await API.post('/reviews', {
        artwork_id: order.artwork_id._id,
        artist_id: order.artwork_id.artist_id || order.artwork_id.artist, // Adjust depending on populate
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      setReviewStatus({ loading: false, error: '', success: 'Review submitted successfully!' });
      setTimeout(() => {
        setReviewForm({ showFor: null, rating: 5, comment: '' });
        setReviewStatus({ loading: false, error: '', success: '' });
      }, 2000);
    } catch (err) {
      setReviewStatus({ loading: false, error: err.response?.data?.error || 'Failed to submit review', success: '' });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileStatus({ loading: true, error: '', success: '' });
    try {
      const formData = new FormData();
      formData.append('name', profileForm.name);
      formData.append('email', profileForm.email);
      if (profileForm.avatar_file) {
        formData.append('avatar', profileForm.avatar_file);
      }

      const { data } = await API.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Update local storage and force reload so AuthContext picks up new name instantly
      localStorage.setItem('mart_user', JSON.stringify(data));
      setProfileStatus({ loading: false, error: '', success: 'Profile updated successfully!' });
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setProfileStatus({ loading: false, error: err.response?.data?.error || 'Failed to update profile', success: '' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus({ loading: true, error: '', success: '' });
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPasswordStatus({ loading: false, error: 'New passwords do not match', success: '' });
    }
    if (passwordForm.newPassword.length < 6) {
      return setPasswordStatus({ loading: false, error: 'Password must be at least 6 characters', success: '' });
    }

    try {
      await API.put('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordStatus({ loading: false, error: '', success: 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordStatus({ loading: false, error: err.response?.data?.error || 'Failed to change password', success: '' });
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary-950">My Account</h1>
        </div>

        {user?.role === 'Buyer' && (
          <div className="flex border-b border-gray-200 mb-8 gap-8">
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-4 text-xs font-semibold uppercase tracking-widest transition-colors ${
                activeTab === 'settings' ? 'text-primary-950 border-b-2 border-primary-950' : 'text-primary-400 hover:text-primary-950'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-4 text-xs font-semibold uppercase tracking-widest transition-colors ${
                activeTab === 'orders' ? 'text-primary-950 border-b-2 border-primary-950' : 'text-primary-400 hover:text-primary-950'
              }`}
            >
              My Orders
            </button>
          </div>
        )}

        {activeTab === 'settings' ? (
          <div className="grid grid-cols-1 gap-12">
          
          {/* Profile Details Section */}
          <section className="p-8 border border-gray-200">
            <h2 className="text-lg font-serif font-bold text-primary-950 mb-6">Account Details</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              {profileStatus.error && <p className="text-xs text-red-600 bg-red-50 p-3 border border-red-200">{profileStatus.error}</p>}
              {profileStatus.success && <p className="text-xs text-green-700 bg-green-50 p-3 border border-green-200">{profileStatus.success}</p>}

              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-surface-200 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-serif text-3xl text-primary-950 font-bold uppercase">{user?.name?.[0] || '?'}</span>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setProfileForm({ ...profileForm, avatar_file: file });
                        setAvatarPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <label htmlFor="avatar-upload" className="cursor-pointer px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-950 border border-primary-950 hover:bg-primary-950 hover:text-white transition-colors inline-block">
                    Change Picture
                  </label>
                  <p className="text-xs text-primary-500 mt-2">JPG, PNG or WEBP (Max 5MB)</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={profileForm.name} 
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-sm text-primary-950 focus:outline-none focus:border-primary-950 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={profileForm.email} 
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-sm text-primary-950 focus:outline-none focus:border-primary-950 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={profileStatus.loading}
                  className="px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white bg-primary-950 hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  {profileStatus.loading ? 'Updating...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </section>

          {/* Password Section */}
          <section className="p-8 border border-gray-200">
            <div 
              className="flex justify-between items-center cursor-pointer group" 
              onClick={() => setShowPasswordSection(!showPasswordSection)}
            >
              <h2 className="text-lg font-serif font-bold text-primary-950">Security & Password</h2>
              <button 
                type="button" 
                className="text-xs font-semibold uppercase tracking-widest text-primary-950 border border-primary-950 px-4 py-2 group-hover:bg-primary-950 group-hover:text-white transition-colors"
              >
                {showPasswordSection ? 'Close' : 'Change Password'}
              </button>
            </div>

            {showPasswordSection && (
              <form onSubmit={handlePasswordSubmit} className="space-y-5 mt-8 border-t border-gray-200 pt-8">
                {passwordStatus.error && <p className="text-xs text-red-600 bg-red-50 p-3 border border-red-200">{passwordStatus.error}</p>}
                {passwordStatus.success && <p className="text-xs text-green-700 bg-green-50 p-3 border border-green-200">{passwordStatus.success}</p>}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">Current Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.currentPassword} 
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 text-sm text-primary-950 focus:outline-none focus:border-primary-950 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.newPassword} 
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    min="6"
                    className="w-full px-4 py-3 border border-gray-300 text-sm text-primary-950 focus:outline-none focus:border-primary-950 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.confirmPassword} 
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 text-sm text-primary-950 focus:outline-none focus:border-primary-950 transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={passwordStatus.loading}
                    className="px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white bg-primary-950 hover:bg-accent-hover transition-colors disabled:opacity-50"
                  >
                    {passwordStatus.loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </section>

        </div>
        ) : (
          <div className="space-y-6">
            {ordersLoading ? (
              <p className="text-primary-500">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="p-8 border border-gray-200 text-center">
                <p className="text-primary-950 font-serif text-xl">No orders found.</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order._id} className="p-6 border border-gray-200 bg-white flex flex-col sm:flex-row gap-6">
                  <div className="w-24 h-24 shrink-0 bg-surface-200">
                    {order.artwork_id?.image_url && <img src={order.artwork_id.image_url} alt="Artwork" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-primary-500 uppercase tracking-wider mb-1">Order #{order._id.slice(-6)}</p>
                    <Link to={`/gallery/${order.artwork_id?._id}`} className="text-lg font-serif font-bold text-primary-950 hover:underline">
                      {order.artwork_id?.title || 'Unknown Artwork'}
                    </Link>
                    <p className="text-sm font-medium text-primary-700 mt-2">₹{order.total_amount?.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-primary-400 mt-1">Purchased on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="shrink-0 flex flex-col justify-center">
                    {reviewForm.showFor === order._id ? (
                      <div className="w-full sm:w-80 bg-surface-50 p-4 border border-gray-200 mt-4 sm:mt-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary-950 mb-3">Leave a Review</p>
                        {reviewStatus.error && <p className="text-xs text-red-600 mb-2">{reviewStatus.error}</p>}
                        {reviewStatus.success && <p className="text-xs text-green-600 mb-2">{reviewStatus.success}</p>}
                        <form onSubmit={(e) => handleReviewSubmit(e, order)} className="space-y-3">
                          <select 
                            value={reviewForm.rating} 
                            onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                            className="w-full p-2 border border-gray-300 text-sm focus:outline-none"
                          >
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Very Good</option>
                            <option value="3">3 - Good</option>
                            <option value="2">2 - Fair</option>
                            <option value="1">1 - Poor</option>
                          </select>
                          <textarea 
                            value={reviewForm.comment}
                            onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                            required
                            placeholder="Write your review here..."
                            className="w-full p-2 border border-gray-300 text-sm focus:outline-none h-20 resize-none"
                          ></textarea>
                          <div className="flex gap-2">
                            <button type="submit" disabled={reviewStatus.loading} className="flex-1 py-2 bg-primary-950 text-white text-xs font-semibold uppercase tracking-widest hover:bg-accent-hover transition-colors">
                              Submit
                            </button>
                            <button type="button" onClick={() => setReviewForm({showFor: null, rating: 5, comment: ''})} className="px-4 py-2 border border-gray-300 text-xs font-semibold uppercase tracking-widest hover:bg-gray-50 transition-colors">
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setReviewForm({ showFor: order._id, rating: 5, comment: '' })}
                        className="px-6 py-2.5 border border-primary-950 text-xs font-semibold uppercase tracking-widest text-primary-950 hover:bg-primary-950 hover:text-white transition-colors"
                      >
                        Review Item
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
