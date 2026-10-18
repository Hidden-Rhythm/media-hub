import React, { useState } from 'react';
import { X, Tv, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function EpgModal({ isOpen, onClose }) {
  const { showToast } = usePlayer();
  const [url, setUrl] = useState('https://iptv-org.github.io/epg/guides/in/dishtv.in.epg.xml');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleLoad = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/epg/load?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
        showToast(`Loaded ${data.data.channels_count} EPG channels!`, 'success');
      } else {
        setResult({ error: data.error || 'Failed to parse XMLTV feed' });
      }
    } catch {
      setResult({ error: 'Network request error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#0f1420] border border-[#252b45] rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#252b45]">
          <div className="flex items-center gap-2 text-white">
            <Tv className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-base">Load XMLTV EPG Guide</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pre-loaded Status Card */}
        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-purple-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Dish TV India EPG Pre-Loaded</span>
          </div>
          <p className="text-[11px] text-slate-400">
            570+ Indian channels have live rolling 24/7 EPG schedules pre-loaded by default. You can also load any custom XMLTV guide:
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://.../guide.xml"
            className="w-full p-3 rounded-xl bg-[#151a2e] border border-[#252b45] text-xs text-white outline-none focus:border-purple-500 transition-colors"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoad}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : null}
              <span>{loading ? 'Processing Guide...' : 'Parse & Load Guide'}</span>
            </button>

            <button
              onClick={() => {
                setUrl('https://iptv-org.github.io/epg/guides/in/dishtv.in.epg.xml');
                handleLoad();
              }}
              disabled={loading}
              className="px-3 py-2.5 rounded-xl bg-[#151a2e] hover:bg-[#1d2440] border border-[#252b45] text-xs font-semibold text-slate-300 transition-colors"
              title="Reset to default DishTV Guide"
            >
              🇮🇳 DishTV
            </button>
          </div>
        </div>

        {result && (
          <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
            result.error ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
          }`}>
            {result.error ? (
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <div>
              {result.error ? (
                <span>{result.error}</span>
              ) : (
                <span>Successfully loaded guide! <strong>{result.channels_count}</strong> channels and <strong>{result.programmes_count}</strong> programmes active.</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
