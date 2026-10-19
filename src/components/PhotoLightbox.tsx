import React from 'react';
import { X, MapPin, Camera, Calendar } from 'lucide-react';
import { GalleryPhoto } from '../types';
import { getSafeImageUrl, handleImageError, DEFAULT_NEWS_FALLBACK_IMAGE } from '../utils/imageUtils';

interface PhotoLightboxProps {
  photo: GalleryPhoto | null;
  onClose: () => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="relative max-w-5xl w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top bar */}
        <div className="p-3 sm:p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-red-600 font-bold px-2.5 py-0.5 rounded uppercase">
              {photo.category}
            </span>
            <h3 className="text-sm sm:text-base font-bold font-serif-bn truncate max-w-md">
              {photo.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image frame */}
        <div className="flex-1 overflow-hidden bg-black flex items-center justify-center p-2">
          <img
            src={getSafeImageUrl(photo.image)}
            alt={photo.title}
            className="max-h-[65vh] w-auto max-w-full object-contain mx-auto"
            onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
          />
        </div>

        {/* Caption & Metadata */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-slate-300">
          <p className="text-sm sm:text-base text-slate-200 font-serif-bn leading-relaxed mb-3">
            {photo.caption}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-red-500" />
              <span>ছবি: {photo.photographer}</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>স্থান: {photo.location}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>তারিখ: {photo.date}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
