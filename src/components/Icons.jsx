import React, { useId } from 'react';

/**
 * Signature Media Hub PRO Brand Logo
 */
export function BrandLogo({ className = "w-8 h-8", animated = true, ...props }) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const bgId = `brandBg_${uid}`;
  const rimId = `brandRim_${uid}`;
  const nebulaId = `brandNebula_${uid}`;
  const ringId = `brandRing_${uid}`;
  const topId = `brandFacetTop_${uid}`;
  const bottomId = `brandFacetBottom_${uid}`;
  const spineId = `brandFacetSpine_${uid}`;
  const sheenId = `brandSheen_${uid}`;

  return (
    <svg 
      viewBox="0 0 512 512" 
      className={`${className} ${animated ? 'transition-transform duration-300 hover:scale-105' : ''}`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      {...props}
    >
      <defs>
        {/* Canvas Gradient */}
        <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#150a2c" />
          <stop offset="42%" stopColor="#0c051a" />
          <stop offset="100%" stopColor="#030107" />
        </linearGradient>

        {/* Ambient Neon Rim Light */}
        <linearGradient id={rimId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="25%" stopColor="#C084FC" />
          <stop offset="65%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* Core Radiant Nebula Glow */}
        <radialGradient id={nebulaId} cx="52%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.45" />
          <stop offset="45%" stopColor="#EC4899" stopOpacity="0.22" />
          <stop offset="80%" stopColor="#06B6D4" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Sonic Pulse Harmonic Rings */}
        <linearGradient id={ringId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.65" />
          <stop offset="50%" stopColor="#F472B6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.65" />
        </linearGradient>

        {/* Facet 1: Upper Luminous Plane */}
        <linearGradient id={topId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#FDE8F3" />
          <stop offset="70%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>

        {/* Facet 2: Bottom Electric Plane */}
        <linearGradient id={bottomId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="45%" stopColor="#38BDF8" />
          <stop offset="85%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>

        {/* Facet 3: Left Foundation Spine */}
        <linearGradient id={spineId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="45%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#6B21A8" />
        </linearGradient>

        {/* Apple-Style Specular Glass Curvature Sheen */}
        <linearGradient id={sheenId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Deep Obsidian Squircle Base */}
      <rect x="18" y="18" width="476" height="476" rx="118" ry="118" fill={`url(#${bgId})`} stroke={`url(#${rimId})`} strokeWidth="12" />

      {/* Core Radiant Nebula Background */}
      <circle cx="266" cy="256" r="210" fill={`url(#${nebulaId})`} />

      {/* Glass Specular Curve */}
      <path d="M 18 136 C 18 71 71 18 136 18 L 376 18 C 441 18 494 71 494 136 L 494 220 C 360 264 152 264 18 220 Z" fill={`url(#${sheenId})`} />

      {/* Concentric Sonic Resonance Waves */}
      <circle cx="266" cy="256" r="176" fill="none" stroke={`url(#${ringId})`} strokeWidth="4.5" opacity="0.45" />
      <circle cx="266" cy="256" r="144" fill="none" stroke={`url(#${ringId})`} strokeWidth="5" opacity="0.7" />

      {/* Center 3D Faceted Diamond Prism Play Mark (Optically Centered at x=266) */}
      <g strokeLinejoin="round" strokeLinecap="round">
        <path d="M 200 144 L 382 256 L 266 256 Z" fill={`url(#${topId})`} />
        <path d="M 200 368 L 382 256 L 266 256 Z" fill={`url(#${bottomId})`} />
        <path d="M 200 144 L 200 368 L 266 256 Z" fill={`url(#${spineId})`} />

        <line x1="202" y1="146" x2="380" y2="256" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.95" />
        <line x1="266" y1="256" x2="380" y2="256" stroke="#FFFFFF" strokeWidth="3" opacity="0.8" />
        <line x1="200" y1="148" x2="200" y2="364" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.55" />
      </g>
    </svg>
  );
}

/**
 * YouTube Icon
 */
export function YoutubeIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/**
 * Twitch Icon
 */
export function TwitchIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
    </svg>
  );
}

/**
 * Kick Icon (Stream platform)
 */
export function KickIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
      <path d="M1.333 0h8v5.333H6.667v2.667H4V5.333H1.333zm0 24h8v-5.333H6.667V16H4v2.667H1.333zm8-10.667h2.667V8h2.667V5.333h2.666V2.667h2.667V0h4v8h-2.667v2.667h-2.667v2.666h2.667V16h2.667v8h-4v-2.667h-2.667v-2.666h-2.666V16H9.333z" />
    </svg>
  );
}

/**
 * Vimeo Icon
 */
