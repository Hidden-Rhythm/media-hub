import React, { useState, useEffect } from 'react';
import { Tv, Search, Star, Play, Calendar, Sparkles, Radio } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function TVView({ onOpenEpgModal }) {
  const { play, isFavorite, toggleFavorite } = usePlayer();
  const [country, setCountry] = useState('IN');
  const [channels, setChannels] = useState([]);
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('all'); // 'all' | 'news' | 'music' | 'sports' | 'entertainment'
  const [loading, setLoading] = useState(true);

  const countries = [
    { code: 'IN', label: 'India (IN)' },
    { code: 'US', label: 'United States (US)' },
    { code: 'UK', label: 'United Kingdom (UK)' },
    { code: 'FR', label: 'France (FR)' },
    { code: 'DE', label: 'Germany (DE)' },
    { code: 'CA', label: 'Canada (CA)' },
    { code: 'IT', label: 'Italy (IT)' },
    { code: 'ES', label: 'Spain (ES)' },
    { code: 'JP', label: 'Japan (JP)' },
    { code: 'BR', label: 'Brazil (BR)' },
    { code: 'AU', label: 'Australia (AU)' },
  ];

  const categories = [
    { id: 'all', label: '🌐 All Channels' },
    { id: 'news', label: '📰 News' },
    { id: 'music', label: '🎵 Music' },
    { id: 'sports', label: '⚽ Sports' },
    { id: 'entertainment', label: '🎬 Movies & Shows' },
  ];

  const fetchChannels = async (cc) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tv/channels?country=${cc}`);
      const data = await res.json();
      if (data.success && data.data) {
        setChannels(data.data);
      }
    } catch {
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels(country);
  }, [country]);

  const filtered = channels.filter(ch => {
    // 1. Text Search Filter
    const matchesText = !filter || 
      ch.name?.toLowerCase().includes(filter.toLowerCase()) || 
      ch.group?.toLowerCase().includes(filter.toLowerCase());
    if (!matchesText) return false;

    // 2. Category Filter
    if (category === 'news') {
      return ch.group?.toLowerCase().includes('news') || ch.name?.toLowerCase().includes('news');
    }
    if (category === 'music') {
      return (
        ch.group?.toLowerCase().includes('music') || 
        ch.name?.toLowerCase().includes('music') || 
        ch.name?.toLowerCase().includes('9x') || 
        ch.name?.toLowerCase().includes('jalwa') || 
        ch.name?.toLowerCase().includes('hits')
      );
    }
    if (category === 'sports') {
      return ch.group?.toLowerCase().includes('sport') || ch.name?.toLowerCase().includes('sport');
    }
    if (category === 'entertainment') {
      return (
        ch.group?.toLowerCase().includes('entertainment') || 
        ch.group?.toLowerCase().includes('movie') || 
        ch.group?.toLowerCase().includes('comedy') || 
        ch.group?.toLowerCase().includes('series')
      );
    }
    return true; // 'all'
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Tv className="w-6 h-6 text-pink-400" />
            Global Live Television
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Live news, music, sports, and entertainment with Smart Auto-Tune Failover
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* EPG Button */}
          <button
            onClick={onOpenEpgModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#151a2e] hover:bg-[#1d2440] border border-[#252b45] text-xs font-semibold text-slate-300 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>EPG Guide (DishTV Active)</span>
          </button>

          {/* Country Selector */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#151a2e] border border-[#252b45] text-xs font-semibold text-white outline-none cursor-pointer hover:border-purple-500 transition-colors"
          >
            {countries.map(c => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter & Category Controls Row */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search channels by name or genre..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#151a2e] border border-[#252b45] text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Live Auto-Tune Info Pill */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-[#0f1420] px-3 py-1.5 rounded-xl border border-white/5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Smart Auto-Tune: Automatically skips offline broadcasts</span>
          </div>
        </div>

        {/* Category Pills Row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  category === cat.id
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/30'
                    : 'bg-[#151a2e] border border-[#252b45] text-slate-400 hover:text-white hover:border-purple-500/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing <span className="text-white font-bold">{filtered.length}</span> channels
          </span>
        </div>
      </div>

      {/* Channel Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-3.5 space-y-3 shimmer-mask">
              <div className="aspect-video bg-white/[0.04] rounded-xl" />
              <div className="h-3.5 bg-white/[0.06] rounded w-3/4" />
              <div className="h-3 bg-white/[0.04] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500 space-y-3">
          <Tv className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-slate-300">No Channels Found</h3>
          <p className="text-xs">Try selecting a different category or adjusting your search filter.</p>
          <button
            onClick={() => { setCategory('all'); setFilter(''); }}
            className="text-xs px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors"
          >
            Show All Channels
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((ch, idx) => {
            const isFav = isFavorite({ type: 'tv', ...ch });
            return (
              <div
                key={ch.url || idx}
                onClick={() => play({ type: 'tv', is_live: true, is_video: true, ...ch })}
                className="group relative glass-card rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer"
              >
                {/* Channel Logo */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0f1420] border border-white/5 mb-3 flex items-center justify-center p-2 group-hover:scale-102 transition-transform">
                  <img
                    src={ch.logo || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%200%2050%2050%22><rect width=%2250%22 height=%2250%22 fill=%22%23151a2e%22/></svg>'}
                    alt={ch.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%200%2050%2050%22><rect width=%2250%22 height=%2250%22 fill=%22%23151a2e%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2222%22 fill=%22%237a8199%22>📺</text></svg>';
                    }}
                  />

                  {/* LIVE Badge */}
                  <span className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[9px] shadow-md animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" /> LIVE
                  </span>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg shadow-pink-600/50 scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1 overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate" title={ch.name}>
                    {ch.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {ch.group || 'Live Broadcast'}
                  </p>
                  {ch.now_playing && (
                    <p className="text-[10px] text-purple-300 font-medium truncate flex items-center gap-1.5 pt-0.5" title={`${ch.now_playing} (${ch.now_time || ''})`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                      <span className="truncate">{ch.now_playing}</span>
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-500">
                  <span className="uppercase font-semibold tracking-wider truncate max-w-[80px]">
                    {ch.tvg_id ? ch.tvg_id.split('.')[0] : 'TV'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite({ type: 'tv', ...ch });
                    }}
                    className={`p-1 rounded transition-colors ${
                      isFav ? 'text-yellow-400 scale-110' : 'text-slate-500 hover:text-white'
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
