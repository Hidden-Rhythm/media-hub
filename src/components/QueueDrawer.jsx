import React from 'react';
import { X, Trash2, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function QueueDrawer() {
  const { queueOpen, setQueueOpen, queue, queueIndex, play } = usePlayer();

  if (!queueOpen) return null;

  return (
    <aside className="fixed top-0 right-0 bottom-[88px] w-88 bg-[#0f1420]/95 backdrop-blur-3xl border-l border-[#252b45] z-30 flex flex-col p-6 shadow-2xl animate-slideLeft">
      <div className="flex items-center justify-between pb-4 border-b border-[#252b45]">
        <div className="flex items-center gap-2 text-white">
          <Music className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-base">Playback Queue</h3>
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-mono">
            {queue.length}
          </span>
        </div>
        <button
          onClick={() => setQueueOpen(false)}
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-2 pr-1">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
            <p className="text-sm">Queue is empty</p>
          </div>
        ) : (
          queue.map((item, idx) => {
            const isCurrent = idx === queueIndex;
            return (
              <div
                key={idx}
                onClick={() => play(item)}
                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-purple-600/20 border border-purple-500/40 text-white font-semibold'
                    : 'hover:bg-[#1d2440]/60 text-slate-300'
                }`}
              >
                <div className="w-8 text-center text-xs text-slate-500 font-mono">
                  {isCurrent ? (
                    <div className="flex items-end justify-center gap-0.5 h-3">
                      <div className="w-0.5 bg-purple-400 anim-bar-1" />
                      <div className="w-0.5 bg-purple-400 anim-bar-2" />
                      <div className="w-0.5 bg-purple-400 anim-bar-3" />
                    </div>
                  ) : (
                    idx + 1
                  )}
                </div>

                <div className="flex-1 overflow-hidden min-w-0">
                  <div className="text-xs truncate">{item.title || item.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{item.uploader || item.artist || item.type}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
