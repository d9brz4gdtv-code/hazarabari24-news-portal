import React, { useState, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  Trash2,
  Loader2,
  Calendar,
  HardDrive,
  AlertCircle,
} from 'lucide-react';
import { MediaItem } from '../../types';
import { getMediaLibrary, uploadImageToStorage } from '../../services/firestoreNewsService';
import { getBengaliRelativeTime, toBengaliNumber } from '../../utils/dateUtils';
import { getSafeImageUrl, handleImageError, DEFAULT_NEWS_FALLBACK_IMAGE } from '../../utils/imageUtils';

export const MediaManager: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const items = await getMediaLibrary();
      setMediaList(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(20);
    setUploadError('');

    try {
      await uploadImageToStorage(file, (pct) => setProgress(pct));
      await loadMedia();
    } catch (err: any) {
      console.warn('Upload error:', err);
      setUploadError(err.message || 'ছবি আপলোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '০ KB';
    const kb = Math.round(bytes / 1024);
    if (kb < 1000) return `${toBengaliNumber(kb)} KB`;
    return `${toBengaliNumber((kb / 1024).toFixed(1))} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-serif-bn">
            মিডিয়া লাইব্রেরি (Media Library)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ফায়ারবেস ক্লাউড স্টোরেজে আপলোডকৃত সকল প্রেস ছবি ও গ্রাফিক্স ফাইল
          </p>
        </div>

        <label className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs shrink-0">
          <Upload className="w-4 h-4" />
          <span>নতুন ছবি আপলোড করুন</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {uploading && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
          <div className="flex justify-between text-xs text-slate-700 font-medium">
            <span>ফায়ারবেস ক্লাউড স্টোরেজে আপলোড সম্পন্ন হচ্ছে...</span>
            <span>{toBengaliNumber(progress)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-red-600" />
          <p className="text-xs">মিডিয়া ফাইলসমূহ লোড হচ্ছে...</p>
        </div>
      ) : mediaList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden group hover:border-red-400 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="aspect-16/10 bg-slate-100 overflow-hidden relative">
                <img
                  src={getSafeImageUrl(item.url)}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                />
              </div>

              <div className="p-2.5 bg-white border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-800 truncate" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>{formatSize(item.size)}</span>
                  <span>{getBengaliRelativeTime(item.uploadedAt)}</span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className="text-[11px] text-slate-600 hover:text-red-600 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">কপি হয়েছে</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>লিংক কপি</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-slate-50 border border-slate-200 rounded-xl">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-700 font-serif-bn text-sm">কোনো ছবি পাওয়া যায়নি</h4>
          <p className="text-xs text-slate-400 mt-1">
            উপরে থাকা &lsquo;নতুন ছবি আপলোড করুন&rsquo; বাটনে ক্লিক করে প্রথম ছবি আপলোড করুন।
          </p>
        </div>
      )}
    </div>
  );
};
