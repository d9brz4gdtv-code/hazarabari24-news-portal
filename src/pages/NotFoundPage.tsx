import React from 'react';
import { Home, Search, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigateHome: () => void;
  onOpenSearch: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateHome,
  onOpenSearch,
}) => {
  return (
    <div className="py-16 sm:py-24 bg-white min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <span className="text-7xl sm:text-9xl font-black text-red-600/20 font-serif-bn block leading-none">
          ৪০৪
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif-bn mt-4 mb-2">
          কাঙ্ক্ষিত পৃষ্ঠাটি পাওয়া যায়নি
        </h1>
        <p className="text-sm text-slate-600 mb-8 font-sans-bn leading-relaxed">
          আপনি যে সংবাদ বা লিঙ্কটি খুঁজছেন তা হয়তো সরানো হয়েছে, নাম পরিবর্তিত হয়েছে অথবা সাময়িকভাবে অনুপলব্ধ।
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white rounded font-bold text-xs sm:text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>প্রচ্ছদে ফিরে যান</span>
          </button>
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 text-slate-800 rounded font-semibold text-xs sm:text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-300"
          >
            <Search className="w-4 h-4" />
            <span>সংবাদ খুঁজুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
