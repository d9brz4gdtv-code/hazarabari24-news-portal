import React from 'react';
import { Mail, MapPin, Phone, ShieldCheck, Heart, Globe, ArrowUp } from 'lucide-react';
import { CATEGORIES } from '../data/mockArticles';
import { NewsCategory, PageView, SiteSettings } from '../types';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigateHome: () => void;
  onNavigateCategory: (category: NewsCategory) => void;
  onNavigatePage: (view: PageView) => void;
  siteSettings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateCategory,
  onNavigatePage,
  siteSettings,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-red-600 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="footer" onClick={onNavigateHome} logoUrl={siteSettings?.logoUrl} />

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              হাজরাবাড়ী ২৪. কম বাংলাদেশের একটি স্বাধীন ও দায়িত্বশীল অনলাইন জাতীয় দৈনিক। সত্যনিষ্ঠ সাংবাদিকতা, জাতীয় উন্নয়ন এবং মাঠপর্যায়ের মানুষের কন্ঠস্বর তুলে ধরাই আমাদের প্রধান অঙ্গীকার।
            </p>

            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-300">প্রধান কার্যালয়:</strong>{' '}
                  {siteSettings?.officeHazrabari || 'হাজরাবাড়ী পৌরসভা, মেলান্দহ, জামালপুর'}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-300">ঢাকা ব্যুরো:</strong>{' '}
                  {siteSettings?.officeDhaka || 'পুরানা পল্টন, ঢাকা-১০০০, বাংলাদেশ।'}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>বার্তা ও বাণিজ্যিক বিভাগ: {siteSettings?.phone || '+৮৮০১৭১২-৩৪৫৬৭৮'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>ইমেইল: {siteSettings?.contactEmail || 'news@hazarabari24.com'}</span>
              </p>
            </div>
          </div>

          {/* Quick Category Directory (5 cols) */}
          <div className="lg:col-span-5">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b border-slate-800 font-serif-bn">
              সংবাদ বিভাগসমূহ
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onNavigateCategory(cat.id)}
                  className="text-left text-slate-400 hover:text-red-400 transition-colors py-1 cursor-pointer truncate"
                >
                  {cat.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onNavigatePage({ type: 'gallery' })}
                className="text-left text-red-400 hover:text-white transition-colors py-1 cursor-pointer font-medium"
              >
                ফটো গ্যালারি
              </button>
              <button
                type="button"
                onClick={() => onNavigatePage({ type: 'video' })}
                className="text-left text-red-400 hover:text-white transition-colors py-1 cursor-pointer font-medium"
              >
                ভিডিও সংবাদ
              </button>
            </div>
          </div>

          {/* Institutional Links & Editorial Board (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b border-slate-800 font-serif-bn">
              নীতিমালা ও প্রশাসন
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage({ type: 'about' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  আমাদের সম্পর্কে (About Us)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage({ type: 'editorial-policy' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  সম্পাদকীয় নীতিমালা (Editorial Policy)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage({ type: 'privacy' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  গোপনীয়তা নীতি (Privacy Policy)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage({ type: 'contact' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  যোগাযোগ ও মতামত (Contact)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage({ type: 'admin' })}
                  className="hover:text-red-400 text-slate-300 transition-colors cursor-pointer font-medium"
                >
                  সম্পাদকীয় কন্ট্রোল প্যানেল (Admin Portal)
                </button>
              </li>
            </ul>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-400">
              <span className="font-semibold text-slate-200 block mb-1">সম্পাদকীয় পর্ষদ</span>
              <p>সম্পাদক ও প্রকাশক: {siteSettings?.editorName || 'মো. আল-আমীন শেখ'}</p>
              <p className="text-slate-500 mt-0.5">নির্বাহী সম্পাদক: {siteSettings?.executiveEditor || 'ড. এম. এ. হাসান'}</p>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} হাজরাবাড়ী ২৪. কম | সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
              পরীক্ষামূলক ডেমো পোর্টাল
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>শীর্ষে ফিরুন</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
