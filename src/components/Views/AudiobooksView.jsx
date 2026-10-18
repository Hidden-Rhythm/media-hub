import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Star, ListMusic, Globe, Sparkles } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function AudiobooksView({ onOpenChaptersModal }) {
  const { isFavorite, toggleFavorite, showToast } = usePlayer();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('indian'); // 'indian' or 'global'
  const [selectedCat, setSelectedCat] = useState('all');

  const indianCategories = [
    { id: 'all', label: '🔥 All Indian Classics', cat: 'all' },
    { id: 'gita', label: '🕉️ Bhagavad Gita & Vedas', cat: 'gita' },
    { id: 'hindi', label: '📜 Munshi Premchand & Hindi', cat: 'hindi' },
    { id: 'tagore', label: '🎭 Rabindranath Tagore', cat: 'tagore' },
    { id: 'fables', label: '🦁 Ancient Fables (Panchatantra)', cat: 'fables' },
    { id: 'philosophy', label: '🧘 Sacred Philosophy & Upanishads', cat: 'philosophy' },
  ];

  const globalCategories = [
    { id: 'all', label: '🔥 All World Classics', cat: 'all' },
    { id: 'sherlock', label: '🔍 Sherlock Holmes Mysteries', cat: 'sherlock' },
    { id: 'horror', label: '🧛 Gothic Horror & Dracula', cat: 'horror' },
    { id: 'scifi', label: '🚀 Classic Sci-Fi & Wells', cat: 'scifi' },
    { id: 'classics', label: '🏰 Classic Literature & Austen', cat: 'classics' },
    { id: 'verne', label: '🌊 Jules Verne Voyages', cat: 'verne' },
    { id: 'philosophy', label: '🧠 Stoic Philosophy & Meditations', cat: 'philosophy' },
    { id: 'strategy', label: '⚔️ Sun Tzu & Epic Strategy', cat: 'strategy' },
  ];

  const currentCategories = region === 'indian' ? indianCategories : globalCategories;

  const searchBooks = async (query = '', cat = selectedCat, currentRegion = region) => {
    setLoading(true);
    try {
      const url = `/api/audiobooks/search?region=${encodeURIComponent(currentRegion)}&cat=${encodeURIComponent(cat)}&q=${encodeURIComponent(query)}&limit=36`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data) {
        setBooks(data.data);
      } else {
        setBooks([]);
      }
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchBooks(search, selectedCat, region);
  }, [selectedCat, region]);

  const handleRegionSwitch = (newRegion) => {
    if (newRegion === region) return;
    setRegion(newRegion);
    setSelectedCat('all');
    setSearch('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(search.trim(), selectedCat, region);
  };

  const handleBookClick = async (book) => {
    // If chapters are already loaded
    if (book.chapters && book.chapters.length > 0) {
      onOpenChaptersModal(book.title, book.chapters, book.author, book.image);
      return;
    }

    // Otherwise fetch chapters on demand
    showToast(`Loading chapters for ${book.title}...`, 'info');
    try {
      const res = await fetch(`/api/audiobooks/chapters?id=${encodeURIComponent(book.identifier || book.id)}`);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        onOpenChaptersModal(book.title, data.data, book.author, book.image);
      } else {
        showToast('No playable audio chapters found for this title', 'error');
      }
    } catch {
      showToast('Failed to load audiobook chapters', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Header with Region Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-amber-400" />
              {region === 'indian' ? 'Indian Classics & Epics' : 'Global Audiobooks & Classics'}
            </h2>
            <div className="flex items-center bg-[#151a2e] border border-[#252b45] p-1 rounded-xl">
              <button
                onClick={() => handleRegionSwitch('indian')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  region === 'indian'
                    ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇮🇳</span> India
              </button>
              <button
                onClick={() => handleRegionSwitch('global')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  region === 'global'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🌍</span> Global
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {region === 'indian'
              ? 'Indian epics (Mahabharata, Ramayana, Gita, Premchand, Tagore), ancient fables & spiritual texts'
              : 'World public domain audiobooks: Sherlock Holmes, Dracula, Frankenstein, Jules Verne & Stoic philosophy'}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full md:w-84">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              region === 'indian'
                ? 'Search Mahabharata, Gita, Premchand, Tagore, Kabir...'
                : 'Search Sherlock Holmes, Dracula, Frankenstein, Verne, Austen...'
            }
            className="w-full pl-10 pr-20 py-2 rounded-xl bg-[#151a2e] border border-[#252b45] text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* 2. Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {currentCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCat(c.cat);
              setSearch('');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCat === c.cat
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-[#151a2e] text-slate-400 hover:text-white border border-[#252b45]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 3. Audiobooks Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-[#151a2e] border border-[#252b45] rounded-2xl p-3.5 space-y-3 animate-pulse">
              <div className="aspect-square bg-slate-800 rounded-xl" />
              <div className="h-3.5 bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="py-20 text-center text-slate-500 space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-slate-300">No Audiobooks Found</h3>
          <p className="text-xs">Try selecting another collection pill or searching for a classic title.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {books.map((b, idx) => {
            const isFav = isFavorite({ type: 'audiobooks', ...b });
            const chapterCount = (b.chapters && b.chapters.length) || 0;

            return (
              <div
                key={b.identifier || idx}
                onClick={() => handleBookClick(b)}
                className="group relative glass-card rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#0f1420] border border-white/5 mb-3 group-hover:scale-102 transition-transform">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%200%2050%2050%22><rect width=%2250%22 height=%2250%22 fill=%22%23151a2e%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2222%22 fill=%22%237a8199%22>📚</text></svg>';
                    }}
                  />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/50 scale-90 group-hover:scale-100 transition-transform">
                      <ListMusic className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Badge */}
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30">
                    {b.badge || (b.region === 'global' ? '🌍 World Classic' : '🇮🇳 Indian Classic')}
                  </span>
                </div>

                <div className="space-y-1 overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate" title={b.title}>
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate" title={b.author}>
                    {b.author || 'Public Domain Author'}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-500">
                  <span>{chapterCount > 0 ? `${chapterCount} chapters` : 'Play Chapters'}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite({ type: 'audiobooks', ...b });
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
