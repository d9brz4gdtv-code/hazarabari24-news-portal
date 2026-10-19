import React, { useState } from 'react';
import { ChevronRight, Clock, Eye, Filter, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Article, NewsCategory } from '../types';
import { CATEGORIES } from '../data/mockArticles';
import { getBengaliRelativeTime, toBengaliNumber } from '../utils/dateUtils';
import { AdBanner } from '../components/AdBanner';
import { getSafeImageUrl, handleImageError, DEFAULT_NEWS_FALLBACK_IMAGE } from '../utils/imageUtils';

interface CategoryPageProps {
  category: NewsCategory;
  allArticles: Article[];
  onSelectArticle: (articleId: string) => void;
  onNavigateHome: () => void;
  onSelectCategory: (category: NewsCategory) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  allArticles,
  onSelectArticle,
  onNavigateHome,
  onSelectCategory,
}) => {
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [visibleCount, setVisibleCount] = useState(8);

  const categoryMeta = CATEGORIES.find((c) => c.id === category) || {
    id: category,
    label: category,
    slug: 'category',
    description: `${category} সম্পর্কিত সকল প্রতিবেদন ও বিশ্লেষণ।`,
  };

  // Filter articles for this category
  let articles = allArticles.filter((a) => a.category === category);

  // If there are few in this category, we also provide related general stories so page looks rich and realistic
  const hasFewArticles = articles.length < 3;
  const supplementalArticles = hasFewArticles
    ? allArticles.filter((a) => a.category !== category).slice(0, 4)
    : [];

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === 'popular') return b.viewCount - a.viewCount;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return (
    <div className="py-6 sm:py-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-red-600 transition-colors cursor-pointer"
          >
            প্রচ্ছদ
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-red-600 font-bold">{category}</span>
        </nav>

        {/* Category Header */}
        <div className="border-b-2 border-red-600 pb-5 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block mb-1">
                বিভাগীয় সংবাদ
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-950 font-serif-bn">
                {category}
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl font-serif-bn">
                {categoryMeta.description}
              </p>
            </div>

            {/* Sorting controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">ক্রম:</span>
              <div className="flex items-center bg-slate-100 rounded p-1 border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setSortBy('latest')}
                  className={`px-3 py-1 rounded font-medium transition-colors ${
                    sortBy === 'latest' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  সর্বশেষ
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('popular')}
                  className={`px-3 py-1 rounded font-medium transition-colors ${
                    sortBy === 'popular' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  জনপ্রিয়
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid of Articles */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 space-y-8">
            {sortedArticles.length > 0 ? (
              <div className="space-y-6">
                {sortedArticles.slice(0, visibleCount).map((article, idx) => (
                  <article
                    key={article.id}
                    onClick={() => onSelectArticle(article.id)}
                    className="p-4 sm:p-5 bg-white border border-slate-200 rounded-sm hover:border-red-500 hover:shadow-xs transition-all group cursor-pointer flex flex-col sm:flex-row gap-5"
                  >
                    <div className="sm:w-56 aspect-16/10 rounded overflow-hidden bg-slate-950 shrink-0 border border-slate-200 relative flex items-center justify-center">
                      <img
                        src={getSafeImageUrl(article.coverImage)}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-sm opacity-25 scale-110 pointer-events-none"
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
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                          <span className="font-bold text-red-600">{article.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{article.author.name}</span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getBengaliRelativeTime(article.publishedAt)}
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-red-700 transition-colors font-serif-bn leading-snug mb-2">
                          {article.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 font-sans-bn line-clamp-2 leading-relaxed">
                          {article.summary}
                        </p>
                      </div>
                      <div className="mt-3 text-[11px] text-slate-400">
                        {toBengaliNumber(article.viewCount)} বার পঠিত
                      </div>
                    </div>
                  </article>
                ))}

                {/* Load More / Next Articles Button */}
                {visibleCount < sortedArticles.length && (
                  <div className="pt-4 pb-2 text-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="w-full sm:w-auto px-6 py-3 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-300 hover:border-red-600 rounded-lg font-bold text-xs sm:text-sm font-serif-bn transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-2 group active:scale-98"
                    >
                      <span>পরের খবরগুলো দেখুন (আরও {toBengaliNumber(sortedArticles.length - visibleCount)} টি সংবাদ)</span>
                      <ChevronDown className="w-4 h-4 text-red-600 group-hover:text-white transition-transform group-hover:translate-y-0.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center bg-slate-50 border border-slate-200 rounded-md">
                <p className="text-slate-600 font-serif-bn">
                  {category} বিভাগে শীঘ্রই নতুন সংবাদ প্রকাশ করা হবে।
                </p>
              </div>
            )}

            {/* Supplemental articles if current section has limited content */}
            {supplementalArticles.length > 0 && (
              <div className="pt-8 border-t border-slate-200">
                <h3 className="font-bold text-slate-800 font-serif-bn mb-4">
                  অন্যান্য বিভাগের গুরুত্বপূর্ণ সংবাদ
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {supplementalArticles.map((sup) => (
                    <div
                      key={sup.id}
                      onClick={() => onSelectArticle(sup.id)}
                      className="p-3 border border-slate-200 rounded hover:border-red-400 cursor-pointer group"
                    >
                      <span className="text-[10px] text-red-600 font-bold">{sup.category}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-700 font-serif-bn line-clamp-2 mt-1">
                        {sup.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Rail */}
          <div className="md:col-span-4 space-y-6">
            {/* Quick other categories */}
            <div className="bg-slate-50 p-5 rounded border border-slate-200">
              <h3 className="font-bold text-slate-900 font-serif-bn pb-2 border-b border-slate-200 mb-3 text-sm">
                অন্যান্য সংবাদ বিভাগ
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onSelectCategory(cat.id)}
                    className={`text-left p-1.5 rounded transition-colors truncate ${
                      cat.id === category
                        ? 'bg-red-600 text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Advertisement */}
            <AdBanner slot="rectangle" />
          </div>
        </div>
      </div>
    </div>
  );
};
