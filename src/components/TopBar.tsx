import React, { useEffect, useState } from 'react';
import { Clock, CloudSun, Facebook, Globe, Twitter, Youtube } from 'lucide-react';
import { getDhakaFormattedDate } from '../utils/dateUtils';

interface TopBarProps {
  fontSize: 'sm' | 'md' | 'lg';
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  onNavigateCategory: (cat: any) => void;
  onOpenEpaper: () => void;
  onOpenAdmin?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  fontSize,
  setFontSize,
  onOpenEpaper,
  onOpenAdmin,
}) => {
  const [dhakaInfo, setDhakaInfo] = useState(getDhakaFormattedDate());

  useEffect(() => {
    // Update live clock every 1 second for real-time live clock
    const timer = setInterval(() => {
      setDhakaInfo(getDhakaFormattedDate());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#0B132B] text-slate-300 text-xs border-b border-[#1A264F]/80 antialiased font-sans select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2">
        {/* MOBILE VIEW (< 640px) */}
        <div className="block sm:hidden space-y-1.5">
          {/* Top Row: Date & Live Time with Weather */}
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="font-bold text-white tracking-tight">
              {dhakaInfo.dateStr}
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-[#14234b] px-2 py-0.5 rounded text-[11px] font-medium text-amber-300 border border-sky-400/30">
                <Clock className="w-3 h-3 text-emerald-400 animate-pulse shrink-0" />
                <span>{dhakaInfo.timeWithSecondsStr || dhakaInfo.timeStr}</span>
              </span>
              <span className="text-amber-400 font-bold flex items-center gap-0.5">
                <CloudSun className="w-3 h-3 shrink-0" />
                <span>২৮°সে.</span>
              </span>
            </div>
          </div>

          {/* Bottom Row: Font size, E-Paper, Admin & Social */}
          <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800/80">
            {/* Font Resizer */}
            <div className="flex items-center gap-0.5 bg-[#141F3D] rounded border border-slate-700/70 px-1.5 py-0.5">
              <span className="text-[10px] text-slate-400 mr-0.5">হরফ:</span>
              <button
                type="button"
                onClick={() => setFontSize('sm')}
                className={`px-1 py-0.2 rounded text-[11px] ${
                  fontSize === 'sm' ? 'bg-red-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                ক-
              </button>
              <button
                type="button"
                onClick={() => setFontSize('md')}
                className={`px-1.5 py-0.2 rounded text-[11px] ${
                  fontSize === 'md' ? 'bg-red-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                ক
              </button>
              <button
                type="button"
                onClick={() => setFontSize('lg')}
                className={`px-1 py-0.2 rounded text-[11px] ${
                  fontSize === 'lg' ? 'bg-red-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                ক+
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenEpaper}
                className="flex items-center gap-1 text-slate-100 hover:text-red-400 font-semibold text-[11px] cursor-pointer"
              >
                <Globe className="w-3 h-3 text-red-500" />
                <span>ই-পেপার</span>
              </button>

              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="px-2 py-0.5 text-[11px] font-medium text-slate-200 bg-[#162347] rounded border border-slate-600 cursor-pointer"
                >
                  অ্যাডমিন
                </button>
              )}

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-blue-400 p-0.5"
                aria-label="ফেসবুক"
              >
                <Facebook className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* DESKTOP & TABLET VIEW (>= 640px) */}
        <div className="hidden sm:flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          {/* Left: Date, Bangla Calendar, Live Time & Weather */}
          <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1.5 text-[12px] sm:text-[13px] leading-normal py-0.5">
            <span className="font-bold text-white tracking-tight shrink-0">
              {dhakaInfo.dateStr}
            </span>
            <span className="text-slate-600 select-none shrink-0" aria-hidden="true">|</span>
            <span className="text-sky-300 font-medium shrink-0">
              {dhakaInfo.banglaDateStr}
            </span>
            <span className="text-slate-600 select-none shrink-0" aria-hidden="true">|</span>
            <span className="inline-flex items-center gap-1.5 bg-[#14234b] hover:bg-[#192b5c] border border-sky-400/40 px-2.5 py-0.5 rounded text-[12px] sm:text-[13px] font-medium text-white shadow-xs transition-colors shrink-0">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
              <span className="text-slate-300 font-normal">সময়:</span>
              <span className="text-amber-300 font-bold tracking-wide">
                {dhakaInfo.timeWithSecondsStr || dhakaInfo.timeStr}
              </span>
            </span>
            <span className="text-slate-600 select-none shrink-0" aria-hidden="true">|</span>
            <div className="flex items-center gap-1.5 text-amber-400 font-bold shrink-0">
              <CloudSun className="w-4 h-4 text-amber-400 shrink-0" />
              <span>হাজরাবাড়ী,মেলান্দহ,জামালপুর ২৮° সে.</span>
            </div>
          </div>

          {/* Right: Font size adjuster, E-Paper, Admin, Social Links */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <div className="flex items-center gap-1 bg-[#141F3D] rounded border border-slate-700/70 px-2 py-0.5 shadow-2xs">
              <span className="text-[11px] text-slate-300 font-medium select-none mr-0.5">
                হরফ:
              </span>
              <button
                type="button"
                onClick={() => setFontSize('sm')}
                className={`px-1.5 py-0.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                  fontSize === 'sm'
                    ? 'bg-red-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
                title="ছোট ফন্ট (Small)"
              >
                ক-
              </button>
              <button
                type="button"
                onClick={() => setFontSize('md')}
                className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  fontSize === 'md'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
                title="স্বাভাবিক ফন্ট (Regular)"
              >
                ক
              </button>
              <button
                type="button"
                onClick={() => setFontSize('lg')}
                className={`px-1.5 py-0.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                  fontSize === 'lg'
                    ? 'bg-red-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
                title="বড় ফন্ট (Large)"
              >
                ক+
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenEpaper}
              className="flex items-center gap-1.5 text-slate-100 hover:text-red-400 font-semibold text-xs transition-colors cursor-pointer group"
              title="আজকের ই-পেপার সংস্করণ"
            >
              <Globe className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
              <span className="font-semibold tracking-tight">ই-পেপার</span>
            </button>

            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="flex items-center gap-1 text-slate-200 hover:text-white bg-[#162347] hover:bg-[#1E2F5E] px-2.5 py-1 rounded border border-slate-600/80 transition-all cursor-pointer text-xs font-medium shadow-2xs"
                title="সম্পাদকীয় ড্যাশবোর্ড"
              >
                <span>অ্যাডমিন</span>
              </button>
            )}

            <div className="flex items-center gap-2.5 text-slate-400">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-400 hover:scale-110 transition-all p-0.5"
                aria-label="ফেসবুক পেজ"
                title="ফেসবুক পেজ"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-red-500 hover:scale-110 transition-all p-0.5"
                aria-label="ইউটিউব চ্যানেল"
                title="ইউটিউব চ্যানেল"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-400 hover:scale-110 transition-all p-0.5"
                aria-label="এক্স (টুইটার)"
                title="এক্স (টুইটার)"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
