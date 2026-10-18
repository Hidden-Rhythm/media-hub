import React from 'react';
import { X, Command, Sparkles } from 'lucide-react';

export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause playback' },
    { key: 'M', desc: 'Mute / Unmute audio' },
    { key: 'F', desc: 'Open / Close Video Player Overlay' },
    { key: 'P', desc: 'Picture-in-Picture window' },
    { key: 'L', desc: 'Toggle Synchronized LRC Lyrics' },
    { key: 'Q', desc: 'Toggle Up Next Queue drawer' },
    { key: 'T', desc: 'Cycle OLED UI Themes 🎨' },
    { key: '← / →', desc: 'Seek backwards / forwards 5s' },
    { key: '↑ / ↓', desc: 'Adjust volume up / down 5%' },
    { key: 'Esc', desc: 'Minimize to floating mini-player or close modal' },
    { key: '?', desc: 'Open this Keyboard Shortcuts Guide' },
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[#09090b]/95 border border-white/10 shadow-2xl p-6 relative animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Command className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Keyboard Shortcuts
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  PRO
                </span>
              </h2>
              <p className="text-xs text-slate-400">Control Media Hub with lightning speed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-1">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-purple-500/30 hover:bg-white/[0.06] transition-all"
            >
              <span className="text-xs text-slate-300">{s.desc}</span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-bold text-purple-300 bg-white/10 border border-white/15 rounded-lg shadow-inner">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-[11px] text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built by Hidden-Rhythm · Discord: hidden_rhythm</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
