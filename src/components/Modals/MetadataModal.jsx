import React, { useState, useEffect } from 'react';
import { X, Info, Star, Calendar, Eye, ThumbsUp, Sparkles } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function MetadataModal({ url, isOpen, onClose }) {
  const { tmdbKey } = usePlayer();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !url) return;
    setLoading(true);
    setData(null);

    const tmdbParam = tmdbKey ? `&tmdb_key=${encodeURIComponent(tmdbKey)}` : '';
    fetch(`/api/metadata?url=${encodeURIComponent(url)}${tmdbParam}`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          setData(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen, url, tmdbKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0f1420] border border-[#252b45] rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#252b45]">
          <div className="flex items-center gap-2 text-white">
            <Info className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-base">Media Details</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-sm">Retrieving media metadata...</p>
          </div>
        ) : data ? (
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="text-base font-bold text-white">{data.title}</h4>
              <p className="text-slate-400 mt-0.5">{data.uploader || data.channel || 'Unknown Creator'}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-[#151a2e] border border-[#252b45] text-center">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Views</span>
                <span className="text-white font-semibold">{data.views?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#151a2e] border border-[#252b45] text-center">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Likes</span>
                <span className="text-white font-semibold">{data.likes?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#151a2e] border border-[#252b45] text-center">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Duration</span>
                <span className="text-white font-semibold">
                  {data.duration ? `${Math.floor(data.duration / 60)}m ${data.duration % 60}s` : 'Live'}
                </span>
              </div>
            </div>

            {/* Optional TMDB Enrichment Card */}
            {data.tmdb && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/40 flex gap-3">
                {data.tmdb.poster && (
                  <img 
                    src={data.tmdb.poster} 
                    alt="TMDB Poster" 
                    className="w-16 h-24 object-cover rounded-lg shadow-md"
                  />
                )}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{data.tmdb.title}</span>
                    <span className="text-yellow-400 font-bold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-current" /> {data.tmdb.rating || 'N/A'}/10
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] line-clamp-3 leading-relaxed">
                    {data.tmdb.overview}
                  </p>
                </div>
              </div>
            )}

            <div>
              <span className="font-bold text-slate-300 block mb-1">Description</span>
              <p className="p-3 rounded-xl bg-[#151a2e] border border-[#252b45] text-slate-300 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-line">
                {data.description || 'No description available.'}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center py-6 text-slate-500">Could not parse metadata for this URL.</p>
        )}
      </div>
    </div>
  );
}
