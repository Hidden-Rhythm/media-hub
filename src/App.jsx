import React, { useState, useEffect } from 'react';
import { Maximize2, Menu, Home, Radio, Tv, Palette } from 'lucide-react';
import { BrandLogo, YoutubeIcon } from './components/Icons';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';
import VideoOverlay from './components/VideoOverlay';
import LyricsDrawer from './components/LyricsDrawer';
import QueueDrawer from './components/QueueDrawer';
import ToastContainer from './components/ToastContainer';

// Modals
import SleepTimerModal from './components/Modals/SleepTimerModal';
import MetadataModal from './components/Modals/MetadataModal';
import EpgModal from './components/Modals/EpgModal';
import ChaptersModal from './components/Modals/ChaptersModal';
import ThemeModal from './components/Modals/ThemeModal';
import ShortcutsModal from './components/Modals/ShortcutsModal';
import ConfirmModal from './components/Modals/ConfirmModal';

// Views
import HomeView from './components/Views/HomeView';
import RadioView from './components/Views/RadioView';
import TVView from './components/Views/TVView';
import YouTubeView from './components/Views/YouTubeView';
import PodcastsView from './components/Views/PodcastsView';
import AudiobooksView from './components/Views/AudiobooksView';
import UniversalView from './components/Views/UniversalView';
import ApiHubView from './components/Views/ApiHubView';
import FavoritesView from './components/Views/FavoritesView';
import SettingsView from './components/Views/SettingsView';

const ROUTE_TO_TAB = {
  '/': 'home',
  '/home': 'home',
  '/radio': 'radio',
  '/tv': 'tv',
  '/youtube': 'youtube',
  '/podcasts': 'podcasts',
  '/audiobooks': 'audiobooks',
  '/universal': 'universal',
  '/api-hub': 'api',
  '/api': 'api',
  '/favorites': 'favorites',
  '/settings': 'settings'
};

const TAB_TO_ROUTE = {
  home: '/',
  radio: '/radio',
  tv: '/tv',
  youtube: '/youtube',
  podcasts: '/podcasts',
  audiobooks: '/audiobooks',
  universal: '/universal',
  api: '/api-hub',
  favorites: '/favorites',
  settings: '/settings'
};

function getInitialTab() {
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  return ROUTE_TO_TAB[path] || 'home';
}

