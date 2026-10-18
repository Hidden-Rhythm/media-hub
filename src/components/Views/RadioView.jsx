import React, { useState, useEffect } from 'react';
import { Search, Radio as RadioIcon, Star, Play, Sparkles, Globe, Compass, Music2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function RadioView() {
  const { play, isFavorite, toggleFavorite } = usePlayer();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('IN'); // 'IN' (India) or 'GLOBAL'
  const [selectedTag, setSelectedTag] = useState('All');

  const indianTags = [
    { label: '🔥 All Indian Stations', tag: 'All' },
    { label: '🎬 Bollywood Hits', tag: 'bollywood' },
    { label: '📻 AIR & Vividh Bharati', tag: 'air' },
    { label: '📜 Retro & Classics', tag: 'retro' },
    { label: '⚡ Mirchi Top 20', tag: 'mirchi' },
    { label: '🕉️ Bhakti & Devotional', tag: 'bhakti' },
    { label: '🪕 Punjabi Beats', tag: 'punjabi' },
    { label: '🕺 DJ Remix & Dance', tag: 'remix' },
    { label: '🌺 Tamil & Regional', tag: 'tamil' }
  ];

  const globalTags = [
    { label: '🌍 All Global', tag: 'All' },
    { label: '☕ Lofi Beats', tag: 'lofi' },
    { label: '🎷 Jazz & Blues', tag: 'jazz' },
    { label: '🌌 Ambient & Chill', tag: 'ambient' },
    { label: '🎧 Electronic & EDM', tag: 'electronic' },
    { label: '🎸 Rock & Alternative', tag: 'rock' },
    { label: '🏛️ Classical', tag: 'classical' },
    { label: '🎤 Pop & Top 40', tag: 'pop' },
    { label: '📰 News & Talk', tag: 'news' },
    { label: '🪩 House & Club', tag: 'house' }
  ];

  const currentTags = region === 'IN' ? indianTags : globalTags;

  const fetchStations = async (query = '', tag = selectedTag, currentRegion = region) => {
    setLoading(true);
    let url = `/api/radio/search?limit=60&country=${encodeURIComponent(currentRegion)}`;
    if (query) url += `&name=${encodeURIComponent(query)}`;
    if (tag && tag !== 'All') url += `&tag=${encodeURIComponent(tag.toLowerCase())}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data) {
        setStations(data.data);
      } else {
        setStations([]);
      }
    } catch {
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations(search, selectedTag, region);
  }, [selectedTag, region]);

  const handleRegionSwitch = (newRegion) => {
    if (newRegion === region) return;
    setRegion(newRegion);
    setSelectedTag('All');
    setSearch('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStations(search.trim(), selectedTag, region);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Header & Region Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
              <RadioIcon className="w-6 h-6 text-purple-400" />
              {region === 'IN' ? 'Indian Live Radio & AIR' : 'Global Radio Broadcasts'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {region === 'IN' ? '🇮🇳 India Edition' : '🌍 Global Edition'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {region === 'IN'
              ? 'Stream 24/7 verified Indian FM channels, All India Radio (Vividh Bharati), Bollywood retro, and regional broadcasts'
              : 'Stream from 45,000+ public live radio broadcasts and high-bitrate global channels worldwide'}
          </p>
        </div>

        {/* Region Toggle Pill & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Region Switcher Buttons */}
          <div className="flex items-center bg-[#0d111d] p-1 rounded-xl border border-white/10 shadow-inner">
            <button
              onClick={() => handleRegionSwitch('IN')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                region === 'IN'
                  ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 text-white shadow-lg shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇮🇳</span>
              <span>India</span>
            </button>
            <button
              onClick={() => handleRegionSwitch('GLOBAL')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                region === 'GLOBAL'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Global</span>
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-64">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={region === 'IN' ? "Search Bollywood, Mirchi, AIR..." : "Search station or country..."}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0f1420] border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* 2. Genre Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {currentTags.map((item) => {
          const isActive = selectedTag === item.tag;
          return (
            <button
              key={item.tag}
              onClick={() => setSelectedTag(item.tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? region === 'IN'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/30'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-[#0f1420] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* 3. Station Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-3.5 space-y-3 shimmer-mask">
              <div className="aspect-square bg-white/[0.04] rounded-xl" />
              <div className="h-3.5 bg-white/[0.06] rounded w-3/4" />
              <div className="h-3 bg-white/[0.04] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : stations.length === 0 ? (
        <div className="py-20 text-center text-slate-500 space-y-3 glass-card rounded-2xl border border-white/5">
          <RadioIcon className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-slate-300">No Radio Stations Found</h3>
          <p className="text-xs text-slate-500">
            {region === 'IN'
              ? 'Try selecting "All Indian Stations" or search for "Mirchi", "AIR", or "Bollywood".'
              : 'Try selecting a different genre chip or adjusting your search keyword.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {stations.map((st) => {
            const isFav = isFavorite({ type: 'radio', ...st });
            return (
              <div
                key={st.id || st.url}
                onClick={() => play({ type: 'radio', ...st, is_video: false })}
                className="group relative glass-card rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer border border-white/5 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-900/20 transition-all transform hover:-translate-y-1"
              >
                {/* Station Favicon */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#0a0d16] border border-white/5 mb-3 flex items-center justify-center">
                  <img
                    src={st.favicon || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%200%2050%2050%22><rect width=%2250%22 height=%2250%22 fill=%22%23151a2e%22/></svg>'}
                    alt={st.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%200%2050%2050%22><rect width=%2250%22 height=%2250%22 fill=%22%23151a2e%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2222%22 fill=%22%237a8199%22>📻</text></svg>';
                    }}
                  />
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/50 scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  {/* Live Badge */}
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold text-red-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    LIVE
                  </div>
                </div>

                {/* Station Info */}
                <div className="space-y-1 overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors" title={st.name}>
                    {st.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {st.country || (region === 'IN' ? 'India' : 'Global')} · {st.bitrate ? `${st.bitrate}k` : st.codec || 'HQ'}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-500">
                  <span className="uppercase font-semibold tracking-wider truncate max-w-[80px] text-slate-400">
                    {(st.tags && st.tags[0]) || 'Radio'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite({ type: 'radio', ...st });
                    }}
                    className={`p-1 rounded transition-colors ${
                      isFav ? 'text-amber-400 scale-110' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
