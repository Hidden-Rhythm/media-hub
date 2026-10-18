import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Star, 
  Mic2, 
  Clock, 
  ListMusic, 
  Maximize2,
  Shield,
  ShieldAlert,
  Share2,
  Palette,
  Sparkles
} from 'lucide-react';
import { BrandLogo } from './Icons';
import { usePlayer } from '../context/PlayerContext';

export default function PlayerBar({ onOpenSleepModal, onOpenThemeModal }) {
  const {
    currentItem,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackSpeed,
    lyricsOpen,
    queueOpen,
    sleepRemaining,
    proxyEnabled,
    toggleProxy,
    togglePlay,
    stop,
    seek,
    setVolume,
    toggleMute,
    setPlaybackSpeed,
    volumeBoost,
    cycleVolumeBoost,
    cycleTheme,
    next,
    prev,
    play,
    isFavorite,
    toggleFavorite,
    setLyricsOpen,
    setQueueOpen,
    setVideoOverlayOpen,
    showToast
  } = usePlayer();

  const [hoverSeek, setHoverSeek] = useState(null);

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const h = Math.floor(m / 60);
    if (h > 0) {
      const remM = m % 60;
      return `${h}:${remM < 10 ? '0' : ''}${remM}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleProgressClick = (e) => {
    if (!duration || !isFinite(duration)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(ratio * duration);
  };

  const isLive = currentItem?.is_live || (duration === 0 && isPlaying && currentItem?.type === 'tv');
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isFav = isFavorite(currentItem);

  const toggleBrowserFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        showToast('Entered Fullscreen Mode 🔲', 'info');
      } else {
        document.exitFullscreen().catch(() => {});
        showToast('Exited Fullscreen Mode', 'info');
      }
    } catch {
      showToast('Fullscreen not supported in this browser', 'info');
    }
  };

  return (
    <footer className="fixed bottom-14 lg:bottom-0 left-0 right-0 h-[68px] sm:h-[76px] lg:h-[88px] bg-black/95 backdrop-blur-3xl border-t border-white/[0.08] px-3 sm:px-6 flex items-center justify-between z-40 select-none shadow-2xl">
      {/* Top Progress Bar for Mobile */}
      <div 
        onClick={handleProgressClick}
        className="absolute top-0 left-0 right-0 h-1 bg-white/10 md:hidden cursor-pointer"
      >
        <div 
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400"
          style={{ width: isLive ? '100%' : `${progressPercent}%` }}
        />
      </div>

      {/* 1. Left: Track Meta & Equalizer Visualizer */}
      <div className="flex items-center gap-2.5 sm:gap-4 w-auto flex-1 md:w-1/4 md:min-w-[200px] lg:min-w-[220px] overflow-hidden pr-2">
        <div 
          onClick={() => {
            if (!currentItem) return;
            const isVideoSource = currentItem.is_video || currentItem.type === 'tv' || currentItem.type === 'youtube' || currentItem.embed_url;
            if (isVideoSource) {
              if (currentItem.audio_only) {
                play({ ...currentItem, audio_only: false, is_video: true });
              } else {
                setVideoOverlayOpen(true);
              }
            }
          }}
          className="relative w-13 h-13 rounded-xl overflow-hidden bg-white/[0.04] border border-white/10 flex-shrink-0 cursor-pointer group shadow-lg"
        >
          {currentItem ? (
            <img 
              src={currentItem.thumbnail || currentItem.artwork || currentItem.favicon || currentItem.image || currentItem.logo || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%200%2050%2050%22><rect width=%2250%22 height=%2250%22 fill=%22%23151a2e%22/></svg>'}
              alt="Cover"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%200%2050%2050%22><rect width=%2250%22 height=%2250%22 fill=%22%23151a2e%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2222%22 fill=%22%237a8199%22>🎵</text></svg>';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black/40">
              <BrandLogo className="w-8 h-8 drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]" />
            </div>
          )}
          {(currentItem?.is_video || currentItem?.type === 'tv' || currentItem?.type === 'youtube' || currentItem?.embed_url) && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs" title="Expand Video">
              <Maximize2 className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex flex-col overflow-hidden min-w-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-sm font-semibold text-white truncate hover:underline cursor-pointer" title={currentItem?.title || currentItem?.name || 'Global Media Hub'}>
              {currentItem?.title || currentItem?.name || 'Ready to Stream'}
            </span>

            {/* Bouncy Audio Visualizer Waveform Animation */}
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3.5 px-1 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 flex-shrink-0" title="Audio Equalizer Active">
                <span className="w-0.5 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full wave-bar-1" />
                <span className="w-0.5 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full wave-bar-2" />
                <span className="w-0.5 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full wave-bar-3" />
                <span className="w-0.5 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full wave-bar-4" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
            <span className="truncate">
              {currentItem?.uploader || currentItem?.author || currentItem?.artist || currentItem?.country || currentItem?.type?.toUpperCase() || 'Select content to play'}
            </span>
            {currentItem?.type && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-purple-300 font-mono uppercase font-bold flex-shrink-0">
                {currentItem.type}
              </span>
            )}
          </div>
        </div>

        {currentItem && (
          <button
            onClick={() => toggleFavorite(currentItem)}
            className={`p-2 rounded-full transition-all ${isFav ? 'text-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-slate-500 hover:text-white'}`}
            title={isFav ? 'Remove Favorite' : 'Add to Favorites'}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
        )}
      </div>

      {/* Mobile Quick Controls (<md screens) */}
      <div className="flex md:hidden items-center gap-2 flex-shrink-0">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        <button
          onClick={() => setLyricsOpen(o => !o)}
          className={`p-2 rounded-xl border border-white/[0.08] transition-colors ${lyricsOpen ? 'text-purple-300 bg-purple-500/20 border-purple-500/40' : 'text-slate-400 bg-white/[0.04]'}`}
          title="Synced Lyrics"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            if (!currentItem) return;
            const isVideoSource = currentItem.is_video || currentItem.type === 'tv' || currentItem.type === 'youtube' || currentItem.embed_url;
            if (isVideoSource) {
              setVideoOverlayOpen(true);
            } else {
              setLyricsOpen(true);
            }
          }}
          className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400"
          title="Expand View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Center: Controls & Waveform Progress (Desktop & Tablet) */}
      <div className="hidden md:flex flex-col items-center gap-2 w-2/4 max-w-xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={prev}
            className="p-2 text-slate-400 hover:text-white hover:scale-110 transition-all cursor-pointer"
            title="Previous"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/40 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={stop}
            className="p-2 text-slate-400 hover:text-red-400 hover:scale-110 transition-all cursor-pointer"
            title="Stop"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>

          <button 
            onClick={next}
            className="p-2 text-slate-400 hover:text-white hover:scale-110 transition-all cursor-pointer"
            title="Next"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Progress Bar with Tooltip */}
        <div className="flex items-center gap-3 w-full text-[11px] font-mono text-slate-400">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <div 
            onClick={handleProgressClick}
            className="relative flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
          >
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 rounded-full transition-all duration-100"
              style={{ width: isLive ? '100%' : `${progressPercent}%` }}
            />
          </div>
          <span className="w-10">
            {isLive ? (
              <span className="text-red-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" /> LIVE
              </span>
            ) : (
              formatTime(duration)
            )}
          </span>
        </div>
      </div>

      {/* 3. Right: Speed, Boost, Sleep, Lyrics, Queue, Volume (Desktop & Tablet) */}
      <div className="hidden md:flex items-center justify-end gap-2.5 w-1/4">
        {/* Speed Selector */}
        <select
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(e.target.value)}
          className="bg-black/60 text-slate-300 text-xs px-2 py-1 rounded-lg border border-white/10 outline-none cursor-pointer hover:border-purple-500 transition-colors"
          title="Playback Speed"
        >
          <option value="0.5">0.5x</option>
          <option value="0.75">0.75x</option>
          <option value="1">1.0x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2.0x</option>
        </select>

        {/* Volume Boost Toggle */}
        <button
          onClick={cycleVolumeBoost}
          className={`px-2 py-1 text-[10px] font-mono font-bold rounded-lg border transition-all ${
            volumeBoost > 1 
              ? 'bg-purple-600/30 border-purple-500 text-purple-300 shadow-sm shadow-purple-500/20' 
              : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white'
          }`}
          title={`Audio Gain Boost: ${Math.round(volumeBoost * 100)}% (Click to cycle 100%, 150%, 200%)`}
        >
          {Math.round(volumeBoost * 100)}%
        </button>

        {/* Sleep Timer */}
        <button
          onClick={onOpenSleepModal}
          className={`p-2 rounded-xl transition-all relative ${
            sleepRemaining !== null 
              ? 'bg-purple-600/30 text-purple-400 border border-purple-500/40' 
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Sleep Timer"
        >
          <Clock className="w-4 h-4" />
          {sleepRemaining !== null && (
            <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-purple-600 text-white px-1 rounded-full">
              {Math.ceil(sleepRemaining / 60)}m
            </span>
          )}
        </button>

        {/* Synchronized Lyrics Drawer */}
        <button
          onClick={() => setLyricsOpen(o => !o)}
          className={`p-2 rounded-xl transition-all ${
            lyricsOpen 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30' 
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Synchronized Lyrics"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Playback Queue Drawer */}
        <button
          onClick={() => setQueueOpen(o => !o)}
          className={`p-2 rounded-xl transition-all ${
            queueOpen 
              ? 'bg-purple-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Playback Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Stream Proxy Toggle */}
        <button
          onClick={toggleProxy}
          className={`p-2 rounded-xl transition-all ${
            proxyEnabled
              ? 'bg-purple-600/30 text-purple-400 border border-purple-500/40' 
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title={proxyEnabled ? 'CORS Streaming Proxy: Active 🛡️ (Click for direct)' : 'Direct Stream Mode ⚡ (Click for proxy)'}
        >
          {proxyEnabled ? <Shield className="w-4 h-4 text-purple-400" /> : <ShieldAlert className="w-4 h-4" />}
        </button>

        {/* Share Stream Link */}
        {currentItem && (
          <button
            onClick={() => {
              const shareUrl = currentItem.webpage_url || currentItem.url;
              if (shareUrl) {
                navigator.clipboard.writeText(shareUrl);
                showToast('Stream link copied to clipboard 🔗', 'success');
              }
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            title="Copy Stream Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={toggleBrowserFullscreen}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          title="Toggle Browser Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Volume Slider */}
        <div className="flex items-center gap-2 pl-1">
          <button 
            onClick={toggleMute}
            className="text-slate-400 hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-18 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-purple-500"
            title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
        </div>
      </div>
    </footer>
  );
}
