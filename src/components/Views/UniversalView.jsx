import React, { useState } from 'react';
import { Link2, Play, Sparkles, History, ExternalLink, AlertCircle, Compass } from 'lucide-react';
import { 
  TwitchIcon, 
  KickIcon, 
  YoutubeIcon, 
  VimeoIcon, 
  SoundCloudIcon, 
  TiktokIcon, 
  SpotifyIcon, 
  RedditIcon, 
  TwitterXIcon, 
  RumbleIcon 
} from '../Icons';
import { usePlayer } from '../../context/PlayerContext';

export default function UniversalView() {
  const { play, showToast } = usePlayer();
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('best');
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState(() => {
    try {
      const stored = localStorage.getItem('mh_recent_universal');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [blockedSiteInfo, setBlockedSiteInfo] = useState(null);

  const handleStream = async (targetUrl = url) => {
    const cleanUrl = targetUrl.trim();
    if (!cleanUrl) {
      showToast('Please enter or paste a media URL', 'error');
      return;
    }

    setLoading(true);
    setBlockedSiteInfo(null);
    showToast('Extracting stream...', 'info');

    try {
      const res = await fetch(`/api/universal/play?url=${encodeURIComponent(cleanUrl)}&quality=${quality}`);
      const data = await res.json();

      if (data.success && data.data) {
        let embedUrl = data.data.embed_url;
        if (embedUrl && embedUrl.includes('twitch.tv')) {
          const host = window.location.hostname || 'localhost';
          embedUrl = `${embedUrl}&parent=${host}`;
        }

        const item = {
          type: 'universal',
          name: data.data.title || 'Universal Stream',
          subtitle: data.data.extractor ? data.data.extractor.toUpperCase() : 'Stream',
          url: data.data.url,
          audio_url: data.data.audio_url,
          embed_url: embedUrl,
          webpage_url: cleanUrl,
          thumbnail: data.data.thumbnail,
          is_video: data.data.is_video,
          is_live: data.data.is_live,
          available_heights: data.data.available_heights
        };

        play(item);

        // Save to recents
        const updatedRecent = [item, ...recent.filter(r => r.webpage_url !== cleanUrl)].slice(0, 10);
        setRecent(updatedRecent);
        localStorage.setItem('mh_recent_universal', JSON.stringify(updatedRecent));
        showToast('Stream launched successfully', 'success');
      } else {
        if (data.requires_external || (data.error && data.error.includes('X-Frame-Options'))) {
          setBlockedSiteInfo({
            url: cleanUrl,
            message: data.error || 'This website restricts external streaming and embedding.'
          });
        }
        showToast(data.error || 'Could not extract stream from this URL', 'error');
      }
    } catch {
      showToast('Failed to connect to media extraction server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    { name: '🌊 Oceans HD (Direct MP4)', url: 'https://vjs.zencdn.net/v/oceans.mp4' },
    { name: '🎬 Big Buck Bunny (Direct MP4)', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { name: '🐰 Big Buck Bunny (HD HLS Stream)', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
    { name: '🍎 Apple BipBop (Adaptive HLS)', url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8' },
    { name: '📺 9XM Bollywood Hits (Live HLS)', url: 'https://wiselp.wiseplayout.com/9XM/master.m3u8' },
    { name: '🎧 Monstercat (Live Twitch)', url: 'https://www.twitch.tv/monstercat' },
  ];

  const platforms = [
    { name: 'Twitch', icon: TwitchIcon, color: 'text-[#9146FF]' },
    { name: 'Kick', icon: KickIcon, color: 'text-[#53FC18]' },
    { name: 'YouTube', icon: YoutubeIcon, color: 'text-red-500' },
    { name: 'SoundCloud', icon: SoundCloudIcon, color: 'text-[#FF5500]' },
    { name: 'Vimeo', icon: VimeoIcon, color: 'text-[#1AB7EA]' },
    { name: 'TikTok', icon: TiktokIcon, color: 'text-[#25F4EE]' },
    { name: 'Spotify', icon: SpotifyIcon, color: 'text-[#1ED760]' },
    { name: 'Rumble', icon: RumbleIcon, color: 'text-[#85C742]' },
    { name: 'Reddit', icon: RedditIcon, color: 'text-[#FF4500]' },
    { name: 'X / Twitter', icon: TwitterXIcon, color: 'text-white' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Link2 className="w-6 h-6 text-purple-400" />
          Universal URL Media Extractor
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Paste any link from Twitch, Kick, Vimeo, TikTok, SoundCloud, Bandcamp, Rumble, X, Reddit, and 1,700+ sites.
        </p>
      </div>

      {/* Supported Platforms Strip with authentic icons */}
      <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] shadow-xl space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            1,700+ Supported Streaming Networks & Protocols
          </span>
          <span className="text-[10px] text-purple-400 font-mono">HLS · MP4 · M3U8 · DASH</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          {platforms.map(p => {
            const Icon = p.icon;
            return (
              <div 
                key={p.name}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/20 transition-all text-xs font-semibold text-slate-300 whitespace-nowrap cursor-default group"
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${p.color}`} />
                <span>{p.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Input Box */}
      <div className="p-6 rounded-2xl bg-[#0f1420]/80 border border-[#252b45] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Twitch, Kick, Vimeo, TikTok, SoundCloud, Rumble, Reddit URL..."
            className="flex-1 p-3.5 rounded-xl bg-[#151a2e] border border-[#252b45] text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors"
          />

          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="p-3.5 rounded-xl bg-[#151a2e] border border-[#252b45] text-xs font-semibold text-white outline-none cursor-pointer hover:border-purple-500 transition-colors"
          >
            <option value="best">Best Quality</option>
            <option value="1080">1080p</option>
            <option value="720">720p</option>
            <option value="480">480p</option>
            <option value="audio">Audio Only</option>
          </select>

          <button
            onClick={() => handleStream()}
            disabled={loading}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            <span>{loading ? 'Extracting...' : 'Stream Media'}</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Try Examples:</span>
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setUrl(p.url);
                handleStream(p.url);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-[#151a2e] border border-[#252b45] text-slate-300 hover:text-white hover:border-purple-500 transition-colors cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Blocked Site Notice */}
      {blockedSiteInfo && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-200">Site Blocks In-App Embedding</h4>
              <p className="text-xs text-slate-300">
                {blockedSiteInfo.message}
              </p>
            </div>
          </div>
          <a
            href={blockedSiteInfo.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors flex-shrink-0"
          >
            <span>Open Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Recent Streams */}
      {recent.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <History className="w-4 h-4" />
            <span>Recently Streamed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recent.map((item, idx) => (
              <div
                key={idx}
                onClick={() => play(item)}
                className="flex items-center gap-3 p-3 rounded-2xl glass-card cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0f1420] overflow-hidden flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:text-purple-400">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Link2 className="w-5 h-5" />
                  )}
                </div>
                <div className="overflow-hidden min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">{item.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{item.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
