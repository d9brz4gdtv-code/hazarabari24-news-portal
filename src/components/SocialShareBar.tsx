import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface SocialShareProps {
  url?: string;
  title: string;
  summary?: string;
  className?: string;
  compact?: boolean;
}

// Authentic SVGs for Facebook, WhatsApp, and Twitter / X
export const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.01-1.24-.74-.66-1.25-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.12-.22-.19-.47-.32" />
  </svg>
);

export const TwitterXIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/**
 * Compact social share row (used in top action bar)
 */
export const SocialShareBar: React.FC<SocialShareProps> = ({
  url,
  title,
  summary,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + '\n\n' + shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary || title,
          url: shareUrl,
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-[11px] text-slate-500 mr-0.5 select-none font-medium">শেয়ার:</span>

      {/* Facebook */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noreferrer"
        className="p-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded transition-all shadow-2xs hover:scale-105"
        title="ফেসবুকে শেয়ার করুন"
        aria-label="Facebook Share"
      >
        <FacebookIcon className="w-3.5 h-3.5" />
      </a>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="p-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded transition-all shadow-2xs hover:scale-105"
        title="হোয়াটসঅ্যাপে শেয়ার করুন"
        aria-label="WhatsApp Share"
      >
        <WhatsAppIcon className="w-3.5 h-3.5" />
      </a>

      {/* Twitter / X */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noreferrer"
        className="p-1.5 bg-slate-900 hover:bg-black text-white rounded transition-all shadow-2xs hover:scale-105"
        title="এক্সে (টুইটার) শেয়ার করুন"
        aria-label="Twitter / X Share"
      >
        <TwitterXIcon className="w-3.5 h-3.5" />
      </a>

      {/* Native Share button for mobile */}
      <button
        type="button"
        onClick={handleNativeShare}
        className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded transition-all shadow-2xs cursor-pointer sm:hidden"
        title="শেয়ার করুন"
        aria-label="Share"
      >
        <Share2 className="w-3.5 h-3.5" />
      </button>

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1 px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-medium transition-colors cursor-pointer shadow-2xs"
        title="লিংক কপি করুন"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? 'কপি হয়েছে' : 'লিংক'}</span>
      </button>
    </div>
  );
};

/**
 * Prominent Social Media Sharing Card (mounted at the bottom of the article)
 */
export const SocialShareCard: React.FC<SocialShareProps> = ({
  url,
  title,
  summary,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + '\n\n' + shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary || title,
          url: shareUrl,
        });
      } catch {
        // user dismissed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className={`p-5 sm:p-6 bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-50 border border-slate-200/90 rounded-2xl shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 font-serif-bn flex items-center gap-2">
            <Share2 className="w-5 h-5 text-red-600 shrink-0" />
            <span>সংবাদটি অন্যদের সাথে শেয়ার করুন</span>
          </h4>
          <p className="text-xs text-slate-500 font-serif-bn mt-1">
            সামাজিক যোগাযোগ মাধ্যমে ছড়িয়ে দিয়ে সঠিক তথ্য প্রচারে অংশ নিন
          </p>
        </div>

        {/* Copy Link button on top right */}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">লিংক কপি হয়েছে!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>লিংক কপি করুন</span>
            </>
          )}
        </button>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Facebook Button */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-98"
          title="ফেসবুকে শেয়ার করুন"
        >
          <FacebookIcon className="w-4 h-4 shrink-0" />
          <span>ফেসবুক</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-98"
          title="হোয়াটসঅ্যাপে শেয়ার করুন"
        >
          <WhatsAppIcon className="w-4 h-4 shrink-0" />
          <span>হোয়াটসঅ্যাপ</span>
        </a>

        {/* Twitter / X Button */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-98"
          title="এক্সে (টুইটার) শেয়ার করুন"
        >
          <TwitterXIcon className="w-4 h-4 shrink-0" />
          <span>এক্স (Twitter)</span>
        </a>

        {/* Device Native Share or Messenger/Email */}
        <button
          type="button"
          onClick={handleNativeShare}
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow active:scale-98 cursor-pointer"
          title="অন্যান্য মাধ্যমে শেয়ার করুন"
        >
          <Share2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>অন্যান্য মাধ্যম</span>
        </button>
      </div>

      {/* Visual confirmation preview: Large Logo Social Card Preview */}
      <div className="mt-4 pt-3.5 border-t border-slate-200/80">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            লিংক শেয়ার কার্ড প্রিভিউ (Large Card)
          </span>
          <span className="text-slate-400">ফেসবুক, হোয়াটসঅ্যাপ ও এক্স সামঞ্জস্যপূর্ণ</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:border-slate-300 transition-colors">
          <div className="relative bg-white aspect-[1.91/1] max-h-48 w-full border-b border-slate-100 flex items-center justify-center p-2 overflow-hidden">
            <img
              src="/images/og-image.png"
              alt="হাজরাবাড়ী ২৪. কম অফিসিয়াল লোগো"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="p-3 bg-slate-50/60">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">hazarabari24.com</div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 mt-0.5 font-serif-bn">{title}</div>
            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">হাজরাবাড়ী ২৪. কম — সত্যের পথে, সংবাদের সাথে</div>
          </div>
        </div>
      </div>
    </div>
  );
};
