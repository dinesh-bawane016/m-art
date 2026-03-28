import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const { data } = await API.get('/artworks');
        // Extract unique verified artists from artworks
        const artistMap = {};
        data.forEach((artwork) => {
          if (artwork.artist_id && !artistMap[artwork.artist_id._id]) {
            artistMap[artwork.artist_id._id] = {
              ...artwork.artist_id,
              artworks: [],
            };
          }
          if (artwork.artist_id) {
            artistMap[artwork.artist_id._id].artworks.push(artwork);
          }
        });
        setArtists(Object.values(artistMap));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchArtists();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black mb-3">Our Community</p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-black">Featured Artists</h1>
          <p className="text-sm text-black mt-4 max-w-lg mx-auto leading-relaxed">
            Discover the talented artists behind the artworks. Each artist is verified by our team to ensure quality and authenticity.
          </p>
        </div>

        {/* Artists Grid */}
        {artists.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-black">No artists found</p>
            <p className="text-sm text-black mt-2">Check back soon for new artists joining M-Art.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {artists.map((artist) => (
              <div key={artist._id} className="text-center group">
                {/* Avatar */}
                <Link to={`/artist/${artist._id}`} className="w-24 h-24 mx-auto rounded-full bg-[#F4F1EE] flex items-center justify-center mb-5 hover:scale-105 transition-transform">
                  <span className="font-serif text-3xl font-bold text-black">
                    {artist.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                </Link>

                {/* Info */}
                <Link to={`/artist/${artist._id}`}>
                  <h3 className="font-serif text-xl font-bold text-black hover:underline">{artist.name}</h3>
                </Link>
                <p className="text-xs text-black mt-1 uppercase tracking-[0.1em]">Verified Artist</p>
                <p className="text-sm text-black mt-3">{artist.artworks.length} artwork{artist.artworks.length !== 1 ? 's' : ''} listed</p>

                {/* Sample artworks */}
                {artist.artworks.length > 0 && (
                  <div className="flex justify-center gap-2 mt-5">
                    {artist.artworks.slice(0, 3).map((aw) => (
                      <Link to={`/gallery/${aw._id}`} key={aw._id} className="w-20 h-20 bg-gray-100 overflow-hidden">
                        {aw.image_url ? (
                          <img src={aw.image_url} alt={aw.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-[#F4F1EE]"></div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}

                <Link to={`/artist/${artist._id}`} className="inline-block mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-black underline hover:no-underline">
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Artists;
