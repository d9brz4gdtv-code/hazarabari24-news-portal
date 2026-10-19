import React from 'react';
import { Award, Flame } from 'lucide-react';
import { Article } from '../types';
import { toBengaliNumber } from '../utils/dateUtils';

interface MostReadAndPicksProps {
  articles: Article[];
  onSelectArticle: (articleId: string) => void;
}

export const MostReadAndPicks: React.FC<MostReadAndPicksProps> = ({
  articles,
  onSelectArticle,
}) => {
  const mostReadArticles = articles
    .slice()
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  const editorPicks = articles
    .filter((a) => a.isEditorPick)
    .slice(0, 4);

  return (
    <section className="py-8 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Most Read (6 cols) */}
          <div className="lg:col-span-6 lg:pr-6">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-red-600 mb-4">
              <Flame className="w-5 h-5 text-red-600" />
              <h3 className="text-xl font-black text-slate-900 font-serif-bn">
                সর্বাধিক পঠিত
              </h3>
            </div>

            <div className="space-y-4">
              {mostReadArticles.map((article, index) => (
                <article
                  key={article.id}
                  onClick={() => onSelectArticle(article.id)}
                  className="flex items-start gap-4 group cursor-pointer"
                >
                  <span className="text-3xl sm:text-4xl font-extrabold text-red-600/30 group-hover:text-red-600 transition-colors font-serif-bn leading-none w-8 shrink-0 text-center">
                    {toBengaliNumber(index + 1)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold text-slate-500 mb-0.5 block">
                      {article.category}
                    </span>
                    <h4 className="font-bold text-slate-900 group-hover:text-red-700 transition-colors text-sm sm:text-base font-serif-bn line-clamp-2 leading-snug">
                      {article.title}
                    </h4>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Editor's Picks (6 cols) */}
          <div className="lg:col-span-6 lg:pl-6 pt-6 lg:pt-0">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-slate-900 mb-4">
              <Award className="w-5 h-5 text-amber-600" />
              <h3 className="text-xl font-black text-slate-900 font-serif-bn">
                সম্পাদকীয় পছন্দ
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {editorPicks.map((article) => (
                <article
                  key={article.id}
                  onClick={() => onSelectArticle(article.id)}
                  className="p-3 bg-white border border-slate-200 rounded-sm group cursor-pointer hover:border-red-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-bold text-red-600 mb-1 block">
                      {article.category}
                    </span>
                    <h4 className="font-bold text-slate-900 group-hover:text-red-700 transition-colors text-sm font-serif-bn line-clamp-2 leading-snug mb-2">
                      {article.title}
                    </h4>
                    <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                    {article.author.name}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
