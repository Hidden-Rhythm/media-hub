import React, { useState } from 'react';
import { 
  Radio, 
  Tv, 
  Mic2, 
  BookOpen, 
  Link2, 
  Code2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  Check, 
  Globe2, 
  Music2, 
  Play, 
  Flame, 
  Terminal,
  Heart,
  Cpu,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { BrandLogo, YoutubeIcon, GithubIcon, DiscordIcon } from '../Icons';
import { usePlayer } from '../../context/PlayerContext';

export default function HomeView({ onNavigate }) {
  const { showToast } = usePlayer();
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const handleCopyDiscord = () => {
    navigator.clipboard.writeText('hidden_rhythm');
    setCopiedDiscord(true);
    showToast('Discord username copied: hidden_rhythm 🎮', 'success');
    setTimeout(() => setCopiedDiscord(false), 2500);
  };

  const handleCopyCurl = () => {
    const curlCommand = `curl -X GET "http://127.0.0.1:5000/api/universal?q=lofi&limit=6"`;
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    showToast('cURL command copied to clipboard 🚀', 'success');
    setTimeout(() => setCopiedCurl(false), 2500);
  };

  const features = [
    {
      id: 'radio',
      path: '/radio',
      title: 'Global & Indian Radio',
      subtitle: '45,000+ Stations · AAC/MP3 Live Streams',
      desc: 'Tune into Mirchi Top 20, AIR Vividh Bharati, Bollywood classics, BBC World Service, SomaFM, and thousands of international broadcast streams with live visualizers.',
      icon: Radio,
      badge: '45k+ STATIONS',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      accentColor: 'from-cyan-600/20 to-blue-600/10 hover:border-cyan-500/40',
      btnColor: 'bg-cyan-500 text-black hover:bg-cyan-400',
      actionText: 'Launch Radio'
    },
    {
      id: 'tv',
      path: '/tv',
      title: 'Live World Television',
      subtitle: 'Zero-Stutter HLS · Global FAST Networks',
      desc: 'Watch NASA TV, 9XM Bollywood, Sky News, France 24, Bloomberg, and world broadcast channels with intelligent HLS buffer synchronization and low latency playback.',
      icon: Tv,
      badge: 'LIVE HLS',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      accentColor: 'from-pink-600/20 to-purple-600/10 hover:border-pink-500/40',
      btnColor: 'bg-pink-600 text-white hover:bg-pink-500',
      actionText: 'Watch Live TV'
    },
    {
      id: 'youtube',
      path: '/youtube',
      title: 'YouTube 4K & Music',
      subtitle: 'Zero Ads · Background Audio & Video',
      desc: 'Explore trending videos, live events, music releases, and 4K cinema without interruptions or trackers. Supports picture-in-picture and instant audio-only mode.',
      icon: YoutubeIcon,
      badge: '4K ULTRA HD',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
      accentColor: 'from-red-600/20 to-orange-600/10 hover:border-red-500/40',
      btnColor: 'bg-red-600 text-white hover:bg-red-500',
      actionText: 'Browse YouTube'
    },
    {
      id: 'podcasts',
      path: '/podcasts',
      title: 'Indian & Global Podcasts',
      subtitle: 'Thousands of Shows · RSS Episode Streaming',
      desc: 'Discover The Ranveer Show, Finshots, Cyrus Says, Huberman Lab, Joe Rogan Experience, and global charts with chapter navigation and playback speed controls.',
      icon: Mic2,
      badge: 'PODCASTS',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      accentColor: 'from-purple-600/20 to-indigo-600/10 hover:border-purple-500/40',
      btnColor: 'bg-purple-600 text-white hover:bg-purple-500',
      actionText: 'Listen to Podcasts'
    },
    {
      id: 'audiobooks',
      path: '/audiobooks',
      title: 'Classic Audiobooks',
      subtitle: 'Indian Epics & Global Literature',
      desc: 'Immerse yourself in the Mahabharata, Ramayana, Panchatantra, Sherlock Holmes, Jane Eyre, and timeless classics with organized chapter explorers and sleep timers.',
      icon: BookOpen,
      badge: 'LIBRIVOX & ARCHIVE',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      accentColor: 'from-amber-600/20 to-orange-600/10 hover:border-amber-500/40',
      btnColor: 'bg-amber-500 text-black hover:bg-amber-400',
      actionText: 'Explore Audiobooks'
    },
    {
      id: 'universal',
      path: '/universal',
      title: 'Universal URL Streamer',
      subtitle: '1,700+ Video & Audio Sites Supported',
      desc: 'Directly extract and stream media links from Twitch, Kick, Vimeo, SoundCloud, TikTok, Spotify previews, Reddit, X/Twitter, Rumble, and direct MP4/M3U8 URLs.',
      icon: Link2,
      badge: '1,700+ SITES',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      accentColor: 'from-emerald-600/20 to-teal-600/10 hover:border-emerald-500/40',
      btnColor: 'bg-emerald-500 text-black hover:bg-emerald-400',
      actionText: 'Extract Any Stream'
    }
  ];

  const coreHighlights = [
    { title: 'Zero Advertisements', desc: 'Continuous ad-free playback without trackers, analytics, or banners.', icon: ShieldCheck },
    { title: 'Synced Lyrics Engine', desc: 'Real-time karaoke-style lyrics synced to whatever track is playing.', icon: Music2 },
    { title: 'Pure OLED Dark Mode', desc: 'Tailored for true-black displays with customizable color accents.', icon: Zap },
    { title: 'Zero Database Overhead', desc: 'Lightweight stateless architecture powered by open public APIs & RSS.', icon: Cpu },
  ];

  return (
    <div className="space-y-12 animate-fadeIn pb-20 max-w-7xl mx-auto">
      {/* 1. Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-[#111728]/80 via-[#0a0d18]/90 to-black p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-600/15 rounded-full blur-[100px] pointer-events-none -z-0" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-purple-400" />
            <span>Next-Generation Global Media Center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            All Your World Entertainment. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
              One Elegant OLED Platform.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Media Hub is an all-in-one open-source media station combining 
            <span className="text-cyan-300 font-semibold"> 45,000+ live radio stations</span>, 
            <span className="text-pink-300 font-semibold"> live TV broadcast channels</span>, 
            <span className="text-red-400 font-semibold"> YouTube 4K</span>, 
            <span className="text-purple-300 font-semibold"> Indian & global podcasts</span>, 
            <span className="text-amber-300 font-semibold"> classic audiobooks</span>, and 
            <span className="text-emerald-300 font-semibold"> 1,700+ streaming sites</span> — completely free with zero ads and zero database requirements.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('radio', '/radio')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all scale-[1.02] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Listening Now</span>
            </button>

            <button
              onClick={() => onNavigate('api', '/api-hub')}
              className="px-5 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-yellow-400" />
              <span>Universal API Docs</span>
            </button>

            <a
              href="https://github.com/Hidden-Rhythm/media-hub"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Platform Feature Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Explore Media Destinations</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose any media destination below to jump directly into the full dedicated player view.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className={`group p-6 rounded-3xl bg-gradient-to-br ${feat.accentColor} bg-[#0c101d]/90 border border-white/[0.08] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${feat.badgeColor} font-mono uppercase tracking-wider`}>
                      {feat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      {feat.title}
                    </h3>
                    <div className="text-xs font-semibold text-slate-400 mt-0.5">
                      {feat.subtitle}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">
                    Route: <span className="text-slate-300">{feat.path}</span>
                  </span>
                  <button
                    onClick={() => onNavigate(feat.id, feat.path)}
                    className={`px-3.5 py-1.5 rounded-xl ${feat.btnColor} font-bold text-xs flex items-center gap-1.5 transition-all shadow-md group-hover:scale-105 cursor-pointer`}
                  >
                    <span>{feat.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Universal API Spotlight Section */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#13162b] via-[#0d1021] to-[#120f26] border border-yellow-500/20 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-[11px] font-bold uppercase tracking-wider">
              <Code2 className="w-3.5 h-3.5 text-yellow-400" />
              <span>Universal REST API Available</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              Integrate All Media Sources Into Any App
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every source built into Media Hub is exposed via our modular REST suite and single Universal Aggregator endpoint (<code className="text-yellow-300 bg-black/40 px-1.5 py-0.5 rounded font-mono">/api/universal</code>). Easily build mobile apps, bots, smart speaker skills, or custom frontends.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => onNavigate('api', '/api-hub')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-yellow-500/20 hover:opacity-95 transition-all cursor-pointer"
            >
              <span>Open Interactive API Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* cURL Interactive Preview */}
        <div className="p-4 rounded-2xl bg-black/80 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs text-slate-300">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
            <Terminal className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span className="text-emerald-400">$</span>
            <span className="text-slate-100 whitespace-nowrap">curl -X GET "http://127.0.0.1:5000/api/universal?q=lofi&limit=6"</span>
          </div>
          <button
            onClick={handleCopyCurl}
            className="self-end sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-colors flex-shrink-0 cursor-pointer text-[11px]"
          >
            {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
          </button>
        </div>
      </div>

      {/* 4. Core Architecture & Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coreHighlights.map((hl, idx) => {
          const Icon = hl.icon;
          return (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0 mt-0.5">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">{hl.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{hl.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Contact, Creator & Community Section */}
      <div className="p-8 rounded-3xl bg-[#0c101d]/90 border border-white/[0.08] shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <BrandLogo className="w-6 h-6" />
              <h3 className="text-lg font-black text-white">Media Hub Project & Community</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              Created & engineered by <strong className="text-slate-200">Hidden-Rhythm</strong>. Developed with zero profit motive, no tracking cookies, and open APIs. Feedback, station requests, and pull requests are warmly welcomed!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* GitHub Card */}
            <a
              href="https://github.com/Hidden-Rhythm/media-hub"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/20 text-white font-semibold text-xs transition-all"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub: Hidden-Rhythm/media-hub</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {/* Discord Copy Button */}
            <button
              onClick={handleCopyDiscord}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#5865F2]/15 hover:bg-[#5865F2]/25 border border-[#5865F2]/30 text-[#9da6ff] hover:text-white font-semibold text-xs transition-all cursor-pointer"
            >
              <DiscordIcon className="w-4 h-4 text-[#5865F2]" />
              <span>Discord: hidden_rhythm</span>
              {copiedDiscord ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#5865F2]" />
              )}
            </button>
          </div>
        </div>

        {/* Footer meta info */}
        <div className="pt-4 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
          <span>Global Media Hub · Build 2026.10 · Pure OLED Edition</span>
          <span>Crafted with ❤️ for global listeners & viewers</span>
        </div>
      </div>
    </div>
  );
}
