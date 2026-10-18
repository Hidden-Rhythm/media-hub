import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, Info, X, ShieldAlert } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  message = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  badge,
  onConfirm,
  onClose
}) {
  // Listen for Escape and Enter keys
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onClose]);

  if (!isOpen) return null;

  const isDanger = type === 'danger';
  const isWarning = type === 'warning';

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[70] flex items-center justify-center p-4 select-none animate-fadeIn">
      {/* Background Dismiss click */}
      <div 
        className="fixed inset-0 z-0" 
        onClick={onClose} 
      />

      <div className="w-full max-w-md rounded-3xl bg-[#09090d]/98 border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.85)] p-6 relative overflow-hidden z-10 animate-scaleUp">
        {/* Glow ambient background highlight */}
        <div 
          className={`absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-25 ${
            isDanger ? 'bg-red-600' : isWarning ? 'bg-amber-500' : 'bg-purple-600'
          }`}
        />

        {/* Header / Icon row */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div 
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${
                isDanger
                  ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-red-500/20'
                  : isWarning
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-amber-500/20'
                  : 'bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-purple-500/20'
              }`}
            >
              {isDanger ? (
                <Trash2 className="w-6 h-6 stroke-[2.2]" />
              ) : isWarning ? (
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              ) : (
                <Info className="w-6 h-6 stroke-[2.2]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-tight">
                  {title}
                </h3>
              </div>
              {badge && (
                <span className={`inline-block text-[9px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded mt-1 border ${
                  isDanger
                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                    : isWarning
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                }`}>
                  {badge}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Cancel (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <div className="space-y-3 mb-6 relative z-10">
          <p className="text-xs text-slate-300 leading-relaxed">
            {message}
          </p>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5 text-[11px] text-slate-400">
            <ShieldAlert className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>This action takes effect immediately on this client.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white font-semibold text-xs transition-all active:scale-[0.98]"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${
              isDanger
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:opacity-95 shadow-red-600/30'
                : isWarning
                ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-500 hover:opacity-95 shadow-amber-600/30'
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-500 hover:opacity-95 shadow-purple-600/30'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
