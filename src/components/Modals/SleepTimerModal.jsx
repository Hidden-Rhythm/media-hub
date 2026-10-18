import React from 'react';
import { X, Clock, Check } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function SleepTimerModal({ isOpen, onClose }) {
  const { setSleepTimer, sleepRemaining } = usePlayer();

  if (!isOpen) return null;

  const options = [
    { label: '5 Minutes', mins: 5 },
    { label: '15 Minutes', mins: 15 },
    { label: '30 Minutes', mins: 30 },
    { label: '45 Minutes', mins: 45 },
    { label: '60 Minutes', mins: 60 },
    { label: 'Turn Off', mins: 0, danger: true },
  ];

  const handleSelect = (mins) => {
    setSleepTimer(mins);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-[#0f1420] border border-[#252b45] rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#252b45]">
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-base">Sleep Timer</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Playback will gently fade out and stop when the timer expires.
        </p>

        {sleepRemaining !== null && (
          <div className="text-center py-2 px-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            Active: {Math.floor(sleepRemaining / 60)}m {sleepRemaining % 60}s remaining
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          {options.map((opt) => (
            <button
              key={opt.mins}
              onClick={() => handleSelect(opt.mins)}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                opt.danger 
                  ? 'border-red-500/30 text-red-400 hover:bg-red-500/20' 
                  : 'bg-[#151a2e] border-[#252b45] text-slate-200 hover:border-purple-500 hover:bg-[#1d2440]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
