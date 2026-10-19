import React from 'react';
import { Tag, FolderKanban, CheckCircle } from 'lucide-react';
import { CATEGORIES } from '../../data/mockArticles';
import { Article } from '../../types';
import { toBengaliNumber } from '../../utils/dateUtils';

interface CategoriesManagerProps {
  articles: Article[];
}

export const CategoriesManager: React.FC<CategoriesManagerProps> = ({ articles }) => {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 font-serif-bn flex items-center gap-2">
          <FolderKanban className="w-6 h-6 text-red-600" />
          <span>সংবাদ বিভাগসমূহ (Categories)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          অনলাইন সংবাদপত্রের প্রধান ১২টি নির্ধারিত বিভাগ ও বিবরণ
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat, idx) => {
          const count = articles.filter((a) => a.category === cat.id).length;
          return (
            <div
              key={cat.id}
              className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-red-400 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    #{toBengaliNumber(idx + 1)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700">
                    {toBengaliNumber(count)} টি সংবাদ
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 font-serif-bn mb-1">
                  {cat.label}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans-bn">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>স্লাগ: /{cat.slug}</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>সক্রিয়</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
