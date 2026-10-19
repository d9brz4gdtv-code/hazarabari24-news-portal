import React from 'react';
import { Search, Menu, X, Download, Smartphone, Share2, PlusSquare, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

import { SiteSettings } from '../types';
import { BrandLogo } from './BrandLogo';

interface MastheadProps {
  onHomeClick: () => void;
  onOpenSearch: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  siteSettings?: SiteSettings;
}

export const Masthead: React.FC<MastheadProps> = ({
  onHomeClick,
  onOpenSearch,
  mobileMenuOpen,
  setMobileMenuOpen,
  siteSettings,
}) => {
  const { triggerInstall, showModal, setShowModal, isInstalled, isIOS } = usePWAInstall();

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left Column: Edition & Mobile Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 -ml-1 sm:-ml-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="মেনু খুলুন বা বন্ধ করুন"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="hidden sm:block">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  <span>বাংলাদেশ সংস্করণ</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">বিশ্বস্ত ও সত্যনিষ্ঠ সংবাদমাধ্যম</p>
              </div>
            </div>

            {/* Center Column: Grand Newspaper Brand Masthead Logo */}
            <div className="flex-1 flex justify-center min-w-0 px-1 py-1">
              <BrandLogo variant="masthead" onClick={onHomeClick} logoUrl={siteSettings?.logoUrl} />
            </div>

            {/* Right Column: App Download Button & Search Trigger */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* App Download / Install Button */}
              <button
                type="button"
                onClick={triggerInstall}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded transition-all cursor-pointer shadow-2xs group active:scale-95"
                title="হাজরাবাড়ী২৪ মোবাইল অ্যাপ ডাউনলোড বা ইনস্টল করুন"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 group-hover:text-white shrink-0" />
                <span className="font-serif-bn whitespace-nowrap hidden sm:inline">অ্যাপ ডাউনলোড</span>
                <span className="font-serif-bn whitespace-nowrap sm:hidden text-[11px]">অ্যাপ</span>
              </button>

              {/* Search Trigger */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-red-700 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded transition-all cursor-pointer shadow-2xs group"
                title="খবর অনুসন্ধান করুন"
                aria-label="খবর অনুসন্ধান করুন"
              >
                <Search className="w-4 h-4 text-slate-500 group-hover:text-red-600 shrink-0" />
                <span className="hidden md:inline">অনুসন্ধান</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* PWA App Download / Installation Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-7 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif-bn">
                  হাজারাবাদী ২৪ অ্যাপ ডাউনলোড
                </h3>
                <p className="text-xs text-slate-500">
                  সরাসরি আপনার মোবাইলের হোম স্ক্রিনে ইনস্টল করুন
                </p>
              </div>
            </div>

            {/* Status / Instructions */}
            {isInstalled ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center my-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-emerald-800 font-serif-bn">
                  অ্যাপটি ইতিমধ্যেই আপনার ডিভাইসে ইনস্টল করা আছে!
                </p>
              </div>
            ) : isIOS ? (
              <div className="space-y-3 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                <p className="font-semibold text-slate-900 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>আইফোন / আইপ্যাডে (iOS) ইনস্টল করার নিয়ম:</span>
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 pl-1 leading-relaxed">
                  <li>সাফারি (Safari) ব্রাউজারের নিচে শেয়ার বোতামে (Share) ট্যাপ করুন।</li>
                  <li>নিচে স্ক্রোল করে <span className="font-bold text-slate-800">'Add to Home Screen'</span> সিলেক্ট করুন।</li>
                  <li>উপরে ডানে <span className="font-bold text-slate-800">'Add'</span> চাপলেই অ্যাপটি ইনস্টল হয়ে যাবে।</li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                <p className="font-semibold text-slate-900 flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>অ্যান্ড্রয়েড ও কম্পিউটারে ইনস্টল করার নিয়ম:</span>
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside pl-1 leading-relaxed">
                  <li>ব্রাউজারের ৩-ডট মেনু বা অ্যাড্রেস বার থেকে <span className="font-bold text-slate-800">'Install App'</span> বা <span className="font-bold text-slate-800">'Add to Home screen'</span> চাপুন।</li>
                  <li>অথবা নিচের ইনস্টল বাটনে ক্লিক করে নিশ্চিত করুন।</li>
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  triggerInstall();
                  setShowModal(false);
                }}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-serif-bn"
              >
                <Download className="w-4 h-4" />
                <span>এখনই ইনস্টল করুন</span>
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
