import React, { useState } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { Article, NewsCategory } from '../types';
import { CATEGORIES } from '../data/mockArticles';
import { getSafeImageUrl, handleImageError, DEFAULT_NEWS_FALLBACK_IMAGE } from '../utils/imageUtils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (articleId: string) => void;
  onSearchSubmit: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
  onSearchSubmit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filteredArticles = articles.filter((art) => {
    const matchesQuery =
      searchTerm.trim() === '' ||
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearchSubmit(searchTerm);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 font-serif-bn flex items-center gap-2">
            <Search className="w-4 h-4 text-red-600" />
            <span>সংবাদ অনুসন্ধান করুন</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleFormSubmit} className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="কীওয়ার্ড লিখুন (যেমন: মেট্রোরেল, ক্রিকেট, হাজরাবাড়ী)..."
              className="w-full pl-10 pr-24 py-3 bg-slate-50 border border-slate-300 rounded-md text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer"
            >
              খুঁজুন
            </button>
          </div>

          {/* Quick Category Filters */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              সব বিভাগ
            </button>
            {CATEGORIES.slice(0, 6).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-red-600 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </form>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-2">
          {filteredArticles.length > 0 ? (
            filteredArticles.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectArticle(item.id);
                  onClose();
                }}
                className="p-3 hover:bg-red-50/60 rounded cursor-pointer transition-colors group flex items-start gap-3"
              >
                <div className="w-16 h-12 rounded overflow-hidden bg-slate-950 shrink-0 border border-slate-200 relative flex items-center justify-center">
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
                    className={`relative z-10 ${
                      item.imageFit === 'cover'
                        ? 'w-full h-full object-cover'
                        : 'max-h-full max-w-full object-contain mx-auto'
                    }`}
                    loading="lazy"
                    onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-red-600 font-semibold mb-0.5">
                    {item.category}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors font-serif-bn line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {item.summary}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 self-center shrink-0" />
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-slate-500">
              কোনো সংবাদ পাওয়া যায়নি। অনুগ্রহ করে অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
