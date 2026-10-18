import React from 'react';
import { X, Play, Music } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function ChaptersModal({ title, items, subtitle, artwork, isOpen, onClose }) {
  const { play } = usePlayer();

  if (!isOpen) return null;

  const handlePlayTrack = (track) => {
    play({
      type: 'audiobooks',
      name: track.title,
      subtitle: subtitle || 'Audio Track',
      url: track.url,
      artwork: artwork,
      is_video: false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0f1420] border border-[#252b45] rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-[#252b45]">
          <div className="flex items-center gap-2 text-white overflow-hidden">
            <Music className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <h3 className="font-bold text-base truncate">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {(!items || items.length === 0) ? (
            <p className="text-center py-8 text-slate-500 text-xs">No playable tracks available.</p>
          ) : (
            items.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handlePlayTrack(item)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#151a2e] hover:bg-[#1d2440] border border-[#252b45] hover:border-purple-500/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="w-6 text-center text-xs font-mono text-slate-500 group-hover:text-purple-400">
                    {idx + 1}
                  </span>
                  <div className="overflow-hidden">
                    <div className="text-xs font-medium text-white truncate">{item.title}</div>
                    {item.duration && <div className="text-[10px] text-slate-400">{item.duration}</div>}
                  </div>
                </div>

                <button className="w-7 h-7 rounded-full bg-purple-600/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-all flex-shrink-0">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
