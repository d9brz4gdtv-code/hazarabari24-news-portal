import React, { useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { VideoReport } from '../types';
import { getSafeImageUrl, handleImageError, DEFAULT_NEWS_FALLBACK_IMAGE } from '../utils/imageUtils';

interface VideoPlayerModalProps {
  video: VideoReport | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="relative max-w-4xl w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
        {/* Top bar */}
        <div className="p-3 sm:p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-red-600 font-bold px-2 py-0.5 rounded">
              ভিডিও প্রতিবেদন
            </span>
            <h3 className="text-sm sm:text-base font-bold font-serif-bn truncate max-w-md">
              {video.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Player Display Screen */}
        <div className="relative aspect-16/9 bg-black flex items-center justify-center overflow-hidden">
          <img
            src={getSafeImageUrl(video.thumbnail)}
            alt={video.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isPlaying ? 'opacity-85' : 'opacity-40'
            }`}
            onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
          />

          {/* Animated Overlay or Play state */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent">
            <div className="flex items-center justify-between">
              <span className="text-xs bg-red-600 text-white font-semibold px-2 py-0.5 rounded">
                হাজরাবাড়ী ২৪ ডিজিটাল টিভি
              </span>
            </div>

            {/* Play Button center */}
            <div className="self-center">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
                aria-label={isPlaying ? 'বিরতি' : 'চালু'}
              >
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-current ml-1" />}
              </button>
            </div>

            {/* Simulated Player Controls Bar */}
            <div className="bg-slate-900/90 rounded-md p-3 border border-slate-800 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-red-400"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-red-400"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="w-32 sm:w-64 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full bg-red-600 ${isPlaying ? 'w-2/5 animate-pulse' : 'w-1/4'}`}></div>
                </div>
                <span className="text-slate-400">{video.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>{video.viewCount} ভিউ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Summary */}
        <div className="p-4 bg-slate-900 text-slate-200">
          <h4 className="text-base sm:text-lg font-bold font-serif-bn mb-1">
            {video.title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {video.summary}
          </p>
        </div>
      </div>
    </div>
  );
};
