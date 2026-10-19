import React from 'react';

interface AdBannerProps {
  slot: 'leaderboard' | 'rectangle' | 'inline';
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot }) => {
  if (slot === 'leaderboard') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-md p-3 text-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            বিজ্ঞাপন
          </span>
          <div className="h-24 sm:h-28 bg-white border border-slate-100 rounded flex flex-col items-center justify-center p-4">
            <span className="text-sm font-serif-bn font-semibold text-slate-700">
              হাজরাবাড়ী ২৪. কম ডিজিটাল বিজ্ঞাপন স্পেস
            </span>
            <span className="text-xs text-slate-400 mt-1">
              লক্ষাধিক দেশি ও প্রবাসী পাঠকের কাছে আপনার পণ্যের বার্তা পৌঁছে দিন
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-md p-3 text-center my-4">
      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
        বিজ্ঞাপন
      </span>
      <div className="h-48 bg-white border border-slate-100 rounded flex flex-col items-center justify-center p-4">
        <span className="text-xs font-serif-bn font-semibold text-slate-700">
          সংবাদ স্পন্সরশিপ পার্টনার
        </span>
        <span className="text-[11px] text-slate-400 mt-1">যোগাযোগ: ads@hazarabari24.com</span>
      </div>
    </div>
  );
};
