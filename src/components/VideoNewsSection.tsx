import React from 'react';
import { Play, Video, ChevronRight, Eye } from 'lucide-react';
import { VideoReport } from '../types';
import { getSafeImageUrl, handleImageError, DEFAULT_NEWS_FALLBACK_IMAGE } from '../utils/imageUtils';

interface VideoNewsSectionProps {
  videos: VideoReport[];
  onSelectVideo: (video: VideoReport) => void;
  onViewAllVideos: () => void;
}

export const VideoNewsSection: React.FC<VideoNewsSectionProps> = ({
  videos,
  onSelectVideo,
  onViewAllVideos,
}) => {
  return (
    <section className="py-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-3 border-b-2 border-red-600 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-600 text-white rounded">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif-bn">
                ভিডিও সংবাদ
              </h3>
              <p className="text-xs text-slate-500">বিশেষ প্রতিবেদন ও ভিডিও বুলেটিন</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onViewAllVideos}
            className="text-xs sm:text-sm font-semibold text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>সব ভিডিও</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.slice(0, 4).map((video) => (
            <div
              key={video.id}
              onClick={() => onSelectVideo(video)}
              className="group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/9 rounded overflow-hidden bg-slate-900 mb-3 shadow-xs">
                  <img
                    src={getSafeImageUrl(video.thumbnail)}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                    onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                  />
                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  {/* Duration */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    {video.duration}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-red-600">{video.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{video.viewCount} ভিউ</span>
                </div>

                <h4 className="font-bold text-slate-900 group-hover:text-red-700 transition-colors text-sm sm:text-base font-serif-bn line-clamp-2 leading-snug">
                  {video.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
