import React, { useState } from 'react';
import { Video, ChevronRight, Play, Eye, Clock } from 'lucide-react';
import { VideoReport } from '../types';
import { VIDEO_REPORTS } from '../data/mockArticles';
import { getBengaliRelativeTime } from '../utils/dateUtils';
import { getSafeImageUrl, handleImageError, DEFAULT_NEWS_FALLBACK_IMAGE } from '../utils/imageUtils';

interface VideoPageProps {
  onSelectVideo: (video: VideoReport) => void;
  onNavigateHome: () => void;
}

export const VideoPage: React.FC<VideoPageProps> = ({
  onSelectVideo,
  onNavigateHome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'সারাদেশ', 'খেলাধুলা', 'প্রযুক্তি', 'জাতীয়'];

  const filteredVideos =
    selectedCategory === 'all'
      ? VIDEO_REPORTS
      : VIDEO_REPORTS.filter((v) => v.category === selectedCategory);

  const featuredVideo = VIDEO_REPORTS[0];

  return (
    <div className="py-6 sm:py-8 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 font-medium">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-red-400 transition-colors cursor-pointer"
          >
            প্রচ্ছদ
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-red-500 font-bold">ভিডিও সংবাদ</span>
        </nav>

        {/* Header */}
        <div className="border-b border-slate-800 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-red-500">
              <Video className="w-5 h-5" />
              <span className="text-xs font-bold tracking-widest uppercase">ডিজিটাল ভিডিও বুলেটিন</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-serif-bn">হাজরাবাড়ী ২৪ ভিডিও</h1>
            <p className="text-sm text-slate-400 mt-2 font-serif-bn max-w-xl">
              মাঠপর্যায়ের সরেজমিন অনুসন্ধান, বিশেষ সাক্ষাৎকার ও তাজা খবরের বিশ্লেষণ।
            </p>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === c
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {c === 'all' ? 'সকল ভিডিও' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Video spotlight */}
        {featuredVideo && selectedCategory === 'all' && (
          <div
            onClick={() => onSelectVideo(featuredVideo)}
            className="mb-10 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-red-600 transition-all cursor-pointer group grid grid-cols-1 lg:grid-cols-12"
          >
            <div className="lg:col-span-8 relative aspect-16/9 bg-black overflow-hidden">
              <img
                src={getSafeImageUrl(featuredVideo.thumbnail)}
                alt={featuredVideo.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90"
                onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-mono">
                {featuredVideo.duration}
              </div>
            </div>

            <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs text-red-500 font-bold uppercase tracking-wider block mb-2">
                  প্রধান ভিডিও প্রতিবেদন · {featuredVideo.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-serif-bn group-hover:text-red-400 transition-colors leading-snug mb-3">
                  {featuredVideo.title}
                </h2>
                <p className="text-sm text-slate-400 font-serif-bn leading-relaxed">
                  {featuredVideo.summary}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 border-t border-slate-800 mt-6">
                <span>{featuredVideo.viewCount} ভিউ</span>
                <span>·</span>
                <span>{getBengaliRelativeTime(featuredVideo.publishedAt)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => onSelectVideo(video)}
              className="group cursor-pointer rounded-lg overflow-hidden bg-slate-900 border border-slate-800 hover:border-red-500 transition-all shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/9 overflow-hidden bg-black">
                  <img
                    src={getSafeImageUrl(video.thumbnail)}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    loading="lazy"
                    onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded">
                    {video.duration}
                  </div>
                </div>

                <div className="p-4">
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block mb-1">
                    {video.category}
                  </span>
                  <h3 className="font-bold text-base text-white group-hover:text-red-300 transition-colors font-serif-bn line-clamp-2 mb-2 leading-snug">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-serif-bn line-clamp-2">
                    {video.summary}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>{video.viewCount} ভিউ</span>
                <span>{getBengaliRelativeTime(video.publishedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
