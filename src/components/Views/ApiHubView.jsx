import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  ExternalLink, 
  Sparkles, 
  Cpu, 
  Globe, 
  Radio, 
  Tv, 
  Mic2, 
  BookOpen, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { YoutubeIcon } from '../Icons';
import { usePlayer } from '../../context/PlayerContext';

export default function ApiHubView() {
  const { showToast } = usePlayer();
  const [query, setQuery] = useState('lofi beats');
  const [country, setCountry] = useState('GLOBAL');
  const [limit, setLimit] = useState(5);
  const [sources, setSources] = useState({
    youtube: true,
    radio: true,
    tv: true,
    podcasts: true,
    audiobooks: true
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [copiedTab, setCopiedTab] = useState(null);
  const [activeLang, setActiveLang] = useState('curl'); // 'curl' | 'js' | 'python' | 'dart'

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000';

  const selectedSourcesParam = Object.entries(sources)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key)
    .join(',');

  const requestUrl = `${baseUrl}/api/universal?q=${encodeURIComponent(query)}&country=${country}&limit=${limit}&sources=${selectedSourcesParam || 'all'}`;

  const executeApi = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const res = await fetch(requestUrl);
      const data = await res.json();
      setResponseTime(Math.round(performance.now() - start));
      setResponse(data);
      showToast('Live API query executed successfully!', 'success');
    } catch (err) {
      setResponseTime(Math.round(performance.now() - start));
      setResponse({ error: 'Failed to execute query', details: err.message });
      showToast('API request failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeApi();
  }, []);

  const copyToClipboard = (text, tabName) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabName);
    showToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const getCodeSnippet = (lang) => {
    switch (lang) {
      case 'curl':
        return `curl -X GET "${requestUrl}" \\
  -H "Accept: application/json"`;
      case 'js':
        return `// JavaScript / Node.js / React
const response = await fetch("${requestUrl}");
const data = await response.json();

console.log("Found:", data.counts.total, "results across all sources");
console.log("Unified Feed:", data.unified);`;
      case 'python':
        return `# Python (requests)
import requests

url = "${requestUrl}"
response = requests.get(url)
data = response.json()

print(f"Total results: {data['counts']['total']}")
for item in data.get("unified", []):
    print(f"[{item['type'].upper()}] {item['title']} -> {item['url']}")`;
      case 'dart':
        return `// Dart / Flutter
import 'dart:convert';
import 'package:http/http.dart' as http;

final url = Uri.parse('${requestUrl}');
final response = await http.get(url);

if (response.statusCode == 200) {
  final data = jsonDecode(response.body);
  print('Total items: \${data["counts"]["total"]}');
}`;
      default:
        return '';
    }
  };

  const endpointsList = [
    {
      name: 'Universal Search & Aggregator',
      path: '/api/universal',
      method: 'GET',
      badge: 'ALL-IN-ONE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      desc: 'Single unified call searching YouTube, Radio, TV, Podcasts, Audiobooks, and Lyrics concurrently with a normalized unified stream.',
      params: 'q, country, sources, limit, url'
    },
    {
      name: 'YouTube Unified API',
      path: '/api/youtube',
      method: 'GET',
      badge: 'YOUTUBE',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      desc: 'Search YouTube, fetch trending categories, discover live streams, or extract direct playable streams via yt-dlp.',
      params: 'q, type (search|trending|live), sort (latest|popular|relevance), limit, url'
    },
    {
      name: 'Live Radio Broadcasts API',
      path: '/api/radio',
      method: 'GET',
      badge: '45K+ STATIONS',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      desc: 'Access 45,000+ live stations with dedicated Indian FM/AIR Vividh Bharati and Global curated high-bitrate feeds.',
      params: 'name / q, country (IN|GLOBAL|US|...), tag, limit'
    },
    {
      name: 'Live TV & IPTV API',
      path: '/api/tv',
      method: 'GET',
      badge: 'LIVE HLS',
      badgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      desc: 'Verified 24/7 live linear television channels for US, UK, India, Canada, Germany, France, Japan, Australia with active EPG.',
      params: 'country (IN|US|UK|CA|DE|FR|IT|ES|JP|AU), category, q'
    },
    {
      name: 'Podcasts & Episodes API',
      path: '/api/podcasts',
      method: 'GET',
      badge: 'RSS / ITUNES',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      desc: 'Direct iTunes podcast directory queries and high-speed XML/RSS feed parser with track audio extraction.',
      params: 'q, country (IN|GLOBAL|US), feed (for episode lists), limit'
    },
    {
      name: 'Audiobooks & Classics API',
      path: '/api/audiobooks',
      method: 'GET',
      badge: 'PUBLIC DOMAIN',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      desc: 'Complete LibriVox and Internet Archive audiobooks collection with chapter metadata and streaming MP3 links.',
      params: 'q, region (indian|global), cat, id (for chapters), limit'
    },
    {
      name: 'High-Performance Stream Proxy',
      path: '/api/stream',
      method: 'GET',
      badge: 'HLS / PROXY',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      desc: 'Connection-pooled, CORS-bypassing, auto-redirecting HLS manifest rewriter (/api/stream/hls) and binary stream chunker (/api/stream/proxy).',
      params: 'url, type (hls|proxy)'
    },
    {
      name: 'Lyrics & Rich Metadata API',
      path: '/api/lyrics',
      method: 'GET',
      badge: 'SYNCED LRC',
      badgeColor: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
      desc: 'Synchronized karaoke LRC and plain text lyrics fetched instantly by song title and artist.',
      params: 'title, artist, q'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* 1. Header Banner */}
      <div className="relative glass-card rounded-3xl p-6 md:p-8 border border-white/10 overflow-hidden bg-gradient-to-br from-[#0c0f1d] via-[#05070d] to-black">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Universal Media API
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-slate-300 border border-white/10">
              Open & Free · No API Key Required
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Single Universal API For All Media
          </h2>
          <p className="text-sm md:text-base text-slate-400 max-w-3xl leading-relaxed">
            Integrate all media sources — YouTube, 45,000+ Live Radio stations, 24/7 Live TV channels, Podcasts, Audiobooks, and Lyrics — into your mobile apps, websites, Discord bots, or personal scripts with a single unified REST endpoint.
          </p>

          {/* Quick Stats Badges */}
          <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Base URL:</span>
              <code className="text-purple-300 font-bold">{baseUrl}/api</code>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>CORS: <span className="text-emerald-400 font-bold">Enabled (*)</span></span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Format: <span className="text-amber-400 font-bold">Standard JSON & HLS</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Live Interactive API Console */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 bg-[#070913]/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-black text-white">Interactive API Sandbox</h3>
          </div>
          {responseTime && (
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                HTTP 200 OK
              </span>
              <span className="text-slate-400 font-mono">
                Speed: <span className="text-white font-bold">{responseTime}ms</span>
              </span>
            </div>
          )}
        </div>

        {/* Console Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Query Input */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Search Keyword (q)</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. lofi, arijit singh, sherlock..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#0d1020] border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Country Selector */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Region (country)</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0d1020] border border-white/10 text-xs text-white outline-none cursor-pointer focus:border-purple-500 transition-colors"
            >
              <option value="IN">🇮🇳 India (IN)</option>
              <option value="GLOBAL">🌍 Global (Worldwide)</option>
              <option value="US">🇺🇸 United States (US)</option>
              <option value="UK">🇬🇧 United Kingdom (UK)</option>
              <option value="CA">🇨🇦 Canada (CA)</option>
              <option value="DE">🇩🇪 Germany (DE)</option>
              <option value="FR">🇫🇷 France (FR)</option>
              <option value="JP">🇯🇵 Japan (JP)</option>
              <option value="AU">🇦🇺 Australia (AU)</option>
            </select>
          </div>

          {/* Limit */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Limit / Source</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0d1020] border border-white/10 text-xs text-white outline-none cursor-pointer focus:border-purple-500 transition-colors"
            >
              <option value={3}>3 items</option>
              <option value={5}>5 items</option>
              <option value={10}>10 items</option>
              <option value={15}>15 items</option>
              <option value={20}>20 items</option>
            </select>
          </div>

          {/* Execute Button */}
          <div className="md:col-span-2 flex items-end">
            <button
              onClick={executeApi}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>{loading ? 'Running...' : 'Execute'}</span>
            </button>
          </div>
        </div>

        {/* Source Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 mr-2">Filter Sources:</span>
          {Object.keys(sources).map((src) => {
            const isChecked = sources[src];
            return (
              <button
                key={src}
                onClick={() => setSources(prev => ({ ...prev, [src]: !prev[src] }))}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all border ${
                  isChecked
                    ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-500/20'
                    : 'bg-white/[0.02] text-slate-500 border-white/5 hover:text-slate-300'
                }`}
              >
                {isChecked ? '✓ ' : '+ '}{src}
              </button>
            );
          })}
        </div>

        {/* URL Preview */}
        <div className="flex items-center gap-2 bg-[#090b16] px-4 py-2.5 rounded-xl border border-white/5 font-mono text-xs overflow-x-auto">
          <span className="text-emerald-400 font-bold shrink-0">GET</span>
          <span className="text-slate-300 truncate select-all">{requestUrl}</span>
          <button
            onClick={() => copyToClipboard(requestUrl, 'url')}
            className="ml-auto text-slate-400 hover:text-white p-1 rounded"
            title="Copy URL"
          >
            {copiedTab === 'url' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Live Response & Result Counts */}
        {response && (
          <div className="space-y-3 pt-2">
            {response.counts && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-white">Aggregated Results:</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Total: {response.counts.total}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/30">
                  YouTube: {response.counts.youtube}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Radio: {response.counts.radio}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Live TV: {response.counts.tv}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Podcasts: {response.counts.podcasts}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Audiobooks: {response.counts.audiobooks}
                </span>
              </div>
            )}

            {/* Code Output Box */}
            <div className="relative rounded-2xl bg-[#04060c] border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/5 text-xs text-slate-400">
                <span className="font-mono">JSON Response Payload</span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(response, null, 2), 'json')}
                  className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold"
                >
                  {copiedTab === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'json' ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-emerald-300/90 max-h-96 overflow-y-auto leading-relaxed select-all">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* 3. Code Integration Snippets */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-4 bg-[#070913]/90">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-black text-white">1-Click Code Integration Snippets</h3>
          </div>
          <div className="flex items-center bg-[#0d1020] p-1 rounded-xl border border-white/10">
            {['curl', 'js', 'python', 'dart'].map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                  activeLang === lang
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl bg-[#04060c] border border-white/10 p-4">
          <button
            onClick={() => copyToClipboard(getCodeSnippet(activeLang), 'snippet')}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Copy Code"
          >
            {copiedTab === 'snippet' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <pre className="text-xs font-mono text-slate-200 overflow-x-auto pr-12 leading-relaxed">
            {getCodeSnippet(activeLang)}
          </pre>
        </div>
      </div>

      {/* 4. Complete REST Endpoints Directory */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-pink-400" />
          <h3 className="text-lg font-black text-white">Complete REST API Endpoints Directory</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {endpointsList.map((ep) => (
            <div
              key={ep.path}
              className="glass-card rounded-2xl p-5 border border-white/5 hover:border-white/15 transition-all space-y-3 bg-[#080b18]/80"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    {ep.method}
                  </span>
                  <span className="text-white font-bold">{ep.path}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${ep.badgeColor}`}>
                  {ep.badge}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white">{ep.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{ep.desc}</p>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Params: <span className="text-slate-400">{ep.params}</span></span>
                <a
                  href={`${baseUrl}${ep.path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                >
                  <span>Open Raw</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
