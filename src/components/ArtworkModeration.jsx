import { useState, useEffect } from 'react'
import API from '../utils/api'

const ArtworkModeration = () => {
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTargetId, setDeleteTargetId] = useState(null)

  useEffect(() => { fetchArtworks(); }, []);

  const fetchArtworks = async () => {
    try { const { data } = await API.get('/artworks/all'); setArtworks(data); }
    catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try { 
      await API.delete(`/artworks/${id}`); 
      setArtworks((prev) => prev.filter((a) => a._id !== id)); 
      setDeleteTargetId(null);
    }
    catch (err) { alert(err.response?.data?.error || 'Delete failed'); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-500">
        {artworks.length} Artworks
      </p>

      {artworks.length === 0 ? (
        <div className="text-center py-16 border border-gray-200">
          <p className="font-serif text-xl text-primary-950">No artworks</p>
          <p className="text-sm text-primary-500 mt-1">All artworks have been moderated.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8" id="artwork-grid">
          {artworks.map((artwork) => (
            <div key={artwork._id} className="group">
              <div className="aspect-[4/5] bg-surface-200 overflow-hidden mb-4 rounded-3xl shadow-sm border border-gray-200/50 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] group-hover:-translate-y-2 transition-all duration-700 ease-out">
                {artwork.image_url ? (
                  <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-xs text-primary-500 uppercase tracking-wider">
                {artwork.artist_id?.name || 'Unknown'}
                {!artwork.artist_id?.is_verified && <span className="text-amber-700 ml-2">• Unverified</span>}
              </p>
              <h4 className="font-serif text-lg text-primary-950 mt-1">{artwork.title}</h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-primary-700">₹{artwork.price?.toLocaleString('en-IN')}</span>
                <span className={`text-xs font-semibold uppercase tracking-wider ${artwork.status === 'Available' ? 'text-green-700' : 'text-red-700'}`}>{artwork.status}</span>
              </div>
              <button onClick={() => setDeleteTargetId(artwork._id)}
                className="mt-3 w-full py-2 text-xs font-semibold uppercase tracking-wider text-red-700 border border-red-300 hover:bg-red-50 transition-colors">
                Delete Listing
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white p-8 max-w-sm w-full shadow-2xl border border-gray-200">
            <h3 className="font-serif text-2xl font-bold text-primary-950 mb-2">Delete Artwork?</h3>
            <p className="text-sm text-primary-600 mb-8">This action cannot be undone. Are you absolutely sure?</p>
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
  )
}

export default ArtworkModeration