function MainApp() {
  const [currentTab, setCurrentTab] = useState(getInitialTab);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sleepModalOpen, setSleepModalOpen] = useState(false);
  const [metaModalUrl, setMetaModalUrl] = useState(null);
  const [epgModalOpen, setEpgModalOpen] = useState(false);
  const [chaptersData, setChaptersData] = useState(null);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  // Sync fullscreen change state
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Handle professional tab navigation with real browser URL updating (/youtube, /radio, /tv, etc.)
  const handleTabChange = (tabId, targetPath) => {
    setCurrentTab(tabId);
    setMobileDrawerOpen(false);
    const route = targetPath || TAB_TO_ROUTE[tabId] || '/radio';
    if (window.location.pathname !== route) {
      window.history.pushState({ tab: tabId }, '', route);
    }
  };

  // Sync browser back/forward buttons with active view
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
      const matchedTab = ROUTE_TO_TAB[path] || 'radio';
      setCurrentTab(matchedTab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Auto-Fullscreen on initial startup / first user interaction
  useEffect(() => {
    const isAutoFullscreenEnabled = localStorage.getItem('mh_auto_fullscreen') !== 'false';
    if (!isAutoFullscreenEnabled) return;

    // Immediate attempt (functions in PWA, kiosk environments, or permitted browsers)
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {}

    // First interaction fallback (satisfies modern browser Transient Activation security)
    const triggerFullscreenOnce = () => {
      try {
        if (!document.fullscreenElement && localStorage.getItem('mh_auto_fullscreen') !== 'false') {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch {}
    };

    window.addEventListener('click', triggerFullscreenOnce, { once: true });
    window.addEventListener('keydown', triggerFullscreenOnce, { once: true });
    window.addEventListener('touchstart', triggerFullscreenOnce, { once: true });

    return () => {
      window.removeEventListener('click', triggerFullscreenOnce);
      window.removeEventListener('keydown', triggerFullscreenOnce);
      window.removeEventListener('touchstart', triggerFullscreenOnce);
    };
  }, []);

  const {
    currentItem,
    togglePlay,
    toggleMute,
    seek,
    currentTime,
    duration,
    volume,
    setVolume,
    setLyricsOpen,
    setVideoOverlayOpen,
    videoOverlayOpen,
    videoRef,
    cycleTheme,
    confirmModal
  } = usePlayer();

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyL':
          setLyricsOpen(o => !o);
          break;
        case 'KeyT':
          cycleTheme();
          break;
        case 'Slash':
          if (e.shiftKey) {
            e.preventDefault();
            setShortcutsModalOpen(o => !o);
          }
          break;
        case 'KeyF':
          if (currentItem && currentItem.is_video) {
            setVideoOverlayOpen(o => !o);
          } else {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }
          break;
        case 'F11':
          e.preventDefault();
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
          break;
        case 'KeyP':
          if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch(() => {});
          } else if (videoRef?.current && document.pictureInPictureEnabled) {
            videoRef.current.requestPictureInPicture().catch(() => {});
          }
          break;
        case 'ArrowLeft':
          seek(Math.max(0, currentTime - 5));
          break;
        case 'ArrowRight':
          if (duration > 0) seek(Math.min(duration, currentTime + 5));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.05));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.05));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleMute, seek, currentTime, duration, volume, setVolume, setLyricsOpen, setVideoOverlayOpen, currentItem, cycleTheme]);

  const handleOpenMetaModal = (url) => {
    setMetaModalUrl(url);
  };

  const handleOpenChapters = (title, items, subtitle, artwork) => {
    setChaptersData({ title, items, subtitle, artwork });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-black text-[#e8ebf5] select-none font-sans relative">
      {/* Ambient Glow Background reflecting active media */}
      <div 
        className="absolute top-0 right-0 w-[55vw] h-[55vh] rounded-full blur-[140px] opacity-20 pointer-events-none transition-all duration-1000 -z-0 animate-ambient-glow"
        style={{
          background: currentTab === 'tv' 
            ? 'radial-gradient(circle, #ec4899 0%, transparent 70%)' 
            : currentTab === 'youtube'
            ? 'radial-gradient(circle, #ef4444 0%, transparent 70%)'
            : currentTab === 'audiobooks'
            ? 'radial-gradient(circle, #f59e0b 0%, transparent 70%)'
            : 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)'
        }}
      />

      {/* Floating Cinema Fullscreen Pill if not in Fullscreen */}
      {!isFullscreen && (
        <button
          onClick={() => {
            document.documentElement.requestFullscreen().catch(() => {});
          }}
          className="fixed top-4 right-8 z-40 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 hover:text-white text-[11px] font-semibold backdrop-blur-md shadow-2xl transition-all hover:scale-105"
          title="Click to enter Fullscreen Cinema Mode (or press F)"
        >
          <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Enter Fullscreen</span>
        </button>
      )}

      {/* Mobile Top Header (Visible on < lg) */}
      <header className="flex lg:hidden items-center justify-between px-4 py-3 bg-black/95 backdrop-blur-xl border-b border-white/[0.08] z-30 flex-shrink-0">
        <div 
          onClick={() => handleTabChange('home', '/')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <BrandLogo className="w-8 h-8 drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]" />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-base tracking-tight">Media Hub</span>
            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">OLED</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setThemeModalOpen(true)}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-purple-300"
            title="Theme Palette"
          >
            <Palette className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-semibold"
            title="Open Menu"
          >
            <Menu className="w-4 h-4 text-purple-400" />
            <span>Menu</span>
          </button>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-[#0a0a0f] border-r border-white/10 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <Sidebar 
              currentTab={currentTab} 
              onTabChange={handleTabChange} 
              onOpenThemeModal={() => {
                setMobileDrawerOpen(false);
                setThemeModalOpen(true);
              }}
              onOpenShortcutsModal={() => {
                setMobileDrawerOpen(false);
                setShortcutsModalOpen(true);
              }}
              isMobile={true}
              onCloseMobile={() => setMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 1. Left Sidebar (Desktop) */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={handleTabChange} 
        onOpenThemeModal={() => setThemeModalOpen(true)}
        onOpenShortcutsModal={() => setShortcutsModalOpen(true)}
      />

      {/* 2. Main Content Stage */}
      <main className="flex-1 h-full overflow-y-auto px-4 py-4 md:px-8 md:py-7 pb-36 lg:pb-28 relative z-10 scrollbar-thin">
        {currentTab === 'home' && <HomeView onNavigate={handleTabChange} />}
        {currentTab === 'radio' && <RadioView />}
        {currentTab === 'tv' && <TVView onOpenEpgModal={() => setEpgModalOpen(true)} />}
        {currentTab === 'youtube' && <YouTubeView />}
        {currentTab === 'podcasts' && <PodcastsView onOpenEpisodesModal={handleOpenChapters} />}
        {currentTab === 'audiobooks' && <AudiobooksView onOpenChaptersModal={handleOpenChapters} />}
        {currentTab === 'universal' && <UniversalView />}
        {currentTab === 'api' && <ApiHubView />}
        {currentTab === 'favorites' && <FavoritesView />}
        {currentTab === 'settings' && <SettingsView />}
      </main>

      {/* 3. Lyrics & Queue Drawers */}
      <LyricsDrawer />
      <QueueDrawer />

      {/* 4. Fixed Player Bar */}
      <PlayerBar 
        onOpenSleepModal={() => setSleepModalOpen(true)} 
        onOpenThemeModal={() => setThemeModalOpen(true)}
      />

      {/* 5. Mobile Bottom Navigation Bar (Visible on < lg) */}
      <nav className="fixed bottom-0 left-0 right-0 h-14 bg-black/95 backdrop-blur-2xl border-t border-white/[0.08] flex lg:hidden items-center justify-around px-2 z-30 select-none">
        <button
          onClick={() => handleTabChange('home', '/')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all ${
            currentTab === 'home' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => handleTabChange('radio', '/radio')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all ${
            currentTab === 'radio' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-5 h-5" />
          <span className="text-[10px]">Radio</span>
        </button>

        <button
          onClick={() => handleTabChange('tv', '/tv')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all ${
            currentTab === 'tv' ? 'text-pink-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tv className="w-5 h-5" />
          <span className="text-[10px]">Live TV</span>
        </button>

        <button
          onClick={() => handleTabChange('youtube', '/youtube')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all ${
            currentTab === 'youtube' ? 'text-red-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <YoutubeIcon className="w-5 h-5" />
          <span className="text-[10px]">YouTube</span>
        </button>

        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-slate-400 hover:text-purple-300 transition-all"
        >
          <Menu className="w-5 h-5 text-purple-400" />
          <span className="text-[10px] text-slate-300">More</span>
        </button>
      </nav>

      {/* 6. Modals & Overlays */}
      <VideoOverlay onOpenMetaModal={handleOpenMetaModal} />
      <SleepTimerModal isOpen={sleepModalOpen} onClose={() => setSleepModalOpen(false)} />
      <MetadataModal url={metaModalUrl} isOpen={Boolean(metaModalUrl)} onClose={() => setMetaModalUrl(null)} />
      <EpgModal isOpen={epgModalOpen} onClose={() => setEpgModalOpen(false)} />
      <ThemeModal isOpen={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
      <ShortcutsModal isOpen={shortcutsModalOpen} onClose={() => setShortcutsModalOpen(false)} />
      
      {chaptersData && (
        <ChaptersModal
          title={chaptersData.title}
          items={chaptersData.items}
          subtitle={chaptersData.subtitle}
          artwork={chaptersData.artwork}
          isOpen={Boolean(chaptersData)}
          onClose={() => setChaptersData(null)}
        />
      )}

      {/* 7. Floating Toasts & Confirmation Modal */}
      <ConfirmModal {...confirmModal} />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <MainApp />
    </PlayerProvider>
  );
}
