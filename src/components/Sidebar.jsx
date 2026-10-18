import React from 'react';
import { 
  Home,
  Radio, 
  Tv, 
  Mic2, 
  BookOpen, 
  Link2, 
  Star, 
  Settings, 
  Palette, 
  Command, 
  Code2,
  X
} from 'lucide-react';
import { BrandLogo, YoutubeIcon, GithubIcon, DiscordIcon } from './Icons';
import { usePlayer } from '../context/PlayerContext';

export default function Sidebar({ currentTab, onTabChange, onOpenThemeModal, onOpenShortcutsModal, isMobile = false, onCloseMobile }) {
  const { theme, AVAILABLE_THEMES, showToast } = usePlayer();

  const currentThemeObj = AVAILABLE_THEMES?.find(t => t.id === theme) || AVAILABLE_THEMES?.[0];

  const navItems = [
    { id: 'home', path: '/', label: 'Home', icon: Home, color: 'text-purple-400 group-hover:text-purple-300' },
    { id: 'radio', path: '/radio', label: 'Radio', icon: Radio, count: '45k+', color: 'text-cyan-400 group-hover:text-cyan-300' },
    { id: 'tv', path: '/tv', label: 'Live TV', icon: Tv, badge: 'LIVE', color: 'text-pink-500 group-hover:text-pink-400' },
    { id: 'youtube', path: '/youtube', label: 'YouTube', icon: YoutubeIcon, badge: '4K', color: 'text-red-500 group-hover:text-red-400' },
    { id: 'podcasts', path: '/podcasts', label: 'Podcasts', icon: Mic2, color: 'text-purple-400 group-hover:text-purple-300' },
    { id: 'audiobooks', path: '/audiobooks', label: 'Audiobooks', icon: BookOpen, color: 'text-amber-400 group-hover:text-amber-300' },
    { id: 'universal', path: '/universal', label: 'Universal URL', icon: Link2, color: 'text-emerald-400 group-hover:text-emerald-300' },
    { id: 'api', path: '/api-hub', label: 'Universal API', icon: Code2, badge: 'REST', color: 'text-yellow-400 group-hover:text-yellow-300' },
    { id: 'favorites', path: '/favorites', label: 'Favorites', icon: Star, color: 'text-yellow-400 group-hover:text-yellow-300' },
    { id: 'settings', path: '/settings', label: 'Settings', icon: Settings, color: 'text-slate-400 group-hover:text-slate-300' },
  ];

  return (
    <aside className={
      isMobile 
        ? "w-full h-full flex flex-col bg-black/98 p-5 z-50 select-none overflow-y-auto" 
        : "hidden lg:flex w-64 min-w-[16rem] h-full flex-col bg-black/95 backdrop-blur-3xl border-r border-white/[0.08] p-5 z-20 select-none shadow-2xl"
    }>
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-6 mb-4 border-b border-white/[0.08]">
        <div 
          onClick={() => {
            onTabChange('home', '/');
            if (onCloseMobile) onCloseMobile();
          }}
          className="flex items-center gap-3 cursor-pointer group"
          title="Go to Home"
        >
          <BrandLogo className="w-10 h-10 drop-shadow-[0_0_16px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform" />
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5 group-hover:text-purple-300 transition-colors">
              Media Hub <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">OLED</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Global Media Center</p>
          </div>
        </div>

        {isMobile && (
          <button
            onClick={onCloseMobile}
            className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close Navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Discover & Stream
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id, item.path);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-medium text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 font-semibold scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : (item.color || 'text-slate-400')}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  item.badge === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-purple-500/30 text-purple-300'
                }`}>
                  {item.badge}
                </span>
              )}
              {item.count && (
                <span className="text-[11px] text-slate-500 group-hover:text-slate-300 font-mono">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme Quick Switcher & Shortcuts Pill */}
      <div className="py-3 my-2 border-y border-white/[0.08] flex items-center justify-between gap-2">
        <button
          onClick={onOpenThemeModal}
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          title="Switch OLED Black Theme (Press T)"
        >
          <Palette className="w-3.5 h-3.5 text-purple-400" />
          <span className="truncate">{currentThemeObj?.name || 'Theme'}</span>
        </button>

        <button
          onClick={onOpenShortcutsModal}
          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-400 hover:text-white transition-colors"
          title="Keyboard Shortcuts (?)"
        >
          <Command className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Author & Footer Credit */}
      <div className="pt-2 text-xs text-slate-400 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-300">Hidden-Rhythm</span>
          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/Hidden-Rhythm/media-hub"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              title="GitHub: https://github.com/Hidden-Rhythm/media-hub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <button 
              onClick={() => {
                navigator.clipboard.writeText('hidden_rhythm');
                showToast('Discord username copied: hidden_rhythm 🎮', 'info');
              }}
              className="text-slate-400 hover:text-[#5865F2] transition-colors cursor-pointer" 
              title="Discord: hidden_rhythm (Click to copy)"
            >
              <DiscordIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Built by Hidden-Rhythm · Discord: hidden_rhythm
        </p>
      </div>
    </aside>
  );
}
