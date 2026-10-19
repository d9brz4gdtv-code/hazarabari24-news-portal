import React, { useState } from 'react';
import { Camera, ChevronRight, MapPin, Calendar, Maximize2 } from 'lucide-react';
import { GalleryPhoto } from '../types';
import { GALLERY_PHOTOS } from '../data/mockArticles';
import { getSafeImageUrl, handleImageError, DEFAULT_NEWS_FALLBACK_IMAGE } from '../utils/imageUtils';

interface GalleryPageProps {
  onSelectPhoto: (photo: GalleryPhoto) => void;
  onNavigateHome: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onSelectPhoto,
  onNavigateHome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'প্রকৃতি ও জীবন', 'খেলাধুলা', 'মহানগর', 'বিজ্ঞান ও প্রযুক্তি'];

  const filteredPhotos =
    selectedCategory === 'all'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p) => p.category === selectedCategory);

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
          <span className="text-red-500 font-bold">ফটো গ্যালারি</span>
        </nav>

        {/* Gallery Header */}
        <div className="border-b border-slate-800 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-red-500">
              <Camera className="w-5 h-5" />
              <span className="text-xs font-bold tracking-widest uppercase">ফটো ফিচার ও প্রদর্শনী</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-serif-bn">ছবিতে বাংলাদেশ ও বিশ্ব</h1>
            <p className="text-sm text-slate-400 mt-2 font-serif-bn max-w-xl">
              হাজরাবাড়ী ২৪-এর ফটো সাংবাদিকদের ক্যামেরায় ধরা পড়া অবিস্মরণীয় মুহূর্ত ও প্রাকৃতিক রূপ।
            </p>
          </div>

          {/* Filter tabs */}
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
                {c === 'all' ? 'সকল ছবি' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto(photo)}
              className="group cursor-pointer rounded-lg overflow-hidden bg-slate-900 border border-slate-800 hover:border-red-500 transition-all shadow-lg flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
                <img
                  src={getSafeImageUrl(photo.image)}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                />
                <div className="absolute top-3 right-3 bg-black/60 p-1.5 rounded-full text-white/80 group-hover:text-white group-hover:bg-red-600 transition-all">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block mb-1">
                    {photo.category}
                  </span>
                  <h3 className="font-bold text-base text-white group-hover:text-red-300 transition-colors font-serif-bn mb-2">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-serif-bn line-clamp-2 mb-3">
                    {photo.caption}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <Camera className="w-3 h-3 text-red-500" />
                    <span>{photo.photographer}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{photo.location}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
