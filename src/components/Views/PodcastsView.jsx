import React, { useState, useEffect } from 'react';
import { Mic2, Search, ListMusic, Star, Sparkles, Globe, Compass, Radio } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function PodcastsView({ onOpenEpisodesModal }) {
  const { isFavorite, toggleFavorite, showToast } = usePlayer();
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('IN'); // 'IN' (India) or 'GLOBAL'
  const [selectedTopic, setSelectedTopic] = useState('top');

  const indianTopics = [
    { id: 'top', label: '🔥 Top Indian Charts', query: '' },
    { id: 'myth', label: '🕉️ Mythology & Epics', query: 'mahabharata' },
    { id: 'business', label: '💼 Business & Finshots', query: 'finshots' },
    { id: 'talks', label: '🎙️ BeerBiceps & Talks', query: 'ranveer' },
    { id: 'crime', label: '🕵️ Desi True Crime', query: 'desi crime' },
    { id: 'history', label: '📜 Indian History', query: 'indian history' },
    { id: 'hindi', label: '📖 Hindi Kahaniya', query: 'hindi kahaniyan' },
    { id: 'spirit', label: '🧘 Gita & Spirituality', query: 'gita' },
    { id: 'startups', label: '🚀 Startups & Figuring Out', query: 'raj shamani' },
    { id: 'comedy', label: '😂 Cyrus Says & Fun', query: 'cyrus says' },
  ];

  const globalTopics = [
    { id: 'top', label: '🔥 Top Global Charts', query: '' },
    { id: 'tech', label: '💡 Tech & AI', query: 'technology' },
    { id: 'science', label: '🧠 Science & Health', query: 'huberman' },
    { id: 'history', label: '🌍 World History', query: 'history' },
    { id: 'business', label: '💼 Global Business', query: 'business' },
    { id: 'crime', label: '🔍 True Crime', query: 'true crime' },
    { id: 'comedy', label: '🎭 Comedy', query: 'comedy' },
    { id: 'philosophy', label: '📚 Philosophy', query: 'philosophy' },
  ];

  const currentTopics = region === 'IN' ? indianTopics : globalTopics;

  const fetchPodcasts = async (query = '', countryCode = region) => {
    setLoading(true);
    try {
      const countryParam = countryCode === 'GLOBAL' ? 'GLOBAL' : 'IN';
      const url = `/api/podcasts/search?q=${encodeURIComponent(query)}&country=${encodeURIComponent(countryParam)}&limit=30`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data) {
        setPodcasts(data.data);
      } else {
        setPodcasts([]);
      }
    } catch {
      setPodcasts([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when topic or region changes
  useEffect(() => {
    const topicObj = currentTopics.find((t) => t.id === selectedTopic) || currentTopics[0];
    fetchPodcasts(topicObj.query, region);
  }, [selectedTopic, region]);

  const handleRegionSwitch = (newRegion) => {
    if (newRegion === region) return;
    setRegion(newRegion);
    setSelectedTopic('top');
    setSearch('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      fetchPodcasts(search.trim(), region);
    }
  };

  const handleOpenEpisodes = async (pod) => {
    showToast(`Loading episodes for ${pod.title}...`, 'info');
    try {
      const res = await fetch(`/api/podcasts/episodes?feed=${encodeURIComponent(pod.feedUrl)}&limit=100`);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        onOpenEpisodesModal(pod.title, data.data, pod.author, pod.artwork);
      } else {
        showToast('No playable episodes found in feed', 'error');
      }
    } catch {
      showToast('Failed to parse podcast RSS feed', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Header & Region Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
              <Mic2 className="w-6 h-6 text-purple-400" />
              {region === 'IN' ? 'Indian & Desi Podcasts' : 'Global Podcasts'}
            </h2>
            <div className="flex items-center bg-[#151a2e] border border-[#252b45] p-1 rounded-xl">
              <button
                onClick={() => handleRegionSwitch('IN')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  region === 'IN'
                    ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇮🇳</span> India
              </button>
              <button
                onClick={() => handleRegionSwitch('GLOBAL')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  region === 'GLOBAL'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🌍</span> Global
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {region === 'IN'
              ? 'Premier Indian podcasts, Spotify & Apple Top Charts, mythology, business & Hindi stories'
              : 'Top worldwide podcasts from Apple Podcasts catalog with direct RSS audio streaming'}
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
              region === 'IN'
                ? 'Search Indian creators, Hindi shows, Finshots...'
                : 'Search global podcasts, creators, or topics...'
            }
            className="w-full pl-10 pr-20 py-2 rounded-xl bg-[#151a2e] border border-[#252b45] text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* 2. Topic / Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {currentTopics.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedTopic(t.id);
              setSearch('');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTopic === t.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-[#151a2e] text-slate-400 hover:text-white border border-[#252b45]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 3. Podcasts Grid */}
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
      ) : podcasts.length === 0 ? (
        <div className="py-20 text-center text-slate-500 space-y-3">
          <Mic2 className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-slate-300">No Podcasts Found</h3>
          <p className="text-xs">Try selecting another topic pill or searching for a specific podcast name.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {podcasts.map((pod) => {
            const isFav = isFavorite({ type: 'podcasts', ...pod });
            return (
              <div
                key={pod.id || pod.feedUrl}
                onClick={() => handleOpenEpisodes(pod)}
                className="group relative glass-card rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#0f1420] border border-white/5 mb-3 group-hover:scale-102 transition-transform">
                  <img
                    src={pod.artwork}
                    alt={pod.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%200%2050%2050%22><rect width=%2250%22 height=%2250%22 fill=%22%23151a2e%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2222%22 fill=%22%237a8199%22>🎙️</text></svg>';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/50 scale-90 group-hover:scale-100 transition-transform">
                      <ListMusic className="w-5 h-5" />
                    </div>
                  </div>

                  <span className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 backdrop-blur-md border ${
                    pod.country === 'GLOBAL' ? 'text-purple-300 border-purple-500/30' : 'text-amber-300 border-amber-500/30'
                  }`}>
                    {pod.country === 'GLOBAL' ? '🌍 Global' : '🇮🇳 India'}
                  </span>
                </div>

                <div className="space-y-1 overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate" title={pod.title}>
                    {pod.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {pod.author || pod.genre || 'Podcast'}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-500">
                  <span>{pod.episodeCount ? `${pod.episodeCount} eps` : 'Episodes'}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite({ type: 'podcasts', ...pod });
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
