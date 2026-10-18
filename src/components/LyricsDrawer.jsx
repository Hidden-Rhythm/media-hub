import React, { useState, useEffect, useRef } from 'react';
import { X, Mic2, Sparkles, Search, RefreshCw, Copy, Check, Type } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function LyricsDrawer() {
  const { 
    lyricsOpen, 
    setLyricsOpen, 
    lyrics, 
    currentTime, 
    seek, 
    currentItem, 
    fetchLyrics,
    showToast 
  } = usePlayer();

  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState('text-sm'); // 'text-xs' | 'text-sm' | 'text-base'
  const activeLineRef = useRef(null);

  // Sync search input when currentItem changes
  useEffect(() => {
    if (currentItem) {
      const title = currentItem.title || currentItem.name || '';
      const artist = currentItem.artist || currentItem.uploader || '';
      setSearchQuery(artist ? `${artist} - ${title}` : title);
    }
  }, [currentItem]);

  // Find active line index
  let activeIdx = -1;
  if (lyrics.synced && lyrics.lines.length > 0) {
    for (let i = 0; i < lyrics.lines.length; i++) {
      if (lyrics.lines[i].time <= currentTime && (!lyrics.lines[i + 1] || lyrics.lines[i + 1].time > currentTime)) {
        activeIdx = i;
        break;
      }
    }
  }

  // Smooth scroll active line into center
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeIdx]);

  if (!lyricsOpen) return null;

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    showToast(`Searching lyrics for "${searchQuery}"...`, 'info');
    fetchLyrics(searchQuery.trim());
  };

  const handleRefreshCurrent = () => {
    if (!currentItem) return;
    const title = currentItem.title || currentItem.name || '';
    const artist = currentItem.artist || currentItem.uploader || '';
    showToast('Refreshing lyrics for now playing track...', 'info');
    fetchLyrics(title, artist);
  };

  const handleCopyLyrics = () => {
    let fullText = '';
    if (lyrics.synced && lyrics.lines.length > 0) {
      fullText = lyrics.lines.map(l => l.text).join('\n');
    } else if (lyrics.plain) {
      fullText = lyrics.plain;
    }

    if (fullText) {
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      showToast('Lyrics copied to clipboard 📋', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <aside className="fixed top-0 right-0 bottom-[88px] w-96 bg-[#0f1420]/95 backdrop-blur-3xl border-l border-[#252b45] z-30 flex flex-col p-5 shadow-2xl animate-slideLeft select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#252b45]">
        <div className="flex items-center gap-2 text-white">
          <Mic2 className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-base">Synchronized Lyrics</h3>
        </div>
        <div className="flex items-center gap-1">
          {lyrics.lines?.length > 0 || lyrics.plain ? (
            <button
              onClick={handleCopyLyrics}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Copy Lyrics"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          ) : null}

          <button
            onClick={() => setLyricsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Manual Search Bar */}
      <form onSubmit={handleManualSearch} className="pt-3 pb-2 flex gap-1.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search song or artist..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#151a2e] border border-[#252b45] text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
          title="Search"
        >
          Find
        </button>
        {currentItem && (
          <button
            type="button"
            onClick={handleRefreshCurrent}
            className="p-1.5 rounded-xl bg-[#151a2e] border border-[#252b45] text-slate-400 hover:text-white hover:border-purple-500 transition-colors"
            title="Sync with current playing track"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Track Info Badge */}
      <div className="py-2 text-xs border-b border-[#252b45]/50 flex items-center justify-between text-slate-400">
        <span className="truncate font-medium text-slate-200 pr-2">
          {currentItem ? (currentItem.title || currentItem.name) : 'No media playing'}
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {lyrics.synced && (
            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Synced LRC
            </span>
          )}
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
            {lyrics.source}
          </span>
        </div>
      </div>

      {/* Lyrics Body */}
      <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-2 scroll-smooth">
        {lyrics.loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3">
            <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-sm font-medium">Fetching synchronized lyrics...</p>
          </div>
        ) : lyrics.synced && lyrics.lines.length > 0 ? (
          lyrics.lines.map((line, idx) => {
            const isActive = idx === activeIdx;
            return (
              <p
                key={idx}
                ref={isActive ? activeLineRef : null}
                onClick={() => seek(line.time)}
                className={`cursor-pointer transition-all duration-300 font-medium select-none origin-left ${
                  isActive
                    ? 'text-purple-400 font-extrabold text-xl scale-105 shadow-glow'
                    : 'text-slate-400 hover:text-white text-sm'
                }`}
              >
                {line.text}
              </p>
            );
          })
        ) : lyrics.plain ? (
          <div className={`text-slate-300 whitespace-pre-line leading-relaxed font-sans ${fontSize}`}>
            {lyrics.plain}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mx-auto">
              🎤
            </div>
            <h4 className="font-semibold text-slate-300 text-sm">No Lyrics Found</h4>
            <p className="text-xs max-w-xs text-slate-400">
              Use the search bar above to look up lyrics by song title or artist name.
            </p>
            {currentItem && (
              <button
                onClick={handleRefreshCurrent}
                className="text-xs px-3 py-1.5 rounded-xl bg-[#151a2e] border border-[#252b45] text-purple-400 hover:text-white hover:border-purple-500 transition-colors font-medium"
              >
                Retry Auto-Fetch
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-[#252b45] flex items-center justify-between text-[11px] text-slate-500">
        <span>Click any line to seek</span>
        <button
          onClick={() => setFontSize(s => s === 'text-xs' ? 'text-sm' : s === 'text-sm' ? 'text-base' : 'text-xs')}
          className="flex items-center gap-1 hover:text-slate-300 transition-colors"
          title="Toggle font size"
        >
          <Type className="w-3.5 h-3.5" />
          <span>Size</span>
        </button>
      </div>
    </aside>
  );
}
