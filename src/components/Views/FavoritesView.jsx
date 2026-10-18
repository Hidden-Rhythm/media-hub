import React, { useState } from 'react';
import { Star, Trash2, Play } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function FavoritesView() {
  const { favorites, play, toggleFavorite, setFavorites, showToast, requestConfirm } = usePlayer();
  const [filter, setFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'radio', label: 'Radio' },
    { id: 'tv', label: 'Live TV' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'podcasts', label: 'Podcasts' },
    { id: 'audiobooks', label: 'Audiobooks' },
    { id: 'universal', label: 'Universal' },
  ];

  let items = [];
  if (filter === 'all') {
    Object.keys(favorites).forEach(k => {
      items = items.concat(favorites[k] || []);
    });
  } else {
    items = favorites[filter] || [];
  }

  const handleClearAll = async () => {
    if (items.length === 0) return;
    const isFiltered = filter !== 'all';
    const confirmed = await requestConfirm({
      title: isFiltered ? `Clear ${filter.toUpperCase()} Bookmarks?` : 'Clear All Saved Favorites?',
      message: isFiltered 
        ? `Are you sure you want to remove all saved bookmarks in the ${filter} category from this device?`
        : 'Are you sure you want to remove all bookmarked radio stations, live TV channels, YouTube videos, and podcasts from this device?',
      confirmText: 'Clear Bookmarks',
      type: 'danger',
      badge: 'BOOKMARKS'
    });
    if (confirmed) {
      if (isFiltered) {
        setFavorites(prev => ({ ...prev, [filter]: [] }));
        showToast(`Cleared ${filter} bookmarks 🧹`, 'info');
      } else {
        setFavorites({ radio: [], tv: [], youtube: [], podcasts: [], audiobooks: [], universal: [] });
        showToast('All bookmarks cleared 🧹', 'info');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
            Your Favorites
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Locally saved stations, live channels, videos, and podcast episodes
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-red-500/10"
            title="Clear saved favorites"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{filter === 'all' ? 'Clear All' : `Clear ${filter.toUpperCase()}`}</span>
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filter === f.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-[#151a2e] text-slate-400 hover:text-white border border-[#252b45]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="py-20 text-center text-slate-500 space-y-3">
          <Star className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-slate-300">No Favorites in this Category</h3>
          <p className="text-xs">Click the ⭐ icon on any media card to bookmark it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item, idx) => {
            const thumb = item.thumbnail || item.artwork || item.favicon || item.image || item.logo;
            return (
              <div
                key={idx}
                onClick={() => play(item)}
                className="group relative glass-card rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#0f1420] border border-white/5 mb-3 group-hover:scale-102 transition-transform">
                  <img
                    src={thumb || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%200%2050%2050%22><rect width=%2250%22 height=%2250%22 fill=%22%23151a2e%22/></svg>'}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%200%2050%2050%22><rect width=%2250%22 height=%2250%22 fill=%22%23151a2e%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2222%22 fill=%22%237a8199%22>⭐</text></svg>';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-yellow-500 text-black flex items-center justify-center shadow-lg shadow-yellow-500/50 scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate">
                    {item.title || item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {item.uploader || item.author || item.country || item.type?.toUpperCase()}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-500">
                  <span className="uppercase font-semibold tracking-wider">{item.type || 'Media'}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item);
                    }}
                    className="p-1 rounded text-red-400 hover:text-red-300 hover:scale-110 transition-all"
                    title="Remove Favorite"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
