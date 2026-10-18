import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';

const PlayerContext = createContext();

export const AVAILABLE_THEMES = [
  {
    id: 'oled',
    name: 'OLED Pure Black',
    description: 'Pitch black #000000 with glowing neon violet & fuchsia',
    badge: 'DEFAULT',
    colors: ['#000000', '#9333ea', '#ec4899'],
    accent: 'from-purple-600 to-pink-600',
    primary: '#a855f7'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'Deep obsidian with electric cyan & hot pink highlights',
    badge: 'NEON',
    colors: ['#020408', '#00f0ff', '#ff007f'],
    accent: 'from-cyan-500 to-pink-500',
    primary: '#00f0ff'
  },
  {
    id: 'emerald',
    name: 'Emerald & Gold',
    description: 'Black velvet with radiant emerald and gold glow',
    badge: 'LUXURY',
    colors: ['#010503', '#10b981', '#eab308'],
    accent: 'from-emerald-500 to-amber-500',
    primary: '#10b981'
  },
  {
    id: 'crimson',
    name: 'Crimson Velvet',
    description: 'Deep obsidian with ruby red & scarlet flames',
    badge: 'HOT',
    colors: ['#050102', '#f43f5e', '#a855f7'],
    accent: 'from-rose-600 to-purple-600',
    primary: '#f43f5e'
  },
  {
    id: 'abyssal',
    name: 'Abyssal Ocean',
    description: 'Pitch black with deep sapphire & electric cyan wave',
    badge: 'COOL',
    colors: ['#010308', '#3b82f6', '#06b6d4'],
    accent: 'from-blue-600 to-cyan-500',
    primary: '#3b82f6'
  },
  {
    id: 'amethyst',
    name: 'Cosmic Amethyst',
    description: 'Space void with ultraviolet & galaxy lavender',
    badge: 'COSMIC',
    colors: ['#030106', '#8b5cf6', '#c084fc'],
    accent: 'from-violet-600 to-fuchsia-500',
    primary: '#8b5cf6'
  }
];

