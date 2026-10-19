import React, { useState } from 'react';
import { Clock, Eye, Sparkles, TrendingUp, ChevronDown } from 'lucide-react';
import { Article } from '../types';
import { getBengaliRelativeTime, toBengaliNumber } from '../utils/dateUtils';
import { getSafeImageUrl, handleImageError, DEFAULT_NEWS_FALLBACK_IMAGE } from '../utils/imageUtils';

interface LeadNewsSectionProps {
  articles: Article[];
  onSelectArticle: (articleId: string) => void;
  onSelectCategory: (category: any) => void;
}

export const LeadNewsSection: React.FC<LeadNewsSectionProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory,
}) => {
  const [showMoreLatest, setShowMoreLatest] = useState(false);
  const leadArticle = articles.find((a) => a.isLead) || articles[0];
  const secondaryArticles = articles.filter((a) => a.id !== leadArticle?.id).slice(0, 3);
  const latestSidebarArticles = showMoreLatest ? articles.slice(3, 15) : articles.slice(3, 8);

  return (
    <section className="border-b border-slate-200 py-6 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Main Lead Story & Secondary stories (8 Cols) */}
          <div className="lg:col-span-8 lg:pr-8 space-y-8">
            {leadArticle && (
              <article
                className="group cursor-pointer"
                onClick={() => onSelectArticle(leadArticle.id)}
              >
                <div className="relative overflow-hidden rounded-md bg-slate-950 aspect-16/9 mb-4 shadow-sm border border-slate-200 flex items-center justify-center">
                  <img
                    src={getSafeImageUrl(leadArticle.coverImage)}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none"
                    onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                  />
                  <img
                    src={getSafeImageUrl(leadArticle.coverImage)}
                    alt={leadArticle.title}
                    className={`relative z-10 transition-transform duration-500 group-hover:scale-102 ${
                      leadArticle.imageFit === 'contain'
                        ? 'max-h-full max-w-full object-contain'
                        : leadArticle.imageFit === 'cover'
                        ? 'w-full h-full object-cover'
                        : 'max-h-full max-w-full object-contain mx-auto'
                    }`}
                    loading="eager"
                    onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                  />
                  <div className="absolute top-3 left-3 z-20 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-md font-serif-bn">
                    প্রধান খবর
                  </div>
                </div>

                {/* Metadata: Zero-pill discipline */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCategory(leadArticle.category);
                    }}
                    className="font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    {leadArticle.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{leadArticle.author.name}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {getBengaliRelativeTime(leadArticle.publishedAt)}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 group-hover:text-red-700 transition-colors font-serif-bn leading-tight mb-3">
                  {leadArticle.title}
                </h2>

                <p className="text-slate-700 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {leadArticle.summary}
                </p>
              </article>
            )}

            {/* Secondary Lead Headlines Grid (3 Columns) */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {secondaryArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => onSelectArticle(article.id)}
                  className="group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-16/10 rounded overflow-hidden bg-slate-950 mb-2.5 border border-slate-200 flex items-center justify-center">
                      <img
                        src={getSafeImageUrl(article.coverImage)}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none"
                        onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                      />
                      <img
                        src={getSafeImageUrl(article.coverImage)}
                        alt={article.title}
                        className={`relative z-10 transition-transform duration-300 group-hover:scale-103 ${
                          article.imageFit === 'cover'
                            ? 'w-full h-full object-cover'
                            : 'max-h-full max-w-full object-contain mx-auto'
                        }`}
                        loading="lazy"
                        onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <span className="text-red-600 font-semibold">{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{getBengaliRelativeTime(article.publishedAt)}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-red-700 transition-colors text-sm sm:text-base font-serif-bn line-clamp-3 leading-snug">
                      {article.title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Rail: Latest Stream (4 Cols) */}
          <div className="lg:col-span-4 lg:pl-8 pt-6 lg:pt-0">
            <div className="sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-serif-bn">
                    সর্বশেষ সংবাদ
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">লাইভ আপডেট</span>
              </div>

              <div className="divide-y divide-slate-100">
                {latestSidebarArticles.map((item, idx) => (
                  <article
                    key={item.id}
                    onClick={() => onSelectArticle(item.id)}
                    className="py-3.5 group cursor-pointer first:pt-0"
                  >
                    <div className="flex items-baseline gap-2 mb-1 text-xs text-slate-500">
                      <span className="font-bold text-red-600">{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-400">{getBengaliRelativeTime(item.publishedAt)}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 group-hover:text-red-700 transition-colors text-sm sm:text-base font-serif-bn line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                  </article>
                ))}
              </div>

              {articles.length > 8 && (
                <button
                  type="button"
                  onClick={() => setShowMoreLatest(!showMoreLatest)}
                  className="w-full mt-3 py-2 px-3 text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 bg-red-50 rounded-md border border-red-200 hover:border-red-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="আরও সর্বশেষ খবর দেখুন"
                >
                  <span>{showMoreLatest ? 'কম খবর দেখুন' : 'আরও সর্বশেষ খবর দেখুন (পরের গুলো)'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMoreLatest ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* Reserved Advertisement Spot */}
              <div className="mt-6 p-4 bg-slate-50 border border-dashed border-slate-300 rounded text-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  বিজ্ঞাপন
                </span>
                <div className="py-6 px-3 bg-white border border-slate-200 rounded">
                  <p className="text-xs text-slate-600 font-serif-bn font-semibold">
                    হাজরাবাড়ী ২৪ ডিজিটাল সংবাদ প্রচার মাধ্যম
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">বিজ্ঞাপনের জন্য যোগাযোগ করুন: ads@hazarabari24.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
