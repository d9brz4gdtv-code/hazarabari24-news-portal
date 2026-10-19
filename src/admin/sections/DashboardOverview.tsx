import React, { useState } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  Flame,
  Image as ImageIcon,
  Database,
  Loader2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Article, AdminUser } from '../../types';
import { toBengaliNumber, getBengaliRelativeTime } from '../../utils/dateUtils';
import { seedInitialArticlesToFirestore } from '../../services/firestoreNewsService';

interface DashboardOverviewProps {
  articles: Article[];
  adminUser: AdminUser;
  onNavigateSection: (section: any) => void;
  onEditArticle: (article: Article) => void;
  onRefreshArticles: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  articles,
  adminUser,
  onNavigateSection,
  onEditArticle,
  onRefreshArticles,
}) => {
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);

  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;
  const scheduledCount = articles.filter((a) => a.status === 'scheduled').length;
  const totalViews = articles.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedSuccess(null);
    try {
      const count = await seedInitialArticlesToFirestore();
      setSeedSuccess(`${toBengaliNumber(count)} টি প্রাথমিক সংবাদ ফায়ারস্টোর ডেটাবেজে সফলভাবে সংরক্ষণ করা হয়েছে!`);
      onRefreshArticles();
    } catch (err: any) {
      console.error('Seed error:', err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs uppercase tracking-wider text-red-400 font-bold block mb-1">
            সম্পাদকীয় ড্যাশবোর্ড
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-serif-bn">
            স্বাগতম, {adminUser.displayName || 'সম্মানিত সম্পাদক'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            হাজরাবাড়ী ২৪. কম — সংবাদ প্রকাশনা ও বার্তা কক্ষ সার্বক্ষণিক সক্রিয় রয়েছে।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigateSection('add-news')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন সংবাদ তৈরি করুন</span>
          </button>
        </div>
      </div>

      {seedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{seedSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setSeedSuccess(null)}
            className="text-xs font-bold text-emerald-900 underline"
          >
            ঠিক আছে
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Articles */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">মোট সংবাদ</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-serif-bn">
            {toBengaliNumber(articles.length)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">সকল ক্যাটাগরি মিলিয়ে</span>
        </div>

        {/* Published */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-medium">প্রকাশিত (Published)</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-serif-bn">
            {toBengaliNumber(publishedCount)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">পাঠকদের জন্য উন্মুক্ত</span>
        </div>

        {/* Drafts */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-medium">খসড়া (Draft)</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 font-serif-bn">
            {toBengaliNumber(draftCount)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">সম্পাদনার অপেক্ষায়</span>
        </div>

        {/* Total Views */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-red-600 mb-2">
            <span className="text-xs font-medium">মোট পাঠক ভিউ</span>
            <Eye className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-700 font-serif-bn">
            {toBengaliNumber(totalViews)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">সংবাদ পাঠের সংখ্যা</span>
        </div>
      </div>

      {/* Database Seeder helper banner if database has few items */}
      <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-100 text-red-700 rounded-lg shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-serif-bn">
              ফায়ারস্টোর ডেটাবেজ ইনিশিয়ালাইজেশন
            </h4>
            <p className="text-xs text-slate-500">
              একটি ক্লিকেই জাতীয়, রাজনীতি, খেলাধুলা সহ ১২টি বিভাগের ডেমো সংবাদগুলো আপনার ফায়ারস্টোরে আপলোড করুন।
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={seeding}
          onClick={handleSeed}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          {seeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
          <span>ফায়ারস্টোরে সিড করুন</span>
        </button>
      </div>

      {/* Recent News table preview */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h3 className="font-black text-slate-900 font-serif-bn text-lg">
            সাম্প্রতিক ৫টি সংবাদ
          </h3>
          <button
            type="button"
            onClick={() => onNavigateSection('news')}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            <span>সবগুলো দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {articles.slice(0, 5).map((art) => (
            <div
              key={art.id}
              className="py-3 flex items-center justify-between gap-4 group hover:bg-slate-50/50 px-2 rounded"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="font-bold text-red-600">{art.category}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{getBengaliRelativeTime(art.publishedAt)}</span>
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-red-700 font-serif-bn truncate text-sm">
                  {art.title}
                </h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    art.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {art.status === 'published' ? 'প্রকাশিত' : 'খসড়া'}
                </span>
                <button
                  type="button"
                  onClick={() => onEditArticle(art)}
                  className="text-xs text-blue-600 hover:underline cursor-pointer font-medium"
                >
                  সম্পাদনা
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
