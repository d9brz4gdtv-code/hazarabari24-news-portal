import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { Article, NewsCategory } from '../types';
import { getBengaliRelativeTime } from '../utils/dateUtils';
import { getSafeImageUrl, handleImageError, DEFAULT_NEWS_FALLBACK_IMAGE } from '../utils/imageUtils';

interface CategoryBlockProps {
  category: NewsCategory;
  articles: Article[];
  onSelectArticle: (articleId: string) => void;
  onViewAllCategory: (category: NewsCategory) => void;
}

export const CategoryBlock: React.FC<CategoryBlockProps> = ({
  category,
  articles,
  onSelectArticle,
  onViewAllCategory,
}) => {
  if (articles.length === 0) return null;

  const leadItem = articles[0];
  const listItems = articles.slice(1, 4);

  return (
    <section className="py-6">
      {/* Category Section Header */}
      <div className="flex items-center justify-between border-b-2 border-red-600 pb-2 mb-5">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif-bn tracking-tight">
          {category}
        </h3>
        <button
          type="button"
          onClick={() => onViewAllCategory(category)}
          className="text-xs sm:text-sm font-semibold text-red-600 hover:text-red-800 flex items-center gap-0.5 transition-colors cursor-pointer"
        >
          <span>আরও দেখুন</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: 1 large card + 3 list cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Lead card (7 cols) */}
        <div className="md:col-span-7">
          <article
            className="group cursor-pointer"
            onClick={() => onSelectArticle(leadItem.id)}
          >
            <div className="relative aspect-16/10 rounded overflow-hidden bg-slate-950 mb-3 border border-slate-200 flex items-center justify-center">
              <img
                src={getSafeImageUrl(leadItem.coverImage)}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none"
                onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
              />
              <img
                src={getSafeImageUrl(leadItem.coverImage)}
                alt={leadItem.title}
                className={`relative z-10 transition-transform duration-300 group-hover:scale-103 ${
                  leadItem.imageFit === 'cover'
                    ? 'w-full h-full object-cover'
                    : 'max-h-full max-w-full object-contain mx-auto'
                }`}
                loading="lazy"
                onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
              <span>{leadItem.author.name}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {getBengaliRelativeTime(leadItem.publishedAt)}
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-red-700 transition-colors font-serif-bn leading-snug mb-2">
              {leadItem.title}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {leadItem.summary}
            </p>
          </article>
        </div>

        {/* 3 List cards (5 cols) */}
        <div className="md:col-span-5 flex flex-col divide-y divide-slate-100 justify-between">
          {listItems.length > 0 ? (
            listItems.map((item) => (
              <article
                key={item.id}
                onClick={() => onSelectArticle(item.id)}
                className="py-3 first:pt-0 last:pb-0 group cursor-pointer flex gap-3 items-start"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-slate-400 mb-1">
                    {getBengaliRelativeTime(item.publishedAt)}
                  </div>
                  <h5 className="font-bold text-slate-900 group-hover:text-red-700 transition-colors text-sm font-serif-bn line-clamp-2 leading-snug">
                    {item.title}
                  </h5>
                </div>
                <div className="w-20 h-16 shrink-0 rounded overflow-hidden bg-slate-950 border border-slate-200 relative flex items-center justify-center">
                  <img
                    src={getSafeImageUrl(item.coverImage)}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-sm opacity-25 scale-110 pointer-events-none"
                    onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                  />
                  <img
                    src={getSafeImageUrl(item.coverImage)}
                    alt={item.title}
                    className={`relative z-10 transition-transform ${
                      item.imageFit === 'cover'
                        ? 'w-full h-full object-cover group-hover:scale-105'
                        : 'max-h-full max-w-full object-contain mx-auto'
                    }`}
                    loading="lazy"
                    onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                  />
                </div>
              </article>
            ))
          ) : (
            <div className="text-xs text-slate-400 py-6 italic text-center">
              এই বিভাগে আরও খবর দ্রুত যুক্ত হচ্ছে...
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
