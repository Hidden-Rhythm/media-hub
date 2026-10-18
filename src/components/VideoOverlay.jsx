import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Headphones, 
  Info, 
  PictureInPicture, 
  Maximize2, 
  Minimize2,
  Sparkles,
  ExternalLink,
  Shield,
  ShieldAlert,
  Play,
  Pause,
  Volume2,
  VolumeX,
  AlertTriangle,
  RefreshCw,
  SkipForward
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function VideoOverlay({ onOpenMetaModal }) {
  const {
    currentItem,
    videoOverlayOpen,
    setVideoOverlayOpen,
    miniPlayerOpen,
    setMiniPlayerOpen,
    activePlayerType,
    videoRef,
    proxyEnabled,
    toggleProxy,
    isPlaying,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    togglePlay,
    isMuted,
    toggleMute,
    streamError,
    setupVideoStream,
    next,
    play,
    stop,
    showToast
  } = usePlayer();

  const [subtitlesLoaded, setSubtitlesLoaded] = useState(false);

  // Close / Minimize on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && videoOverlayOpen) {
        setVideoOverlayOpen(false); // smoothly minimize to floating player
        showToast('Minimized to Floating Mini-Player 🗗', 'info');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videoOverlayOpen, setVideoOverlayOpen, showToast]);

  // If no media or audio only, or both overlay and mini player are closed
  if (!currentItem || activePlayerType === 'audio' || (!videoOverlayOpen && !miniPlayerOpen)) {
    return null;
  }

  const togglePip = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current && document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
        showToast('Opened in Native Picture-in-Picture 🪟', 'success');
      } else {
        showToast('Native PiP not supported on embeds. Using in-app Mini-Player!', 'info');
      }
    } catch (e) {
      showToast('Picture-in-Picture not available for this stream', 'info');
    }
  };

  const handleAudioOnly = () => {
    showToast('Switching to background audio...', 'info');
    play({
      ...currentItem,
      audio_only: true,
      is_video: false
    });
  };

  const handleFetchSubtitles = async () => {
    if (!currentItem.webpage_url && !currentItem.url) return;
    showToast('Fetching WebVTT subtitles...', 'info');

    try {
      const targetUrl = currentItem.webpage_url || currentItem.url;
      const res = await fetch(`/api/subtitles?url=${encodeURIComponent(targetUrl)}&langs=en,hi`);
      const data = await res.json();

      if (data.success && data.data && data.data.length > 0) {
        const video = videoRef.current;
        if (video) {
          const existing = video.querySelectorAll('track');
          existing.forEach(t => t.remove());

          data.data.forEach((sub, idx) => {
            const blob = new Blob([sub.vtt], { type: 'text/vtt' });
            const blobUrl = URL.createObjectURL(blob);
            const track = document.createElement('track');
            track.kind = 'subtitles';
            track.label = sub.lang.toUpperCase();
            track.srclang = sub.lang;
            track.src = blobUrl;
            if (idx === 0) track.default = true;
            video.appendChild(track);
          });

          if (video.textTracks && video.textTracks.length > 0) {
            video.textTracks[0].mode = 'showing';
          }
          setSubtitlesLoaded(true);
          showToast(`Subtitles loaded (${data.data.length} tracks)`, 'success');
        }
      } else {
        showToast('No subtitles available for this video', 'info');
      }
    } catch {
      showToast('Failed to load subtitles', 'error');
    }
  };

  const handleCloseVideo = () => {
    const video = videoRef.current || document.querySelector('video');
    if (video) {
      video.pause();
    }
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        iframe.contentWindow.postMessage(JSON.stringify({ method: 'pause' }), '*');
      } catch (e) {}
    }
    setIsPlaying(false);
    setVideoOverlayOpen(false);
    setMiniPlayerOpen(false);
    showToast('Video closed. Press Play on bottom bar to resume ⏯️', 'info');
  };

  const isLive = currentItem.is_live || currentItem.type === 'tv';
  const embedSource = currentItem.embed_url || currentItem.url;
  const isExpanded = videoOverlayOpen;

  return (
    <div
      className={
        isExpanded
          ? "fixed inset-0 bg-black/95 backdrop-blur-3xl z-50 flex flex-col items-center justify-center p-3 sm:p-4 md:p-8 select-none animate-fadeIn"
          : "fixed bottom-36 sm:bottom-28 right-3 sm:right-6 z-40 w-[calc(100vw-24px)] sm:w-80 md:w-96 rounded-2xl bg-[#0f1420]/95 backdrop-blur-2xl border border-[#252b45] shadow-2xl overflow-hidden animate-slideUp select-none group"
      }
    >
      {/* 1. Header Bar */}
      {isExpanded ? (
        <div className="w-full max-w-6xl flex items-center justify-between mb-3 text-white">
          <div className="flex items-center gap-3 overflow-hidden">
            {isLive && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 text-white font-extrabold text-xs shadow-lg shadow-red-600/40 animate-pulse flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-white" /> LIVE
              </span>
            )}
            <div className="overflow-hidden">
              <h2 className="text-lg font-bold truncate max-w-xl text-white">
                {currentItem.title || currentItem.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{currentItem.uploader || currentItem.country || currentItem.group || currentItem.type?.toUpperCase()}</span>
                {currentItem.now_playing && (
                  <>
                    <span>•</span>
                    <span className="text-purple-300 font-medium truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                      <span>Now: {currentItem.now_playing}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setVideoOverlayOpen(false);
                setMiniPlayerOpen(true);
                showToast('Floating Mini-Player active 🗗', 'info');
              }}
              className="p-2.5 rounded-full bg-white/10 hover:bg-purple-600 text-white transition-all duration-200"
              title="Minimize to Floating Mini-Player"
            >
              <Minimize2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleCloseVideo}
              className="p-2.5 rounded-full bg-white/10 hover:bg-red-600 hover:rotate-90 text-white transition-all duration-200"
              title="Close Video"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-3 py-2 bg-[#151a2e]/90 flex items-center justify-between border-b border-[#252b45] text-xs">
          <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
            {isLive && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[9px] animate-pulse flex-shrink-0">
                LIVE
              </span>
            )}
            <span className="truncate font-semibold text-white text-xs">
              {currentItem.title || currentItem.name}
            </span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setVideoOverlayOpen(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Expand to Full Overlay (F)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCloseVideo}
              className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/10 transition-colors"
              title="Close Video"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Video Viewport */}
      <div
        className={
          isExpanded
            ? "relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center group"
            : "relative aspect-video bg-black flex items-center justify-center"
        }
      >
        {activePlayerType === 'embed' ? (
          <iframe
            src={embedSource}
            title={currentItem.title || "Video Player"}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            playsInline
            controls
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={(e) => {
              if (e.target) {
                setCurrentTime(e.target.currentTime || 0);
                if (isFinite(e.target.duration) && e.target.duration > 0) {
                  setDuration(e.target.duration);
                }
              }
            }}
            onEnded={() => next()}
          />
        )}

        {/* Stream Error Overlay */}
        {streamError && (
          isExpanded ? (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center space-y-4 z-20 animate-fadeIn">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Broadcast Stream Unavailable ({streamError.code})</h3>
                <p className="text-xs text-slate-300 max-w-md">
                  {streamError.message}. The upstream broadcaster's CDN is currently offline or geo-restricting access.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => next()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Next Channel</span>
                </button>
                <button
                  onClick={() => setupVideoStream(currentItem, true)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors border border-white/10"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Stream</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-3 text-center z-20 space-y-2">
              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Broadcast Offline ({streamError.code})
              </span>
              <button
                onClick={() => next()}
                className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
              >
                <SkipForward className="w-3 h-3" /> Next Channel
              </button>
            </div>
          )
        )}

        {/* Hover Quick Action Overlay (Mini-Player Mode Only) */}
        {!isExpanded && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={toggleMute}
              className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {activePlayerType === 'video' && (
              <button
                onClick={togglePip}
                className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                title="Native PiP"
              >
                <PictureInPicture className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setVideoOverlayOpen(true)}
              className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
              title="Expand"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 3. Bottom Control Actions Row (Expanded Overlay Mode Only) */}
      {isExpanded && (
        <div className="w-full max-w-6xl mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Proxy Stream Bypass Toggle */}
            <button
              onClick={toggleProxy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                proxyEnabled
                  ? 'bg-purple-600/25 border-purple-500/50 text-purple-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Bypass ISP or CORS blocks via backend streaming proxy"
            >
              {proxyEnabled ? <Shield className="w-3.5 h-3.5 text-purple-400" /> : <ShieldAlert className="w-3.5 h-3.5" />}
              <span>{proxyEnabled ? 'CORS Proxy Active 🛡️' : 'Direct Stream ⚡'}</span>
            </button>

            {currentItem.type === 'youtube' && (
              <button
                onClick={handleFetchSubtitles}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                  subtitlesLoaded
                    ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{subtitlesLoaded ? 'CC Active' : 'Load Subtitles (CC)'}</span>
              </button>
            )}

            <button
              onClick={handleAudioOnly}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Audio Only</span>
            </button>

            <button
              onClick={() => onOpenMetaModal(currentItem.webpage_url || currentItem.url)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Info & Metadata</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activePlayerType === 'video' && (
              <button
                onClick={togglePip}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
                title="Pop out native Picture-in-Picture window"
              >
                <PictureInPicture className="w-3.5 h-3.5" />
                <span>Native PiP</span>
              </button>
            )}

            {currentItem.webpage_url && (
              <a
                href={currentItem.webpage_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Original Source</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
