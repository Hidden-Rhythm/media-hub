import React from 'react';
import { X, Palette, Check } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function ThemeModal({ isOpen, onClose }) {
  const { theme, setTheme, AVAILABLE_THEMES, showToast } = usePlayer();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[#09090b]/95 border border-white/10 shadow-2xl p-6 relative animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                OLED Display Themes
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  ULTRA
                </span>
              </h2>
              <p className="text-xs text-slate-400">Select your preferred OLED Black UI aesthetic</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {AVAILABLE_THEMES.map((t) => {
            const isSelected = theme === t.id;
            return (
              <div
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  showToast(`Applied ${t.name} Theme 🎨`, 'success');
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 relative group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white/[0.08] border-purple-500 ring-2 ring-purple-500/30 shadow-lg shadow-purple-500/10'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
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

                {/* Color Swatch Preview */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
                  {t.colors.map((c, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: c }}
                      title={c}
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

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px] text-slate-500">
            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-purple-300 font-mono">T</kbd> to cycle anytime
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