export function PlayerProvider({ children }) {
  // Playback state
  const [currentItem, setCurrentItem] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePlayerType, setActivePlayerType] = useState('audio'); // 'audio' | 'video' | 'embed'
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setSpeedState] = useState(1);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);

  // Overlays & Drawers
  const [videoOverlayOpen, setVideoOverlayOpen] = useState(false);
  const [miniPlayerOpen, setMiniPlayerOpen] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [volumeBoost, setVolumeBoostState] = useState(1); // 1 | 1.5 | 2
  const [streamError, setStreamError] = useState(null); // { code, message } | null

  // Synced Lyrics
  const [lyrics, setLyrics] = useState({
    synced: false,
    lines: [],
    plain: '',
    source: 'none',
    loading: false
  });

  // Favorites (localStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('mh_favs');
      return stored ? JSON.parse(stored) : { radio: [], tv: [], youtube: [], podcasts: [], audiobooks: [], universal: [] };
    } catch {
      return { radio: [], tv: [], youtube: [], podcasts: [], audiobooks: [], universal: [] };
    }
  });

  // Settings & Preferences
  const [proxyEnabled, setProxyEnabled] = useState(true);
  const [tmdbKey, setTmdbKey] = useState(() => localStorage.getItem('mh_tmdb_key') || '');
  const [theme, setTheme] = useState(() => localStorage.getItem('mh_theme') || 'oled');

  // Sleep Timer
  const [sleepEndTime, setSleepEndTime] = useState(null);
  const [sleepRemaining, setSleepRemaining] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Premium OLED Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'danger',
    badge: '',
    onConfirm: () => {},
    onClose: () => {}
  });

  // DOM Refs
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const sleepTimerRef = useRef(null);
  const autoTuneTimerRef = useRef(null);
  const failoverCountRef = useRef(0);

  // Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem('mh_favs', JSON.stringify(favorites));
  }, [favorites]);

  // Sync TMDB key
  useEffect(() => {
    localStorage.setItem('mh_tmdb_key', tmdbKey);
  }, [tmdbKey]);

  // Sync theme to document element
  useEffect(() => {
    localStorage.setItem('mh_theme', theme);
    const themeClasses = ['theme-oled', 'theme-cyberpunk', 'theme-emerald', 'theme-crimson', 'theme-abyssal', 'theme-amethyst'];
    document.documentElement.classList.remove(...themeClasses);
    document.documentElement.classList.add(`theme-${theme}`);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.add('dark');
  }, [theme]);

  const cycleTheme = () => {
    const ids = AVAILABLE_THEMES.map(t => t.id);
    const currentIndex = ids.indexOf(theme);
    const nextIndex = (currentIndex + 1) % ids.length;
    const nextTheme = ids[nextIndex];
    setTheme(nextTheme);
    const themeObj = AVAILABLE_THEMES[nextIndex];
    showToast(`Theme: ${themeObj.name} 🎨`, 'info');
  };

  const cycleVolumeBoost = () => {
    const nextBoost = volumeBoost === 1 ? 1.5 : volumeBoost === 1.5 ? 2.0 : 1.0;
    setVolumeBoostState(nextBoost);
    showToast(`Volume Boost: ${Math.round(nextBoost * 100)}% 🔊`, 'info');
  };

  // Sleep timer interval countdown
  useEffect(() => {
    if (!sleepEndTime) {
      setSleepRemaining(null);
      return;
    }

    const interval = setInterval(() => {
      const remainingSec = Math.max(0, Math.round((sleepEndTime - Date.now()) / 1000));
      setSleepRemaining(remainingSec);

      if (remainingSec <= 0) {
        clearInterval(interval);
        triggerSleepFadeOut();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepEndTime]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, type === 'error' ? 4000 : 2500);
  };

  const requestConfirm = ({
    title = 'Are you sure?',
    message = '',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger',
    badge = ''
  }) => {
    return new Promise((resolve) => {
      setConfirmModal({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        type,
        badge,
        onConfirm: () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onClose: () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  };

  const isFavorite = (item) => {
    if (!item) return false;
    const cat = item.type || 'radio';
    const list = favorites[cat] || [];
    return list.some(f => (f.url && f.url === item.url) || (f.id && f.id === item.id) || (f.name && f.name === item.name));
  };

  const toggleFavorite = (item) => {
    if (!item) return;
    const cat = item.type || 'radio';
    setFavorites(prev => {
      const list = prev[cat] || [];
      const exists = list.some(f => (f.url && f.url === item.url) || (f.id && f.id === item.id) || (f.name && f.name === item.name));
      const nextList = exists
        ? list.filter(f => (f.url !== item.url) && (f.id !== item.id) && (f.name !== item.name))
        : [...list, item];
      
      showToast(exists ? 'Removed from favorites' : 'Saved to favorites ⭐', exists ? 'info' : 'success');
      return { ...prev, [cat]: nextList };
    });
  };

  // --- SMART STREAM SETUP ---
  const play = async (item) => {
    if (!item) return;

    // Destroy existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setCurrentItem(item);
    setStreamError(null);

    // Queue management
    setQueue(prev => {
      if (!prev.some(q => q.url === item.url || (q.id && q.id === item.id))) {
        const nextQ = [...prev, item];
        setQueueIndex(nextQ.length - 1);
        return nextQ;
      }
      const idx = prev.findIndex(q => q.url === item.url || (q.id && q.id === item.id));
      if (idx !== -1) setQueueIndex(idx);
      return prev;
    });

    const isTv = item.type === 'tv';
    const isYouTube = item.type === 'youtube' ||
      (item.url && (item.url.includes('youtube.com') || item.url.includes('youtu.be') || item.url.includes('googlevideo.com')));
    const isUniversal = item.type === 'universal';

    // If YouTube video/stream and not audio_only, guarantee embed_url so video and audio are synchronized
    let activeEmbedUrl = item.embed_url;
    if (isYouTube && !item.audio_only) {
      if (!activeEmbedUrl) {
        const ytIdMatch = (item.webpage_url || item.url || '').match(/(?:v=|\/|be\/)([0-9A-Za-z_-]{11})/);
        if (ytIdMatch) {
          activeEmbedUrl = `https://www.youtube-nocookie.com/embed/${ytIdMatch[1]}?autoplay=1&enablejsapi=1`;
        }
      }
      if (activeEmbedUrl) {
        item.embed_url = activeEmbedUrl;
      }
    }

    const isEmbed = Boolean(
      item.embed_url ||
      (item.url && (item.url.includes('w.soundcloud.com') || item.url.includes('/embed/') || item.url.includes('player.vimeo.com') || item.url.includes('player.twitch.tv')))
    );
    const isAudioOnly = !isEmbed && (item.audio_only === true || (!item.is_video && !isTv && !isYouTube));

    // Automatically trigger lyrics only for actual musical audio tracks, NOT video files, manifests or raw streams
    const trackTitle = item.title || item.name || '';
    const trackArtist = item.artist || item.uploader || item.author || '';
    const isVideoFile = /\.(mp4|m3u8|mkv|webm|ts|mov|avi|flv)($|\?)/i.test(trackTitle) ||
                        /\.(mp4|m3u8|mkv|webm|ts|mov|avi|flv)($|\?)/i.test(item.url || '');
    if (trackTitle && !isTv && !isVideoFile && (item.type === 'radio' || (!item.is_video && !isEmbed))) {
      fetchLyrics(trackTitle, trackArtist);
    }

    // Determine target player
    if (isEmbed) {
      // Native Embed Player for 100% Guaranteed Zero-Failure Playback (SoundCloud, Vimeo, Twitch, YouTube)
      setActivePlayerType('embed');
      setVideoOverlayOpen(true);
      setMiniPlayerOpen(true);
      if (audioRef.current) audioRef.current.pause();
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
      setIsPlaying(true);
    } else if (isAudioOnly) {
      // Audio Engine
      setActivePlayerType('audio');
      setVideoOverlayOpen(false);
      setMiniPlayerOpen(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }

      setupAudioStream(item);
    } else {
      // Native Video Player / HLS
      setActivePlayerType('video');
      setVideoOverlayOpen(true);
      setMiniPlayerOpen(true);
      if (audioRef.current) audioRef.current.pause();

      setupVideoStream(item);
    }
  };

  const setupAudioStream = (item) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    let streamUrl = item.url;
    const isHls = streamUrl.includes('.m3u8') || streamUrl.includes('m3u8') || item.is_live;

    if (isHls && proxyEnabled) {
      streamUrl = `/stream/hls?url=${encodeURIComponent(item.url)}`;
    }

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 30,
        maxBufferLength: 30,
        liveSyncDurationCount: 3,
        manifestLoadingTimeOut: 15000,
        fragLoadingTimeOut: 20000,
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(audio);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
      hlsRef.current = hls;
    } else {
      audio.src = streamUrl;
      audio.play().then(() => setIsPlaying(true)).catch(() => {
        // Fallback to proxy
        audio.src = `/stream/proxy?url=${encodeURIComponent(item.url)}`;
        audio.play().then(() => setIsPlaying(true)).catch(() => {
          showToast('Failed to start audio playback', 'error');
        });
      });
    }

    audio.volume = isMuted ? 0 : volume;
    audio.playbackRate = playbackSpeed;
  };

  const setupVideoStream = (item, forceProxy = false) => {
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    let streamUrl = item.url;
    const isHls = streamUrl.includes('.m3u8') || streamUrl.includes('m3u8') || item.is_live;
    const useProxy = forceProxy || proxyEnabled;

    if (isHls) {
      const targetUrl = useProxy ? `/stream/hls?url=${encodeURIComponent(item.url)}` : item.url;

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false, // Smooth 60fps streaming without stuttering
          backBufferLength: 30,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          maxBufferSize: 60 * 1000 * 1000,
          maxBufferHole: 0.5,
          liveSyncDurationCount: 3, // Maintain 3-segment safety buffer to guarantee zero freezing
          liveMaxLatencyDurationCount: 10,
          highBufferWatchdogPeriod: 2,
          nudgeOffset: 0.2,
          nudgeMaxRetry: 5,
          manifestLoadingTimeOut: 15000,
          manifestLoadingMaxRetry: 4,
          levelLoadingTimeOut: 15000,
          levelLoadingMaxRetry: 4,
          fragLoadingTimeOut: 20000,
          fragLoadingMaxRetry: 6,
        });
        hls.loadSource(targetUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          failoverCountRef.current = 0; // live manifest loaded, reset failover counter
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.warn('HLS stream fatal error:', data.type, data.details, data.response?.code);
            const status = data.response?.code;

            // If direct failed with CORS, try proxy once first
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR && !forceProxy && !useProxy) {
              showToast('Direct stream blocked by CORS. Switching to Secure Proxy 🛡️...', 'info');
              setupVideoStream(item, true);
              return;
            }

            // Only trigger offline failover if manifest itself returned 403 or 404
            if ((status === 403 || status === 404) && data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR) {
              setStreamError({
                code: status || 'OFFLINE',
                message: status === 403
                  ? 'Broadcast Restricted or Geo-Blocked (403 Forbidden)'
                  : 'Broadcast Stream Offline (404 Not Found)'
              });

              hls.destroy();

              // Smart Channel Jumper: Auto-tune to next working channel for TV broadcasts
              if (item.type === 'tv' && queue.length > 1 && failoverCountRef.current < 5) {
                failoverCountRef.current += 1;
                showToast(`⚠️ ${item.title || item.name} is offline (${status || 'DEAD'}). Auto-tuning to next live channel...`, 'info');
                if (autoTuneTimerRef.current) clearTimeout(autoTuneTimerRef.current);
                autoTuneTimerRef.current = setTimeout(() => {
                  next();
                }, 1200);
              } else {
                showToast(`⚠️ Broadcast unavailable (${status || 'OFFLINE'}). Please select another channel.`, 'error');
              }
              return;
            }

            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.warn('HLS fragment network glitch, reloading...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.warn('HLS media buffer glitch, recovering...');
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          } else {
            // Non-fatal buffer stall recovery
            if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
              if (video && video.paused) {
                video.play().catch(() => {});
              }
            }
          }
        });
        hlsRef.current = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = targetUrl;
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      const targetUrl = useProxy ? `/stream/proxy?url=${encodeURIComponent(item.url)}` : item.url;
      video.onerror = () => {
        setStreamError({
          code: 'UNAVAILABLE',
          message: 'The requested video stream returned an error or is restricted by the host server.'
        });
      };
      video.src = targetUrl;
      video.play().then(() => setIsPlaying(true)).catch(() => {
        if (!useProxy) {
          video.src = `/stream/proxy?url=${encodeURIComponent(item.url)}`;
          video.play().then(() => setIsPlaying(true)).catch(() => {
            showToast('Failed to start video stream', 'error');
          });
        }
      });
    }

    video.volume = isMuted ? 0 : volume;
    video.playbackRate = playbackSpeed;
  };

  // Resilient video player attachment hook: guarantees stream starts even after async mount
  useEffect(() => {
    if (!currentItem) return;
    if (activePlayerType === 'video' && videoRef.current) {
      const video = videoRef.current;
      if (!video.src && !hlsRef.current) {
        setupVideoStream(currentItem);
      }
    }
  }, [currentItem, activePlayerType, videoOverlayOpen, miniPlayerOpen]);

  const toggleProxy = () => {
    const nextProxy = !proxyEnabled;
    setProxyEnabled(nextProxy);
    showToast(nextProxy ? 'Stream Proxy: Enabled 🛡️' : 'Stream Proxy: Direct Mode ⚡', 'info');
    if (currentItem && activePlayerType === 'video') {
      setupVideoStream(currentItem, nextProxy);
    } else if (currentItem && activePlayerType === 'audio') {
      setupAudioStream(currentItem);
    }
  };

  const togglePlay = () => {
    if (!currentItem) return;

    if (activePlayerType === 'embed') {
      if (!videoOverlayOpen && !miniPlayerOpen) {
        setVideoOverlayOpen(true);
        setIsPlaying(true);
        return;
      }
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        try {
          if (isPlaying) {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            iframe.contentWindow.postMessage(JSON.stringify({ method: 'pause' }), '*');
          } else {
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            iframe.contentWindow.postMessage(JSON.stringify({ method: 'play' }), '*');
          }
        } catch (e) {
          console.warn('postMessage to iframe failed:', e);
        }
      }
      setIsPlaying(p => !p);
      return;
    }

    if (activePlayerType === 'video') {
      let player = videoRef.current || document.querySelector('video');

      // If video overlay was closed/cut from screen:
      if (!videoOverlayOpen && !miniPlayerOpen) {
        setVideoOverlayOpen(true);
        setIsPlaying(true);
        if (!player || (!player.src && !hlsRef.current)) {
          setupVideoStream(currentItem);
        } else if (player.paused) {
          player.play().then(() => setIsPlaying(true)).catch(() => {});
        }
        return;
      }

      if (!player) return;

      if (player.paused) {
        player.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Playback resume failed:', err);
          });
      } else {
        player.pause();
        setIsPlaying(false);
      }
      return;
    }

    if (activePlayerType === 'audio') {
      let player = audioRef.current || document.querySelector('audio');
      if (!player) return;

      // If audio was stopped or src was cleared:
      if (!player.src || player.src === '' || player.src === window.location.href) {
        setupAudioStream(currentItem);
        return;
      }

      if (player.paused) {
        player.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Playback resume failed:', err);
          });
      } else {
        player.pause();
        setIsPlaying(false);
      }
      return;
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
    const video = videoRef.current || document.querySelector('video');
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.src = '';
    }
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setVideoOverlayOpen(false);
  };

  const seek = (time) => {
    let player = activePlayerType === 'video' ? videoRef.current : audioRef.current;
    if (!player && activePlayerType === 'video') {
      player = document.querySelector('video');
    }
    if (player && isFinite(player.duration)) {
      player.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (val) => {
    const v = Math.max(0, Math.min(1, parseFloat(val)));
    setVolumeState(v);
    setIsMuted(false);
    if (audioRef.current) audioRef.current.volume = v;
    const video = videoRef.current || document.querySelector('video');
    if (video) video.volume = v;
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    const targetVol = nextMuted ? 0 : volume;
    if (audioRef.current) audioRef.current.volume = targetVol;
    const video = videoRef.current || document.querySelector('video');
    if (video) video.volume = targetVol;
    showToast(nextMuted ? 'Muted' : 'Unmuted', 'info');
  };

  const setPlaybackSpeed = (rate) => {
    const r = parseFloat(rate);
    setSpeedState(r);
    if (audioRef.current) audioRef.current.playbackRate = r;
    const video = videoRef.current || document.querySelector('video');
    if (video) video.playbackRate = r;
    showToast(`Playback speed: ${r}x`, 'info');
  };

  const next = () => {
    if (queueIndex + 1 < queue.length) {
      const nextIdx = queueIndex + 1;
      setQueueIndex(nextIdx);
      play(queue[nextIdx]);
    } else {
      showToast('End of playback queue', 'info');
    }
  };

  const prev = () => {
    if (queueIndex > 0) {
      const prevIdx = queueIndex - 1;
      setQueueIndex(prevIdx);
      play(queue[prevIdx]);
    }
  };

  // --- SLEEP TIMER ---
  const setSleepTimer = (minutes) => {
    if (minutes === 0) {
      setSleepEndTime(null);
      showToast('Sleep timer disabled', 'info');
      return;
    }
    const end = Date.now() + minutes * 60 * 1000;
    setSleepEndTime(end);
    showToast(`Sleep timer active: ${minutes} min`, 'success');
  };

  const triggerSleepFadeOut = () => {
    showToast('Sleep timer ending: Fading out volume...', 'info');
    const player = activePlayerType === 'video' ? videoRef.current : audioRef.current;
    if (!player) {
      stop();
      return;
    }

    const startVol = player.volume;
    const step = startVol / 10;
    const interval = setInterval(() => {
      if (player.volume > step) {
        player.volume -= step;
      } else {
        clearInterval(interval);
        stop();
        player.volume = startVol;
        setSleepEndTime(null);
        showToast('Playback stopped by Sleep Timer 💤', 'info');
      }
    }, 350);
  };

  // --- LYRICS FETCHING ---
  const fetchLyrics = async (title, artist = '') => {
    if (!title) return;
    setLyrics({ synced: false, lines: [], plain: '', source: 'none', loading: true });

    try {
      const res = await fetch(`/api/lyrics?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setLyrics({
          synced: Boolean(data.data.synced),
          lines: data.data.lines || [],
          plain: data.data.plain || '',
          source: data.data.source || 'lrclib',
          loading: false
        });
      } else {
        setLyrics({ synced: false, lines: [], plain: 'No lyrics found for this track.', source: 'none', loading: false });
      }
    } catch {
      setLyrics({ synced: false, lines: [], plain: 'Could not fetch lyrics.', source: 'none', loading: false });
    }
  };

  // Media event listeners for audio & video
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = (e) => {
      const p = e.target;
      if (p) {
        setCurrentTime(p.currentTime || 0);
        if (isFinite(p.duration) && p.duration > 0) {
          setDuration(p.duration);
        }
      }
    };
    const handleEnded = () => next();
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Synchronize video player listeners whenever player type or video element mounts/updates
  useEffect(() => {
    const video = videoRef.current || document.querySelector('video');
    if (!video) return;

    const handleTimeUpdate = (e) => {
      const p = e.target;
      if (p) {
        setCurrentTime(p.currentTime || 0);
        if (isFinite(p.duration) && p.duration > 0) {
          setDuration(p.duration);
        }
      }
    };
    const handleEnded = () => next();
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [activePlayerType, videoOverlayOpen, miniPlayerOpen, currentItem]);

  return (
    <PlayerContext.Provider
      value={{
        currentItem,
        isPlaying,
        setIsPlaying,
        activePlayerType,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        volume,
        isMuted,
        playbackSpeed,
        queue,
        queueIndex,
        videoOverlayOpen,
        miniPlayerOpen,
        lyricsOpen,
        queueOpen,
        volumeBoost,
        streamError,
        setStreamError,
        lyrics,
        favorites,
        proxyEnabled,
        tmdbKey,
        theme,
        sleepEndTime,
        sleepRemaining,
        toasts,
        audioRef,
        videoRef,
        play,
        togglePlay,
        stop,
        seek,
        setVolume,
        toggleMute,
        setPlaybackSpeed,
        next,
        prev,
        setVideoOverlayOpen,
        setMiniPlayerOpen,
        setLyricsOpen,
        setQueueOpen,
        setVolumeBoost: setVolumeBoostState,
        setSleepTimer,
        isFavorite,
        toggleFavorite,
        setProxyEnabled,
        toggleProxy,
        setupVideoStream,
        AVAILABLE_THEMES,
        cycleTheme,
        cycleVolumeBoost,
        setTmdbKey,
        setTheme,
        setFavorites,
        confirmModal,
        requestConfirm,
        showToast,
        fetchLyrics
      }}
    >
      {children}
      {/* Hidden audio player instance */}
      <audio ref={audioRef} preload="metadata" />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
