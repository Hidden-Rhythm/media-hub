import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Flame, 
  Radio, 
  Compass,
  Play, 
  Headphones, 
  Star, 
  Clock, 
  Eye,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { YoutubeIcon } from '../Icons';
import { usePlayer } from '../../context/PlayerContext';

export default function YouTubeView() {
  const { play, isFavorite, toggleFavorite, showToast } = usePlayer();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [feedMode, setFeedMode] = useState('all'); // 'all' | 'trending' | 'live'
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance' | 'popular' | 'latest'

  const categories = [
    { id: 'all', label: '🔥 All Videos' },
    { id: 'gaming', label: '🎮 Gaming & Esports' },
    { id: 'live', label: '🔴 Live Broadcasts' },
    { id: 'news', label: '📰 Breaking News' },
    { id: 'movies', label: '🎬 Movies & Trailers' },
    { id: 'music', label: '🎵 Official Music' },
    { id: 'sports', label: '⚽ Sports Highlights' },
    { id: 'tutorials', label: '💻 Tech & Coding' },
    { id: 'documentary', label: '🌍 Documentaries' },
    { id: 'comedy', label: '😂 Standup & Comedy' },
  ];

  const sortOptions = [
    { id: 'relevance', label: 'Relevance', icon: SlidersHorizontal },
    { id: 'popular', label: 'Most Popular', icon: TrendingUp },
    { id: 'latest', label: 'Latest Uploads', icon: Zap },
  ];

  const loadVideos = useCallback(async (mode = feedMode, cat = category, query = search, sort = sortBy) => {
    setLoading(true);
    let endpoint = '/api/youtube/search';
    let params = new URLSearchParams();
    params.set('limit', '28');

    if (mode === 'live') {
      endpoint = '/api/youtube/live';
      if (cat && cat !== 'all') params.set('cat', cat);
      if (query.trim()) params.set('q', query.trim());
    } else if (mode === 'trending') {
      endpoint = '/api/youtube/trending';
      params.set('cat', cat || 'all');
    } else {
      // standard search / explore
      endpoint = '/api/youtube/search';
      params.set('cat', cat || 'all');
      params.set('sort', sort || 'relevance');
      if (query.trim()) params.set('q', query.trim());
    }

    try {
      const res = await fetch(`${endpoint}?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setVideos(data.data);
      } else {
        setVideos([]);
      }
    } catch {
      setVideos([]);
      showToast('Failed to load YouTube feed', 'error');
    } finally {
      setLoading(false);
    }
  }, [feedMode, category, search, sortBy, showToast]);

  // Refetch whenever category or feedMode changes
  useEffect(() => {
    loadVideos(feedMode, category, search, sortBy);
  }, [category, feedMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadVideos(feedMode, category, search, sortBy);
  };

  const handleModeChange = (newMode) => {
    setFeedMode(newMode);
    loadVideos(newMode, category, search, sortBy);
  };

  const handleCategorySelect = (catId) => {
    setCategory(catId);
    if (catId === 'live' && feedMode !== 'live') {
      setFeedMode('live');
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    // If user was on live or trending tab, switch to explore mode to browse with new sort
    if (feedMode !== 'all') {
      setFeedMode('all');
      loadVideos('all', category, search, newSort);
    } else {
      loadVideos(feedMode, category, search, newSort);
    }
  };

  const formatDuration = (secs) => {
    if (!secs) return '';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatViews = (views) => {
    if (!views || isNaN(views)) return null;
    const num = Number(views);
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return `${num}`;
  };

  const handlePlayAudio = async (e, vid) => {
    e.stopPropagation();
    showToast('Extracting HD background audio stream...', 'info');

    try {
      const res = await fetch(`/api/youtube/extract?url=${encodeURIComponent(vid.url)}&quality=audio`);
      const data = await res.json();
      if (data.success && data.data) {
        play({
          ...vid,
          url: data.data.url || data.data.audio_url,
          audio_only: true,
          is_video: false
        });
        showToast(`Playing audio: ${vid.title}`, 'success');
      } else {
        showToast('Could not extract direct audio stream', 'error');
      }
    } catch {
      showToast('Audio extraction failed', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 max-w-7xl mx-auto select-none">
      {/* 1. Header & Navigation Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <YoutubeIcon className="w-7 h-7 text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]" />
            YouTube Hub & Streams
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            HD 1080p/4K video playback, live broadcasts, latest uploads & popular hits with zero ad-interruption
          </p>
        </div>

        {/* Feed Modes: Explore vs Trending vs Live */}
        <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/[0.08]">
          <button
            onClick={() => handleModeChange('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              feedMode === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore</span>
          </button>

          <button
            onClick={() => handleModeChange('trending')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              feedMode === 'trending'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Trending</span>
          </button>

          <button
            onClick={() => handleModeChange('live')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              feedMode === 'live'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Live Streams</span>
          </button>

          <button
            onClick={() => loadVideos(feedMode, category, search, sortBy)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-1"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Search Bar & Sort Filters Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${category === 'all' ? 'YouTube' : category} videos, creators, gameplay, streams...`}
            className="w-full pl-11 pr-24 py-3 rounded-2xl bg-black/50 border border-white/[0.08] text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500/60 transition-all shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-md shadow-purple-600/30"
          >
            Search
          </button>
        </form>

        {/* Sort By Filter Pills: Relevance, Most Popular, Latest */}
        <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-2xl border border-white/[0.08] flex-shrink-0 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-purple-400" />
            Sort:
          </span>
          {sortOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = sortBy === opt.id && feedMode === 'all';
            return (
              <button
                key={opt.id}
                onClick={() => handleSortChange(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
                title={`Sort by ${opt.label}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Category Chips with Emojis */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-white text-black border-white shadow-lg shadow-white/10 font-bold scale-102'
                  : 'bg-black/50 text-slate-300 hover:text-white border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 4. Active Feed Status Banner */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            Showing <strong className="text-white capitalize">{category}</strong>{' '}
            {feedMode === 'live' 
              ? 'Live Broadcasts' 
              : feedMode === 'trending' 
              ? 'Trending Content' 
              : sortBy === 'latest' 
              ? 'Latest Uploads (Newest First)' 
              : sortBy === 'popular' 
              ? 'Most Popular Videos (Highest Views)' 
              : 'Videos'}
            {search.trim() ? ` for "${search.trim()}"` : ''}
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          {videos.length} videos found
        </span>
      </div>

      {/* 5. Video Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-3.5 space-y-3 shimmer-mask">
              <div className="aspect-video bg-white/[0.04] rounded-xl" />
              <div className="h-4 bg-white/[0.06] rounded w-3/4" />
              <div className="h-3 bg-white/[0.04] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="py-24 text-center text-slate-500 space-y-3 border border-dashed border-white/[0.08] rounded-3xl bg-black/40">
          <YoutubeIcon className="w-12 h-12 mx-auto text-slate-600 opacity-60" />
          <h3 className="text-base font-bold text-slate-300">No Videos Found</h3>
          <p className="text-xs max-w-sm mx-auto text-slate-400">
            Try searching for specific titles or switch to another category or sort filter.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('all');
              setFeedMode('all');
              setSortBy('relevance');
              loadVideos('all', 'all', '', 'relevance');
            }}
            className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-xs font-semibold text-purple-300 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {videos.map((vid) => {
            const isFav = isFavorite({ type: 'youtube', ...vid });
            const viewCountFormatted = formatViews(vid.view_count);

            return (
              <div
                key={vid.id || vid.url}
                onClick={() => play({ type: 'youtube', is_video: true, ...vid })}
                className="group relative glass-card rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer hover:border-purple-500/40 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/[0.06] mb-3 group-hover:scale-101 transition-transform">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      if (vid.id) {
                        e.target.src = `https://i.ytimg.com/vi/${vid.id}/hqdefault.jpg`;
                      }
                    }}
                  />

                  {/* LIVE Badge vs Duration */}
                  {vid.is_live ? (
                    <span className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] shadow-lg shadow-red-600/40 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE
                    </span>
                  ) : vid.duration > 0 ? (
                    <span className="absolute bottom-2.5 right-2.5 bg-black/85 backdrop-blur-md text-white text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border border-white/10">
                      {formatDuration(vid.duration)}
                    </span>
                  ) : null}

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-xl shadow-purple-600/50 scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1.5 overflow-hidden flex-1">
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-purple-300 transition-colors" title={vid.title}>
                    {vid.title}
                  </h4>
                  
                  {/* Uploader & View Count */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                    <span className="truncate max-w-[140px]">{vid.uploader}</span>
                    {viewCountFormatted && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="font-mono text-slate-400 flex items-center gap-1 flex-shrink-0" title={`${vid.view_count} views`}>
                          <Eye className="w-3 h-3 text-slate-500" />
                          {viewCountFormatted}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Footer Controls: Audio Only + Favorite */}
                <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-white/[0.06] text-[11px]">
                  <button
                    onClick={(e) => handlePlayAudio(e, vid)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-purple-600/30 hover:text-purple-300 text-slate-300 border border-white/[0.08] transition-colors"
                    title="Stream background audio only"
                  >
                    <Headphones className="w-3.5 h-3.5 text-purple-400" />
                    <span>Audio Only</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite({ type: 'youtube', ...vid });
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isFav 
                        ? 'text-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' 
                        : 'text-slate-500 hover:text-white hover:bg-white/10'
                    }`}
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className="w-4 h-4 fill-current" />
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