export function VimeoIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.6 8.735 3.86 7.404 3.09 7.404c-.179 0-.806.374-1.879 1.124L0 7.084c1.171-1.028 2.327-2.057 3.468-3.085 1.584-1.371 2.766-2.096 3.553-2.175 1.859-.186 3.003.953 3.435 3.418.463 2.64.78 4.28.953 4.918.528 2.457 1.107 3.687 1.738 3.687.489 0 1.205-.783 2.15-2.35.945-1.564 1.455-2.738 1.532-3.523.158-1.347-.384-2.02-1.624-2.02-.58 0-1.218.134-1.916.4l.658-2.146c1.15-.365 2.348-.548 3.593-.548 2.058 0 3.336.985 3.834 2.955.074.293.102.59.102.89z" />
    </svg>
  );
}

/**
 * SoundCloud Icon
 */
export function SoundCloudIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
      <path d="M1.175 12.225c-.051 0-.094.044-.102.098l-.29 2.873.29 2.802c.008.056.051.097.102.097.053 0 .095-.041.103-.097l.325-2.802-.325-2.873c-.008-.054-.05-.098-.103-.098zm1.092-1.332c-.062 0-.113.05-.121.111l-.265 4.205.265 4.103c.008.062.059.11.121.11.065 0 .117-.048.125-.11l.298-4.103-.298-4.205c-.008-.061-.06-.111-.125-.111zm1.196-1.047c-.074 0-.134.058-.142.132l-.242 5.252.242 5.127c.008.073.068.131.142.131.076 0 .138-.058.146-.131l.274-5.127-.274-5.252c-.008-.074-.07-.132-.146-.132zm1.205-.333c-.085 0-.154.068-.163.153l-.22 5.585.22 5.454c.009.085.078.153.163.153.088 0 .157-.068.167-.153l.25-5.454-.25-5.585c-.01-.085-.079-.153-.167-.153zm1.205-.187c-.097 0-.174.077-.184.173l-.2 5.772.2 5.639c.01.096.087.173.184.173.1 0 .179-.077.188-.173l.228-5.639-.228-5.772c-.009-.096-.088-.173-.188-.173zm1.206-.441c-.108 0-.196.086-.206.194l-.178 6.213.178 6.071c.01.107.098.193.206.193.11 0 .199-.086.208-.193l.206-6.071-.206-6.213c-.009-.108-.098-.194-.208-.194zm1.204-.373c-.12 0-.217.096-.227.215l-.158 6.586.158 6.435c.01.119.107.215.227.215.122 0 .22-.096.229-.215l.184-6.435-.184-6.586c-.009-.119-.107-.215-.229-.215zm1.206-.398c-.131 0-.238.105-.249.236l-.137 6.984.137 6.824c.011.13.118.235.249.235.133 0 .24-.105.251-.235l.162-6.824-.162-6.984c-.011-.131-.118-.236-.251-.236zm9.839.815c-.496 0-.965.115-1.385.319-.44-2.91-2.949-5.15-5.986-5.15-.758 0-1.482.14-2.147.394l-.172.066.027.182.264 6.757-.264 6.602-.023.16.162.063c.677.262 1.411.406 2.179.406 1.83 0 3.447-.84 4.516-2.164.444.332.994.53 1.589.53 1.542 0 2.793-1.251 2.793-2.793 0-1.543-1.251-2.794-2.793-2.794z" />
    </svg>
  );
}

/**
 * TikTok Icon
 */
export function TiktokIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

/**
 * Spotify Icon
 */
export function SpotifyIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

/**
 * Reddit Icon
 */
export function RedditIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

/**
 * X / Twitter Icon
 */
export function TwitterXIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/**
 * Rumble Icon
 */
export function RumbleIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
      <path d="M21.92 7.74a4.8 4.8 0 0 0-.83-1.68 4.3 4.3 0 0 0-3.35-1.56H6.26A4.3 4.3 0 0 0 2.91 6.06a4.8 4.8 0 0 0-.83 1.68A5.3 5.3 0 0 0 2 9.42v5.16a5.3 5.3 0 0 0 .08 1.68 4.8 4.8 0 0 0 .83 1.68 4.3 4.3 0 0 0 3.35 1.56h11.48a4.3 4.3 0 0 0 3.35-1.56 4.8 4.8 0 0 0 .83-1.68 5.3 5.3 0 0 0 .08-1.68V9.42a5.3 5.3 0 0 0-.08-1.68zm-11.8 7.42V8.84l5.36 3.16-5.36 3.16z" />
    </svg>
  );
}

/**
 * Official GitHub Icon
 */
export function GithubIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

/**
 * Official Discord Clyde Icon
 */
export function DiscordIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
