import React from 'react';
import { Camera, ChevronRight, Eye } from 'lucide-react';
import { GalleryPhoto } from '../types';
import { getSafeImageUrl, handleImageError, DEFAULT_NEWS_FALLBACK_IMAGE } from '../utils/imageUtils';

interface PhotoGallerySectionProps {
  photos: GalleryPhoto[];
  onSelectPhoto: (photo: GalleryPhoto) => void;
  onViewAllPhotos: () => void;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  photos,
  onSelectPhoto,
  onViewAllPhotos,
}) => {
  return (
    <section className="py-8 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-600 rounded text-white">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-serif-bn">ছবিতে খবর</h3>
              <p className="text-xs text-slate-400">দেশ ও বিদেশের চমৎকার ফটো ফিচার</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onViewAllPhotos}
            className="text-xs sm:text-sm font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>সব ছবি</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {photos.slice(0, 4).map((photo) => (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto(photo)}
              className="group cursor-pointer relative aspect-4/3 rounded overflow-hidden bg-slate-800 border border-slate-800 hover:border-red-500 transition-all"
            >
              <img
                src={getSafeImageUrl(photo.image)}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3.5">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">
                  {photo.category}
                </span>
                <h4 className="font-bold text-sm text-white group-hover:text-red-300 transition-colors font-serif-bn line-clamp-2">
                  {photo.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-700/60">
                  <span>{photo.photographer}</span>
                  <span>{photo.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
