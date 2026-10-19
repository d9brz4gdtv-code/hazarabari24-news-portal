import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'masthead' | 'compact' | 'footer' | 'icon';
  onClick?: () => void;
  logoUrl?: string;
}

/**
 * Official Brand Logo for হাজরাবাড়ী ২৪.কম
 * Renders the authentic high-resolution emblem and brand logo as requested,
 * with fallbacks and responsive scaling across mobile, tablet, and desktop.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'masthead',
  onClick,
  logoUrl,
}) => {
  const [imgError, setImgError] = useState(false);
  const activeLogoUrl = logoUrl || '/images/official_logo.png';
  const iconUrl = '/images/official_icon.png';

  // Standalone Icon Variant
  if (variant === 'icon') {
    if (imgError) {
      return (
        <svg
          viewBox="0 0 240 260"
          className={`w-9 h-9 shrink-0 ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={onClick}
        >
          <defs>
            <radialGradient id="iconGlobeGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="45%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>
            <linearGradient id="iconRedSwoosh" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="iconNavySwoosh" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0b1b32" />
            </linearGradient>
          </defs>
          <path d="M 125,25 C 65,22 18,72 22,145 C 24,180 45,215 75,235 C 50,210 38,175 40,140 C 42,85 85,45 135,42 C 160,40 185,48 202,62 C 182,40 155,26 125,25 Z" fill="url(#iconRedSwoosh)" />
          <path d="M 40,140 C 35,178 52,218 85,242 C 120,266 170,264 205,240 C 165,255 118,245 90,220 C 65,198 52,168 56,135 Z" fill="url(#iconNavySwoosh)" />
          <circle cx="125" cy="140" r="62" fill="url(#iconGlobeGrad)" />
        </svg>
      );
    }
    return (
      <img
        src={iconUrl}
        alt="হাজরাবাড়ী ২৪ প্রতীক"
        className={`object-contain ${className}`}
        onClick={onClick}
        onError={() => setImgError(true)}
      />
    );
  }

  // Footer dark variant
  if (variant === 'footer') {
    return (
      <div className={`inline-flex flex-col select-none cursor-pointer group ${className}`} onClick={onClick}>
        <div className="bg-white/95 hover:bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm transition-all inline-flex items-center justify-center self-start border border-slate-700/60">
          <img
            src={activeLogoUrl}
            alt="হাজরাবাড়ী ২৪.কম"
            className="h-9 sm:h-11 w-auto max-w-[220px] sm:max-w-none object-contain"
            loading="lazy"
          />
        </div>
        <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 font-sans tracking-wide">
          <span className="uppercase font-bold tracking-widest text-slate-300">ONLINE NEWS PORTAL</span>
          <span className="text-red-500">♦</span>
          <span className="font-serif-bn italic text-slate-300">সত্যের পথে, সংবাদের সাথে</span>
        </div>
      </div>
    );
  }

  // Compact variant (Header / Topbar / Sticky)
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 select-none cursor-pointer group ${className}`} onClick={onClick}>
        <img
          src={iconUrl}
          alt="হাজরাবাড়ী ২৪ প্রতীক"
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 transition-transform group-hover:scale-105"
        />
        <div className="flex items-baseline font-serif-bn font-black text-xl sm:text-2xl tracking-tight leading-none">
          <span className="text-slate-950">হাজরাবাড়ী</span>
          <span className="text-red-600 font-extrabold ml-1 mr-0.5">২৪</span>
          <span className="text-slate-950">.কম</span>
        </div>
      </div>
    );
  }

  // Default Masthead Variant (Authentic Official Grand Brand Logo matching user image)
  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <img
        src={activeLogoUrl}
        alt="হাজরাবাড়ী ২৪.কম - অনলাইন নিউজ পোর্টাল"
        className="h-12 xs:h-14 sm:h-18 md:h-22 lg:h-24 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-102 drop-shadow-2xs"
        loading="eager"
      />
    </div>
  );
};
