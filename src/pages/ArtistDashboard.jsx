import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const CATEGORIES = ['Oil Painting', 'Digital Art', 'Watercolour', 'Acrylic', 'Mixed Media', 'Sculpture', 'Photography'];

const ArtistDashboard = () => {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('artworks');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [form, setForm] = useState({ title: '', price: '', category: CATEGORIES[0], size: '', image_url: '', image_file: null });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [artRes, ordRes] = await Promise.all([API.get('/artworks/artist/me'), API.get('/orders/artist')]);
      setArtworks(artRes.data);
      setOrders(ordRes.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('price', Number(form.price));
      formData.append('category', form.category);
      if (form.size) formData.append('size', form.size);
      if (form.image_file) {
        formData.append('image', form.image_file);
      } else if (form.image_url) {
        formData.append('image_url', form.image_url);
      }

      if (editingId) {
        await API.put(`/artworks/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await API.post('/artworks', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      
      setShowForm(false); setEditingId(null);
      setForm({ title: '', price: '', category: CATEGORIES[0], size: '', image_url: '', image_file: null });
      fetchData();
    } catch (err) { setFormError(err.response?.data?.error || 'Failed'); }
    setFormLoading(false);
  };

  const handleEdit = (a) => {
    setEditingId(a._id);
    setForm({ title: a.title, price: a.price, category: a.category, size: a.size || '', image_url: a.image_url || '', image_file: null });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try { 
      await API.delete(`/artworks/${id}`); 
      setDeleteTargetId(null);
      fetchData(); 
    }
    catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  const totalSales = orders.filter((o) => o.status === 'Completed').reduce((s, o) => s + o.total_amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p className="label-uppercase text-primary-500 mb-2">Artist Dashboard</p>
            <h1 className="text-3xl font-serif font-bold text-primary-950" id="artist-dashboard-title">Welcome, {user?.name}</h1>
          </div>
          <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', price: '', category: CATEGORIES[0], size: '', image_url: '', image_file: null }); }}
            className="px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white bg-primary-950 hover:bg-accent-hover transition-colors" id="add-artwork-btn">
            + Upload Artwork
          </button>
        </div>

        {!user?.is_verified && (
          <div className="p-4 border border-amber-300 bg-amber-50 mb-8 text-sm text-amber-800" id="verification-notice">
            ⏳ <strong>Pending Verification</strong> — Your artworks will appear in the gallery once an admin verifies your profile.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Artworks', value: artworks.length },
            { label: 'Sales', value: orders.filter((o) => o.status === 'Completed').length },
            { label: 'Revenue', value: `₹${totalSales.toLocaleString('en-IN')}` },
          ].map((s, i) => (
            <div key={i} className="border border-gray-200 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-500">{s.label}</p>
              <p className="text-3xl font-serif font-bold text-primary-950 mt-2">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border border-gray-300 w-fit mb-8">
          {['artworks', 'orders'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                tab === t ? 'bg-primary-950 text-white' : 'bg-white text-primary-600 hover:text-primary-950'
              }`}>
              {t === 'artworks' ? 'My Artworks' : 'My Sales'}
            </button>
          ))}
        </div>

        {/* Upload Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white border border-gray-200 p-8 w-full max-w-lg" id="artwork-form-modal">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif font-bold text-primary-950">{editingId ? 'Edit Artwork' : 'Upload Artwork'}</h3>
                <button onClick={() => setShowForm(false)} className="text-primary-500 hover:text-primary-950 text-xl">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && <div className="p-3 border border-red-300 bg-red-50 text-sm text-red-700">{formError}</div>}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                    className="w-full px-4 py-3 border border-gray-300 text-sm text-primary-950 focus:outline-none focus:border-primary-950 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="1"
                    className="w-full px-4 py-3 border border-gray-300 text-sm text-primary-950 focus:outline-none focus:border-primary-950 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">Dimensions / Size (Optional)</label>
                  <input type="text" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="e.g., 60 x 90 cm"
                    className="w-full px-4 py-3 border border-gray-300 text-sm text-primary-950 focus:outline-none focus:border-primary-950 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 text-sm text-primary-950 focus:outline-none focus:border-primary-950 transition-colors bg-white">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">Image Upload</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setForm({ ...form, image_file: e.target.files[0] })}
                    className="w-full px-4 py-3 border border-gray-300 text-sm text-primary-950 focus:outline-none focus:border-primary-950 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-semibold file:uppercase file:tracking-widest file:bg-primary-950 file:text-white hover:file:bg-accent-hover" 
                  />
                  {form.image_url && !form.image_file && <p className="text-xs text-primary-500 mt-2">Current: {form.image_url.substring(0, 30)}...</p>}
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 py-3 text-xs font-semibold uppercase tracking-widest text-primary-700 border border-gray-300 hover:border-primary-950 transition-colors">Cancel</button>
                  <button type="submit" disabled={formLoading}
                    className="flex-1 py-3 text-xs font-semibold uppercase tracking-widest text-white bg-primary-950 hover:bg-accent-hover transition-colors disabled:opacity-50">
                    {formLoading ? 'Saving...' : editingId ? 'Update' : 'Upload'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Artworks */}
        {tab === 'artworks' && (
          artworks.length === 0 ? (
            <div className="text-center py-16 border border-gray-200">
              <p className="font-serif text-xl text-primary-950">No artworks yet</p>
              <p className="text-sm text-primary-500 mt-1">Upload your first artwork</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {artworks.map((a) => (
                <div key={a._id}>
                  <div className="aspect-[4/5] bg-surface-200 overflow-hidden mb-4 rounded-3xl shadow-sm border border-gray-200/50 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] group-hover:-translate-y-2 transition-all duration-700 ease-out">
                    {a.image_url ? (
                      <img src={a.image_url} alt={a.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h4 className="font-serif text-lg text-primary-950">{a.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-primary-700">₹{a.price?.toLocaleString('en-IN')}</span>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${a.status === 'Available' ? 'text-green-700' : 'text-red-700'}`}>{a.status}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleEdit(a)} className="flex-1 py-2 text-xs font-semibold uppercase tracking-wider text-primary-700 border border-gray-300 hover:border-primary-950 transition-colors">Edit</button>
                    <button onClick={() => handleDelete(a._id)} className="flex-1 py-2 text-xs font-semibold uppercase tracking-wider text-red-700 border border-red-300 hover:bg-red-50 transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Orders */}
        {tab === 'orders' && (
          orders.length === 0 ? (
            <div className="text-center py-16 border border-gray-200">
              <p className="font-serif text-xl text-primary-950">No sales yet</p>
              <p className="text-sm text-primary-500 mt-1">Sales appear when buyers purchase your art</p>
            </div>
          ) : (
            <div className="border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-100 border-b border-gray-200">
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Artwork</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Buyer</th>
                    <th className="text-right text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Amount</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="border-b border-gray-100 hover:bg-surface-100 transition-colors">
                      <td className="px-6 py-4 text-sm text-primary-950">{o.artwork_id?.title || '—'}</td>
                      <td className="px-6 py-4 text-sm text-primary-600">{o.buyer_id?.name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-primary-950 font-medium text-right">₹{o.total_amount?.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${o.status === 'Completed' ? 'text-green-700' : 'text-amber-700'}`}>{o.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white p-8 max-w-sm w-full shadow-2xl border border-gray-200">
            <h3 className="font-serif text-2xl font-bold text-primary-950 mb-2">Delete Artwork?</h3>
            <p className="text-sm text-primary-600 mb-8">This will permanently remove your listing from M-Art.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-3 text-xs font-semibold uppercase tracking-widest text-primary-950 border border-primary-950 hover:bg-gray-50 transition-colors"
                id="cancel-delete-btn"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteTargetId)}
                className="flex-1 py-3 text-xs font-semibold uppercase tracking-widest text-white bg-red-700 hover:bg-red-800 transition-colors"
                id="confirm-delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistDashboard;
