import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import API from '../utils/api'

const VerifyArtists = () => {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLog, setActionLog] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => { fetchArtists(); }, []);

  const fetchArtists = async () => {
    try { const { data } = await API.get('/users/unverified-artists'); setArtists(data); }
    catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleAction = async (id, action) => {
    try {
      const artist = artists.find((a) => a._id === id);
      await API.put(`/users/${id}/${action}`);
      setArtists((prev) => prev.filter((a) => a._id !== id));
      setActionLog((prev) => [
        { name: artist.name, action, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4),
      ]);
    } catch (err) { alert(err.response?.data?.error || `${action} failed`); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="border border-gray-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-500">Pending</p>
          <p className="text-3xl font-serif font-bold text-amber-700 mt-2">{artists.length}</p>
        </div>
        <div className="border border-gray-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-500">Approved Today</p>
          <p className="text-3xl font-serif font-bold text-green-700 mt-2">{actionLog.filter(l => l.action === 'verify').length}</p>
        </div>
        <div className="border border-gray-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-500">Rejected Today</p>
          <p className="text-3xl font-serif font-bold text-red-700 mt-2">{actionLog.filter(l => l.action === 'reject').length}</p>
        </div>
      </div>

      {/* Action Log */}
      {actionLog.length > 0 && (
        <div className="flex flex-wrap gap-2" id="action-log">
          {actionLog.map((log, i) => (
            <span key={i} className={`text-xs font-medium px-3 py-1.5 border ${
              log.action === 'verify' ? 'border-green-300 text-green-700 bg-green-50' : 'border-red-300 text-red-700 bg-red-50'
            }`}>
              {log.action === 'verify' ? '✓ Approved' : '✕ Rejected'}: {log.name} • {log.time}
            </span>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="border border-gray-200" id="artists-table">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-serif font-bold text-primary-950">Pending Verifications</h3>
        </div>

        {artists.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-serif text-xl text-primary-950">All caught up!</p>
            <p className="text-sm text-primary-500 mt-1">No pending verifications.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-surface-100">
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Artist</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Samples</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Joined</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Status</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist) => (
                <tr key={artist._id} className="border-b border-gray-100 hover:bg-surface-100 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-surface-200 flex items-center justify-center text-primary-950 font-serif font-bold">
                        {artist.name?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-950">{artist.name}</p>
                        <p className="text-xs text-primary-500">{artist.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {artist.artworks && artist.artworks.length > 0 ? (
                      <div className="flex gap-2">
                        {artist.artworks.slice(0, 3).map(art => (
                          <div key={art._id} className="w-12 h-12 bg-surface-200 overflow-hidden relative group cursor-pointer" onClick={() => setSelectedImage(art.image_url)}>
                            {art.image_url ? (
                              <img src={art.image_url} alt={art.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" title={art.title} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primary-400 text-[10px]">No Img</div>
                            )}
                          </div>
                        ))}
                        {artist.artworks.length > 3 && (
                          <div className="w-12 h-12 flex items-center justify-center bg-surface-200 text-xs font-medium text-primary-500" title={`${artist.artworks.length - 3} more`}>
                            +{artist.artworks.length - 3}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-primary-400">No uploads</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-primary-600">
                    {new Date(artist.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">Pending</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleAction(artist._id, 'verify')}
                        className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-700 border border-green-300 hover:bg-green-50 transition-colors">
                        Approve
                      </button>
                      <button onClick={() => handleAction(artist._id, 'reject')}
                        className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-700 border border-red-300 hover:bg-red-50 transition-colors">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImage && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <button 
              className="absolute -top-12 2xl:-top-12 right-0 text-white/70 hover:text-white text-5xl p-2 leading-none transition-colors" 
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="bg-white p-2 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <img 
                src={selectedImage} 
                alt="Fullscreen Sample" 
                className="max-w-full max-h-[85vh] object-contain cursor-default" 
                onClick={(e) => e.stopPropagation()} 
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default VerifyArtists
