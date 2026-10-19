import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  FileText,
  AlertTriangle,
  Loader2,
  Calendar,
} from 'lucide-react';
import { Article, ArticleStatus, NewsCategory } from '../../types';
import { CATEGORIES } from '../../data/mockArticles';
import { getBengaliRelativeTime, toBengaliNumber } from '../../utils/dateUtils';
import { deleteArticleFromFirestore, updateArticleStatus } from '../../services/firestoreNewsService';
import { getSafeImageUrl, handleImageError, DEFAULT_NEWS_FALLBACK_IMAGE } from '../../utils/imageUtils';

interface NewsManagerProps {
  articles: Article[];
  onAddNew: () => void;
  onEditArticle: (article: Article) => void;
  onPreviewArticle: (article: Article) => void;
  onRefresh: () => void;
  loading: boolean;
}

export const NewsManager: React.FC<NewsManagerProps> = ({
  articles,
  onAddNew,
  onEditArticle,
  onPreviewArticle,
  onRefresh,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Status toggle state
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const filteredArticles = articles.filter((art) => {
    const matchesQuery =
      searchTerm.trim() === '' ||
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || art.status === selectedStatus;

    return matchesQuery && matchesCategory && matchesStatus;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteArticleFromFirestore(deleteTarget.id);
      setDeleteTarget(null);
      onRefresh();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (article: Article) => {
    setStatusUpdatingId(article.id);
    try {
      const nextStatus: ArticleStatus = article.status === 'published' ? 'draft' : 'published';
      await updateArticleStatus(article.id, nextStatus);
      onRefresh();
    } catch (err) {
      console.error('Status toggle error:', err);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const getStatusBadge = (status: ArticleStatus, scheduledAt?: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            <span>প্রকাশিত</span>
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <FileText className="w-3 h-3" />
            <span>খসড়া</span>
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Clock className="w-3 h-3" />
            <span>নির্ধারিত</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-serif-bn">
            সংবাদ ব্যবস্থাপনা ({toBengaliNumber(articles.length)} টি)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            সকল খসড়া ও প্রকাশিত সংবাদের তালিকা, সম্পাদনা ও প্রকাশনা নিয়ন্ত্রণ
          </p>
        </div>

        <button
          type="button"
          onClick={onAddNew}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন সংবাদ যোগ করুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="শিরোনাম বা কীওয়ার্ড দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="all">সকল বিভাগ</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="all">সকল অবস্থা (Status)</option>
            <option value="published">প্রকাশিত</option>
            <option value="draft">খসড়া</option>
            <option value="scheduled">নির্ধারিত</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-red-600" />
            <p className="text-xs">সংবাদ লোড হচ্ছে...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">সংবাদ</th>
                  <th className="py-3 px-4 whitespace-nowrap">বিভাগ</th>
                  <th className="py-3 px-4 whitespace-nowrap">প্রতিবেদক</th>
                  <th className="py-3 px-4 whitespace-nowrap">অবস্থা</th>
                  <th className="py-3 px-4 whitespace-nowrap">তারিখ</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded overflow-hidden bg-slate-900 shrink-0 border border-slate-200 flex items-center justify-center relative">
                          {article.coverImage ? (
                            <img
                              src={getSafeImageUrl(article.coverImage)}
                              alt=""
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <FileText className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-md">
                          <h4 className="font-bold text-slate-900 font-serif-bn line-clamp-1 text-sm">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            {article.isLead && (
                              <span className="text-red-600 font-semibold">● প্রধান লিড</span>
                            )}
                            {article.isBreaking && (
                              <span className="text-amber-600 font-semibold">● ব্রেকিং</span>
                            )}
                            <span>ভিউ: {toBengaliNumber(article.viewCount)}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-700">{article.category}</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      {article.author.name}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(article.status, article.scheduledAt)}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      {getBengaliRelativeTime(article.publishedAt)}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Publish/Unpublish Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(article)}
                          disabled={statusUpdatingId === article.id}
                          className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                            article.status === 'published'
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                          title={article.status === 'published' ? 'খসড়ায় রূপান্তর' : 'প্রকাশ করুন'}
                        >
                          {statusUpdatingId === article.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : article.status === 'published' ? (
                            'আনপাবলিশ'
                          ) : (
                            'পাবলিশ'
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => onPreviewArticle(article)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                          title="প্রিভিউ দেখুন"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditArticle(article)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          title="সম্পাদনা করুন"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(article)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-500">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-serif-bn text-slate-700">কোনো সংবাদ পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400 mt-1">
              আপনার ফিল্টার মান পরিবর্তন করুন বা নতুন সংবাদ যোগ করুন।
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-lg shadow-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold font-serif-bn">সংবাদ মুছে ফেলার নিশ্চিতকরণ</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              আপনি কি নিশ্চিত যে &lsquo;<strong>{deleteTarget.title}</strong>&rsquo; সংবাদটি সম্পূর্ণ মুছে ফেলতে চান? এই কাজটি আর পূর্বাবস্থায় ফিরিয়ে আনা সম্ভব হবে না।
            </p>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>হ্যাঁ, মুছে ফেলুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
