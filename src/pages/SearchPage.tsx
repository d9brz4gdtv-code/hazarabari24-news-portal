import React, { useState } from 'react';
import { Search, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { Article, NewsCategory } from '../types';
import { CATEGORIES } from '../data/mockArticles';
import { getBengaliRelativeTime, toBengaliNumber } from '../utils/dateUtils';
import { getSafeImageUrl, handleImageError, DEFAULT_NEWS_FALLBACK_IMAGE } from '../utils/imageUtils';

interface SearchPageProps {
  initialQuery: string;
  allArticles: Article[];
  onSelectArticle: (articleId: string) => void;
  onNavigateHome: () => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery,
  allArticles,
  onSelectArticle,
  onNavigateHome,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = allArticles.filter((item) => {
    const matchesText =
      !query.trim() ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.summary.toLowerCase().includes(query.toLowerCase()) ||
      item.content.some((c) => c.toLowerCase().includes(query.toLowerCase())) ||
      item.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesText && matchesCategory;
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
          <span className="text-red-600 font-bold">অনুসন্ধান ফলাফল</span>
        </nav>

        {/* Search Header Form */}
        <div className="bg-slate-50 p-6 sm:p-8 rounded-lg border border-slate-200 mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif-bn mb-4">
            সংবাদ ও প্রতিবেদন অনুসন্ধান
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="কীওয়ার্ড লিখুন (যেমন: মেট্রোরেল, ক্রিকেট, হাজরাবাড়ী)..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="all">সকল বিভাগ</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 text-xs text-slate-500">
            {query.trim() ? (
              <span>
                &lsquo;{query}&rsquo; অনুসন্ধানে{' '}
                <strong className="text-red-600">{toBengaliNumber(filtered.length)}</strong> টি ফলাফল পাওয়া গেছে
              </span>
            ) : (
              <span>মোট <strong className="text-red-600">{toBengaliNumber(filtered.length)}</strong> টি সংবাদ সংরক্ষিত আছে</span>
            )}
          </div>
        </div>

        {/* Results List */}
        {filtered.length > 0 ? (
          <div className="space-y-4 max-w-4xl">
            {filtered.map((item) => (
              <article
                key={item.id}
                onClick={() => onSelectArticle(item.id)}
                className="p-5 border border-slate-200 rounded-md hover:border-red-500 transition-all cursor-pointer group flex flex-col sm:flex-row gap-5 bg-white"
              >
                <div className="sm:w-52 aspect-16/10 rounded overflow-hidden bg-slate-950 shrink-0 border border-slate-200 relative flex items-center justify-center">
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
                    className={`relative z-10 transition-transform duration-300 group-hover:scale-103 ${
                      item.imageFit === 'cover'
                        ? 'w-full h-full object-cover'
                        : 'max-h-full max-w-full object-contain mx-auto'
                    }`}
                    loading="lazy"
                    onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                    <span className="font-bold text-red-600">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{getBengaliRelativeTime(item.publishedAt)}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-red-700 transition-colors font-serif-bn mb-2">
                    {item.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-slate-50 rounded-lg border border-slate-200 max-w-2xl mx-auto">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 font-serif-bn">কোনো সংবাদ মেলেনি</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              আপনার দেওয়া কীওয়ার্ডের সাথে মিলে এমন কোনো প্রতিবেদন পাওয়া যায়নি। অনুগ্রহ করে বানান পরীক্ষা করুন বা সাধারণ শব্দ দিয়ে অনুসন্ধান করুন।
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
