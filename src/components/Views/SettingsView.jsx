import React, { useState } from 'react';
import { Settings, Shield, Key, Palette, Trash2, Check, Sparkles, MessageSquare, ExternalLink, Maximize2 } from 'lucide-react';
import { GithubIcon, BrandLogo, DiscordIcon } from '../Icons';
import { usePlayer } from '../../context/PlayerContext';

export default function SettingsView() {
  const { 
    tmdbKey, 
    setTmdbKey, 
    proxyEnabled, 
    setProxyEnabled, 
    theme, 
    setTheme, 
    AVAILABLE_THEMES,
    showToast,
    requestConfirm
  } = usePlayer();

  const [inputKey, setInputKey] = useState(tmdbKey);
  const [autoFullscreen, setAutoFullscreen] = useState(
    localStorage.getItem('mh_auto_fullscreen') !== 'false'
  );

  const handleSaveTmdb = () => {
    setTmdbKey(inputKey.trim());
    showToast('TMDB API Key saved successfully', 'success');
  };

  const handleClearCache = async () => {
    const confirmed = await requestConfirm({
      title: 'Reset Local Cache & Recents?',
      message: 'This will purge all temporary station search results, stream caches, and recent URL extraction history from your browser. Your saved favorites and settings will remain completely safe.',
      confirmText: 'Purge Cache',
      type: 'danger',
      badge: 'CACHE PURGE'
    });
    if (confirmed) {
      localStorage.removeItem('mh_recent_universal');
      localStorage.removeItem('mh_radio_recent');
      localStorage.removeItem('mh_tv_recent');
      showToast('Cache and recents cleared successfully 🧹', 'success');
    }
  };

  const handleResetPreferences = async () => {
    const confirmed = await requestConfirm({
      title: 'Reset All Settings & Preferences?',
      message: 'This will reset your OLED theme, TMDB API Key, CORS proxy toggles, and UI preferences back to defaults. Bookmarks will not be touched.',
      confirmText: 'Reset Settings',
      type: 'warning',
      badge: 'RESET CONFIG'
    });
    if (confirmed) {
      setTheme('oled');
      setTmdbKey('');
      setInputKey('');
      setProxyEnabled(true);
      setAutoFullscreen(true);
      localStorage.removeItem('mh_tmdb_key');
      localStorage.removeItem('mh_theme');
      localStorage.removeItem('mh_auto_fullscreen');
      showToast('All settings reset to defaults ⚙️', 'info');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 max-w-4xl select-none">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-purple-400" />
          Settings & Preferences
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure OLED Black themes, TMDB metadata enrichment, and CORS streaming proxies
        </p>
      </div>

      <div className="space-y-5">
        {/* App Info & Credits Card */}
        <div className="p-6 rounded-3xl bg-black/60 border border-white/[0.08] shadow-2xl space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2.5">
              <BrandLogo className="w-6 h-6" />
              Global Media Hub PRO
            </h3>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold border border-purple-500/30">
              OLED EDITION
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            Stateless universal media portal built with Flask and React. Runs 100% identically on localhost and Vercel serverless with zero database or external storage requirements.
          </p>
          <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3">
            <div>
              <strong>Built by:</strong> Hidden-Rhythm · Discord: <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300 font-mono">hidden_rhythm</code>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/Hidden-Rhythm/media-hub" 
                target="_blank" 
                rel="noreferrer" 
                className="text-white hover:text-purple-300 flex items-center gap-1.5 font-semibold transition-colors group"
                title="GitHub: https://github.com/Hidden-Rhythm/media-hub"
              >
                <GithubIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>media-hub</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-purple-300" />
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText('hidden_rhythm');
                  showToast('Discord username copied: hidden_rhythm 🎮', 'info');
                }}
                className="text-[#5865F2] hover:text-[#7983f5] flex items-center gap-1.5 font-semibold transition-colors group cursor-pointer"
                title="Discord: hidden_rhythm (Click to copy)"
              >
                <DiscordIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Discord</span>
              </button>
            </div>
          </div>
        </div>

        {/* OLED UI Themes Selector */}
        <div className="p-6 rounded-3xl bg-black/60 border border-white/[0.08] shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                OLED Black UI Themes
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch between 6 pure black contrast themes optimized for OLED & modern HDR displays
              </p>
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold">
              Press T anytime
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {AVAILABLE_THEMES.map((t) => {
              const isSelected = theme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    showToast(`Applied ${t.name} Theme 🎨`, 'success');
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative group flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white/[0.08] border-purple-500 ring-2 ring-purple-500/30 shadow-lg shadow-purple-500/20'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        {t.name}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug mb-3">
                      {t.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
                    {t.colors.map((c, i) => (
                      <div
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <span className="text-[10px] font-mono text-slate-500 ml-auto uppercase font-bold">
                      {t.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TMDB API Key */}
        <div className="p-6 rounded-3xl bg-black/60 border border-white/[0.08] shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              TMDB Metadata Enrichment (Optional)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Provide a free The Movie Database (TMDB) API Key to enrich movie and TV station posters, ratings, and synopses. Stored strictly in your browser.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Enter TMDB API Key..."
              className="flex-1 p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors font-mono"
            />
            <button
              onClick={handleSaveTmdb}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs transition-opacity shadow-lg shadow-purple-600/30"
            >
              Save Key
            </button>
          </div>
        </div>

        {/* Stream Proxy Setting */}
        <div className="p-6 rounded-3xl bg-black/60 border border-white/[0.08] shadow-2xl flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              CORS Stream Proxying
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Route cross-origin restricted HLS streams and ISP-blocked media through the backend streaming proxy
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={proxyEnabled}
              onChange={(e) => setProxyEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6.5 bg-white/10 border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Auto Fullscreen Setting */}
        <div className="p-6 rounded-3xl bg-black/60 border border-white/[0.08] shadow-2xl flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-purple-400" />
              Auto Fullscreen on Startup
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automatically enter full-screen cinema mode upon opening the website or on first interaction
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoFullscreen}
              onChange={(e) => {
                setAutoFullscreen(e.target.checked);
                localStorage.setItem('mh_auto_fullscreen', String(e.target.checked));
                showToast(e.target.checked ? 'Auto-fullscreen enabled' : 'Auto-fullscreen disabled', 'info');
              }}
              className="sr-only peer"
            />
            <div className="w-12 h-6.5 bg-white/10 border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Clear Data */}
        <div className="p-6 rounded-3xl bg-black/60 border border-white/[0.08] shadow-2xl flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              Reset Cache & Recents
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Clear temporary search caches and recent media extraction history
            </p>
          </div>
          <button
            onClick={handleClearCache}
            className="px-4 py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-400 transition-colors cursor-pointer active:scale-95"
          >
            Clear Cache
          </button>
        </div>

        {/* Reset App Preferences */}
        <div className="p-6 rounded-3xl bg-black/60 border border-white/[0.08] shadow-2xl flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              Restore Default Settings
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Reset theme, TMDB configuration, and streaming preferences to factory defaults
            </p>
          </div>
          <button
            onClick={handleResetPreferences}
            className="px-4 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-400 transition-colors cursor-pointer active:scale-95"
          >
            Reset Settings
          </button>
        </div>
      </div>
    </div>
  );
}
