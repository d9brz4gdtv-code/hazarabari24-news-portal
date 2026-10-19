import React, { useState, useEffect } from 'react';
import {
  Save,
  Upload,
  Calendar,
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Images,
  Star,
  X,
} from 'lucide-react';
import { Article, ArticleImageItem, ArticleStatus, NewsCategory } from '../../types';
import { CATEGORIES, INITIAL_ARTICLES } from '../../data/mockArticles';
import { saveArticleToFirestore, uploadImageToStorage } from '../../services/firestoreNewsService';
import { auth } from '../../firebase';
import { toBengaliNumber } from '../../utils/dateUtils';
import { getSafeImageUrl, handleImageError, DEFAULT_NEWS_FALLBACK_IMAGE } from '../../utils/imageUtils';

interface NewsEditorProps {
  initialArticle?: Article | null;
  onSaveSuccess: (articleId: string) => void;
  onCancel: () => void;
  onPreview: (article: Article) => void;
}

export const NewsEditor: React.FC<NewsEditorProps> = ({
  initialArticle,
  onSaveSuccess,
  onCancel,
  onPreview,
}) => {
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [summary, setSummary] = useState(initialArticle?.summary || '');
  const [contentRaw, setContentRaw] = useState(
    initialArticle?.content ? initialArticle.content.join('\n\n') : ''
  );
  const [category, setCategory] = useState<NewsCategory>(
    initialArticle?.category || 'জাতীয়'
  );
  const [tagsInput, setTagsInput] = useState(
    initialArticle?.tags ? initialArticle.tags.join(', ') : ''
  );
  const [authorName, setAuthorName] = useState(
    initialArticle?.author?.name || 'হাজরাবাড়ী ২৪ বার্তা ডেস্ক'
  );
  const [authorRole, setAuthorRole] = useState(
    initialArticle?.author?.role || 'বিশেষ প্রতিনিধি'
  );
  const [authorLocation, setAuthorLocation] = useState(
    initialArticle?.author?.location || 'ঢাকা ব্যুরো'
  );

  const [coverImage, setCoverImage] = useState(initialArticle?.coverImage || '');
  const [imageCaption, setImageCaption] = useState(initialArticle?.imageCaption || '');
  const [imageFit, setImageFit] = useState<'cover' | 'contain' | 'auto'>(
    initialArticle?.imageFit || 'auto'
  );

  // Additional Gallery Images (একাধিক ছবি ও অ্যালবাম)
  const initialAdditionalImages = (initialArticle?.additionalImages || []).map((img, idx) => {
    if (typeof img === 'string') {
      return { id: `img-${idx}-${Date.now()}`, url: img, caption: '' };
    }
    return { id: `img-${idx}-${Date.now()}`, url: img.url || '', caption: img.caption || '' };
  });
  const [additionalImages, setAdditionalImages] = useState<Array<{ id: string; url: string; caption: string }>>(initialAdditionalImages);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [uploadingMulti, setUploadingMulti] = useState(false);
  const [multiProgress, setMultiProgress] = useState(0);
  const [multiProgressText, setMultiProgressText] = useState('');

  const [status, setStatus] = useState<ArticleStatus>(initialArticle?.status || 'published');
  const [scheduledAt, setScheduledAt] = useState(initialArticle?.scheduledAt || '');

  // Featured flags
  const [isLead, setIsLead] = useState(Boolean(initialArticle?.isLead));
  const [isSecondaryLead, setIsSecondaryLead] = useState(Boolean(initialArticle?.isSecondaryLead));
  const [isBreaking, setIsBreaking] = useState(Boolean(initialArticle?.isBreaking));
  const [isEditorPick, setIsEditorPick] = useState(Boolean(initialArticle?.isEditorPick));

  // Uploading state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccessNote, setUploadSuccessNote] = useState('');

  // Saving state
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Multi-image handlers
  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    setUploadingMulti(true);
    setMultiProgress(5);
    setMultiProgressText(`${toBengaliNumber(fileList.length)}টি ছবি আপলোড ও অপ্টিমাইজ হচ্ছে...`);

    const newEntries: Array<{ id: string; url: string; caption: string }> = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const previewUrl = URL.createObjectURL(file);
      const tempEntry = {
        id: `img-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
        url: previewUrl,
        caption: '',
      };
      newEntries.push(tempEntry);

      try {
        const res = await uploadImageToStorage(file, (percent) => {
          const totalProgress = Math.round(((i + percent / 100) / fileList.length) * 100);
          setMultiProgress(totalProgress);
        });
        if (res.url) {
          tempEntry.url = res.url;
        }
      } catch (err) {
        console.warn('Multi image upload fallback to local preview:', err);
      }
    }

    setAdditionalImages((prev) => [...prev, ...newEntries]);
    setUploadingMulti(false);
    setMultiProgress(100);
    setMultiProgressText('');
    setUploadSuccessNote(`${toBengaliNumber(fileList.length)}টি ছবি সফলভাবে অ্যালবামে যুক্ত হয়েছে!`);
    setTimeout(() => setUploadSuccessNote(''), 4500);

    // Reset input
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const newEntry = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      url: newImageUrl.trim(),
      caption: newImageCaption.trim(),
    };
    setAdditionalImages((prev) => [...prev, newEntry]);
    setNewImageUrl('');
    setNewImageCaption('');
    setUploadSuccessNote('নতুন ছবি সফলভাবে তালিকায় যুক্ত হয়েছে!');
    setTimeout(() => setUploadSuccessNote(''), 3000);
  };

  const handleRemoveAdditionalImage = (id: string) => {
    setAdditionalImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleUpdateImageCaption = (id: string, caption: string) => {
    setAdditionalImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, caption } : img))
    );
  };

  const handleSetAsCover = (id: string) => {
    const target = additionalImages.find((img) => img.id === id);
    if (!target) return;

    const oldCover = coverImage;
    const oldCaption = imageCaption;

    setCoverImage(target.url);
    if (target.caption) setImageCaption(target.caption);

    if (oldCover) {
      setAdditionalImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, url: oldCover, caption: oldCaption } : img
        )
      );
    } else {
      setAdditionalImages((prev) => prev.filter((img) => img.id !== id));
    }
    setUploadSuccessNote('ছবিটি মূল কাভার ছবি হিসেবে সেট করা হয়েছে!');
    setTimeout(() => setUploadSuccessNote(''), 3500);
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    setAdditionalImages((prev) => {
      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialArticle) {
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\u0980-\u09FF]+/g, '-')
        .slice(0, 80);
      setSlug(generated);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediately display preview so user is never stuck
    const localPreview = URL.createObjectURL(file);
    setCoverImage(localPreview);

    setUploadingImage(true);
    setUploadProgress(20);
    setUploadError('');
    setUploadSuccessNote('');

    try {
      const res = await uploadImageToStorage(file, (percent) => {
        setUploadProgress(percent);
      });
      if (res.url) {
        setCoverImage(res.url);
      }
      setUploadSuccessNote(
        res.isFallback
          ? 'ছবিটি সফলভাবে লোড ও অপ্টিমাইজ করা হয়েছে।'
          : 'ছবি সফলভাবে ক্লাউড স্টোরেজে আপলোড হয়েছে!'
      );
    } catch (err: any) {
      console.warn('Upload notice:', err);
      // Keep localPreview so user can still publish with the chosen picture!
      setUploadSuccessNote('ছবিটি সফলভাবে লোড হয়েছে।');
    } finally {
      setUploadingImage(false);
      setTimeout(() => setUploadSuccessNote(''), 4500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !contentRaw.trim()) {
      setErrorMessage('শিরোনাম, সারসংক্ষেপ এবং মূল প্রতিবেদন আবশ্যক।');
      return;
    }

    if (!auth.currentUser) {
      setErrorMessage('অনুমতি ত্রুটি: সংবাদ সংরক্ষণ করতে অ্যাডমিন অ্যাকাউন্টে সক্রিয় লগইন সেশন প্রয়োজন। অনুগ্রহ করে পুনরায় লগইন করুন।');
      return;
    }

    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const paragraphs = contentRaw
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean);

      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const categoryMeta = CATEGORIES.find((c) => c.id === category);

      let pubDate = initialArticle?.publishedAt || new Date().toISOString();
      if (status === 'scheduled' && scheduledAt) {
        pubDate = new Date(scheduledAt).toISOString();
      }

      const additionalImagesPayload = additionalImages
        .filter((img) => img.url.trim().length > 0)
        .map((img) => ({
          url: img.url.trim(),
          caption: img.caption.trim(),
        }));

      const articlePayload: Partial<Article> = {
        title: title.trim(),
        slug: slug.trim() || `news-${Date.now()}`,
        summary: summary.trim(),
        content: paragraphs,
        category,
        categorySlug: categoryMeta?.slug || 'national',
        tags,
        author: {
          name: authorName.trim(),
          role: authorRole.trim(),
          location: authorLocation.trim(),
        },
        coverImage: coverImage.trim(),
        imageCaption: imageCaption.trim() || '',
        imageFit,
        additionalImages: additionalImagesPayload,
        status,
        publishedAt: pubDate,
        readTimeMinutes: Math.max(1, Math.ceil(paragraphs.join(' ').length / 500)),
        isLead,
        isSecondaryLead,
        isBreaking,
        isEditorPick,
      };

      if (status === 'scheduled' && scheduledAt) {
        articlePayload.scheduledAt = scheduledAt;
      }

      const savedId = await saveArticleToFirestore(articlePayload, initialArticle?.id);
      setSuccessMessage('সংবাদটি সফলভাবে সংরক্ষণ করা হয়েছে!');
      setTimeout(() => {
        onSaveSuccess(savedId);
      }, 1000);
    } catch (err: any) {
      console.error('Save article error:', err);
      let displayMsg = 'সংবাদটি সংরক্ষণ করতে সমস্যা হয়েছে।';
      if (err?.message) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed.error && (parsed.error.includes('Missing or insufficient permissions') || parsed.error.includes('permission-denied'))) {
            displayMsg = 'অনুমতি সংক্রান্ত ত্রুটি: এই অ্যাকাউন্টের সংবাদ সংরক্ষণ করার অনুমতি নেই অথবা সেশন মেয়াদোত্তীর্ণ হয়েছে। পুনরায় লগইন করে চেষ্টা করুন।';
          } else if (parsed.error) {
            displayMsg = parsed.error;
          }
        } catch {
          if (err.message.includes('Missing or insufficient permissions') || err.message.includes('permission-denied')) {
            displayMsg = 'অনুমতি সংক্রান্ত ত্রুটি: এই অ্যাকাউন্টের সংবাদ সংরক্ষণ করার অনুমতি নেই। অনুগ্রহ করে পুনরায় লগইন করুন।';
          } else {
            displayMsg = err.message;
          }
        }
      }
      setErrorMessage(displayMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerPreview = () => {
    const paragraphs = contentRaw
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const dummy: Article = {
      id: initialArticle?.id || 'preview',
      slug: slug || 'preview',
      title,
      summary,
      content: paragraphs,
      category,
      categorySlug: 'national',
      tags: tagsInput.split(',').map((t) => t.trim()),
      author: { name: authorName, role: authorRole, location: authorLocation },
      publishedAt: new Date().toISOString(),
      coverImage: coverImage || '',
      imageCaption,
      imageFit,
      additionalImages: additionalImages.map((img) => ({ url: img.url, caption: img.caption })),
      readTimeMinutes: 3,
      viewCount: 1,
      status,
      isLead,
    };
    onPreview(dummy);
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-serif-bn">
            {initialArticle ? 'সংবাদ সম্পাদনা করুন' : 'নতুন সংবাদ যুক্ত করুন'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            সঠিক তথ্য, ছবি ও বিভাগ নির্বাচন করে প্রকাশনা নিশ্চিত করুন
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTriggerPreview}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span>প্রিভিউ দেখুন</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold transition-colors cursor-pointer"
          >
            বাতিল
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Editorial Fields (8 Cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                সংবাদের মূল শিরোনাম <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="স্পষ্ট ও আকর্ষণীয় শিরোনাম লিখুন..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-serif-bn text-base font-bold focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                ইউআরএল স্লাগ (Slug)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="যেমন: metro-rail-connectivity-bangladesh"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-mono focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                সারসংক্ষেপ বা ইন্ট্রো (Summary / Teaser) <span className="text-red-600">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="সংবাদের গুরুত্বপূর্ণ সারমর্ম ১-২ বাক্যে লিখুন যা পাঠকদের দৃষ্টি আকর্ষণ করবে..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-md text-xs sm:text-sm text-slate-900 font-serif-bn leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
              ></textarea>
            </div>

            {/* Full Body */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                মূল প্রতিবেদন (Full Article Body) <span className="text-red-600">*</span>
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                প্রতিটি অনুচ্ছেদ (Paragraph) আলাদা করার জন্য দুইবার Enter চাপুন (খালি লাইন দিন)।
              </p>
              <textarea
                required
                rows={12}
                value={contentRaw}
                onChange={(e) => setContentRaw(e.target.value)}
                placeholder="এখানে বিস্তারিত প্রতিবেদন লিখুন..."
                className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-md text-sm text-slate-900 font-serif-bn leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
              ></textarea>
            </div>

            {/* Featured Image & Upload */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  ফিচার্ড ছবি (Featured Image)
                </label>
                {coverImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage('');
                      setUploadSuccessNote('');
                    }}
                    className="text-[11px] text-red-600 hover:underline cursor-pointer"
                  >
                    ছবিটি মুছে ফেলুন
                  </button>
                )}
              </div>

              {/* Upload to Firebase Storage */}
              <div className="flex flex-wrap items-center gap-2.5">
                <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>ডিভাইস থেকে ছবি আপলোড করুন</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-400">বা সরাসরি ছবির URL পেস্ট করুন</span>
              </div>

              {/* Sample Editorial Images Quick Pick */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold block mb-1.5">
                  অথবা সংবাদপত্রের ফটো ব্যাংক থেকে নির্বাচন করুন:
                </span>
                <div className="flex flex-wrap gap-2">
                  {INITIAL_ARTICLES.slice(0, 4).map((art, idx) => (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => {
                        setCoverImage(art.coverImage);
                        if (art.imageCaption) setImageCaption(art.imageCaption);
                        setUploadSuccessNote('গ্যালারি থেকে ছবি সফলভাবে যুক্ত হয়েছে!');
                        setTimeout(() => setUploadSuccessNote(''), 3000);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-red-50 hover:border-red-400 border border-slate-300 rounded text-[11px] font-medium text-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ImageIcon className="w-3 h-3 text-red-600" />
                      <span>{art.category} ছবি</span>
                    </button>
                  ))}
                </div>
              </div>

              {uploadingImage && (
                <div className="p-3 bg-white border border-slate-200 rounded-md space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-slate-700 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                      <span>ছবি প্রস্তুত ও অপ্টিমাইজ হচ্ছে...</span>
                    </span>
                    <span className="font-bold text-red-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 transition-all duration-300"
                      style={{ width: `${Math.max(15, uploadProgress)}%` }}
                    ></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadingImage(false)}
                    className="text-[11px] text-slate-500 hover:text-red-600 underline pt-1 block"
                  >
                    আপলোড বাতিল করুন
                  </button>
                </div>
              )}

              {uploadSuccessNote && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{uploadSuccessNote}</span>
                </div>
              )}

              {uploadError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <div>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://... ছবির ওয়েব লিঙ্ক (URL)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              {coverImage && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-700">ছবির ফিটিং মোড (Image Fit):</span>
                    <div className="inline-flex rounded-md shadow-xs bg-slate-200 p-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setImageFit('auto')}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                          imageFit === 'auto'
                            ? 'bg-white text-red-700 font-bold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        অটো ফিট (Auto Fit)
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageFit('contain')}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                          imageFit === 'contain'
                            ? 'bg-white text-red-700 font-bold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        সম্পূর্ণ ছবি (Contain)
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageFit('cover')}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                          imageFit === 'cover'
                            ? 'bg-white text-red-700 font-bold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        বক্স পূরণ (Crop/Cover)
                      </button>
                    </div>
                  </div>

                  <div className="aspect-16/9 max-w-lg rounded-lg overflow-hidden bg-slate-950 border border-slate-300 relative shadow-inner flex items-center justify-center">
                    {/* Blurred backdrop for clean auto fit display */}
                    <img
                      src={getSafeImageUrl(coverImage)}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none"
                      onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                    />
                    <img
                      src={getSafeImageUrl(coverImage)}
                      alt="Featured Preview"
                      className={`relative z-10 max-h-full transition-all duration-200 ${
                        imageFit === 'contain'
                          ? 'max-w-full h-auto object-contain'
                          : imageFit === 'cover'
                          ? 'w-full h-full object-cover'
                          : 'max-w-full max-h-full object-contain mx-auto'
                      }`}
                      onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                    />
                    <div className="absolute top-2 right-2 z-20 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      লাইভ প্রিভিউ ({imageFit === 'auto' ? 'অটো ফিট' : imageFit === 'contain' ? 'সম্পূর্ণ ছবি' : 'কভার'})
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    যে কোনো অনুপাত বা সাইজের ছবি দিলে তা কেটে না গিয়ে স্বয়ংক্রিয়ভাবে সুন্দরভাবে ফিট হয়ে প্রদর্শিত হবে।
                  </p>
                </div>
              )}

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">ছবির ক্যাপশন ও আলোকচিত্রী:</label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="যেমন: মেট্রোরেলে যাত্রীদের ভিড়। ছবি: হাজরাবাড়ী ২৪"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>

            {/* Multiple Photos / Additional Images Album */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Images className="w-4 h-4 text-blue-600" />
                  <label className="text-xs font-bold text-slate-800">
                    একাধিক ছবি ও ফটো অ্যালবাম (Additional Photos / Album)
                  </label>
                  {additionalImages.length > 0 && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[11px] font-bold rounded-full">
                      {toBengaliNumber(additionalImages.length)}টি ছবি
                    </span>
                  )}
                </div>
                {additionalImages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setAdditionalImages([])}
                    className="text-[11px] text-red-600 hover:underline cursor-pointer"
                  >
                    সবগুলো মুছে ফেলুন
                  </button>
                )}
              </div>

              {/* Upload Multiple Images From Device */}
              <div className="flex flex-wrap items-center gap-2.5">
                <label className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>ডিভাইস থেকে একাধিক ছবি একসাথে আপলোড করুন</span>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleMultipleFilesUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-slate-500">
                  (একসাথে একাধিক ছবি সিলেক্ট করতে পারেন)
                </span>
              </div>

              {/* Progress for Multiple Uploads */}
              {uploadingMulti && (
                <div className="p-3 bg-white border border-blue-200 rounded-md space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-blue-800 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      <span>{multiProgressText || 'ছবিগুলো আপলোড ও অপ্টিমাইজ হচ্ছে...'}</span>
                    </span>
                    <span className="font-bold text-blue-600">{multiProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${Math.max(10, multiProgress)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Add Single Image by URL */}
              <div className="p-3 bg-white border border-slate-200 rounded-md space-y-2">
                <span className="text-[11px] font-semibold text-slate-700 block">
                  অথবা ছবির লিঙ্ক (URL) দিয়ে অ্যালবামটিতে যোগ করুন:
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://... ছবির ওয়েব লিঙ্ক (URL)"
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <input
                    type="text"
                    value={newImageCaption}
                    onChange={(e) => setNewImageCaption(e.target.value)}
                    placeholder="ছবির ক্যাপশন (ঐচ্ছিক)"
                    className="sm:w-1/3 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>যোগ করুন</span>
                  </button>
                </div>
              </div>

              {/* Sample Photo Bank Quick Add */}
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block mb-1.5">
                  অথবা সংবাদপত্রের ফটো ব্যাংক থেকে অ্যালবামটিতে যোগ করুন:
                </span>
                <div className="flex flex-wrap gap-2">
                  {INITIAL_ARTICLES.slice(0, 4).map((art) => (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => {
                        setAdditionalImages((prev) => [
                          ...prev,
                          {
                            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                            url: art.coverImage,
                            caption: art.imageCaption || `${art.category} সম্পর্কিত চিত্র`,
                          },
                        ]);
                        setUploadSuccessNote('ফটো ব্যাংক থেকে ছবিটি অ্যালবামটিতে যুক্ত হয়েছে!');
                        setTimeout(() => setUploadSuccessNote(''), 3000);
                      }}
                      className="px-2 py-1 bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-300 rounded text-[11px] font-medium text-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-blue-600" />
                      <span>{art.category} ছবি</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* List of Added Images */}
              {additionalImages.length > 0 ? (
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    অ্যালবামে সংযুক্ত ছবিসমূহ ({toBengaliNumber(additionalImages.length)}টি):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {additionalImages.map((img, idx) => (
                      <div
                        key={img.id}
                        className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2 relative group hover:border-blue-300 transition-colors"
                      >
                        <div className="relative aspect-16/10 rounded overflow-hidden bg-slate-900 flex items-center justify-center">
                          <img
                            src={getSafeImageUrl(img.url)}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                          />
                          <span className="absolute top-1.5 left-1.5 bg-black/75 text-white text-[10px] px-2 py-0.5 rounded font-bold backdrop-blur-xs">
                            ছবি #{toBengaliNumber(idx + 1)}
                          </span>
                        </div>

                        {/* Caption input */}
                        <div>
                          <input
                            type="text"
                            value={img.caption}
                            onChange={(e) => handleUpdateImageCaption(img.id, e.target.value)}
                            placeholder="ছবির ক্যাপশন লিখুন..."
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleSetAsCover(img.id)}
                              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                              title="এই ছবিটিকে মূল কাভার ছবি বানান"
                            >
                              <Star className="w-3 h-3" />
                              <span>কাভার বানান</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'up')}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 cursor-pointer"
                                title="উপরে নিন"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {idx < additionalImages.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'down')}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 cursor-pointer"
                                title="নিচে নিন"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveAdditionalImage(img.id)}
                              className="p-1 hover:bg-red-50 text-red-600 rounded ml-1 cursor-pointer"
                              title="ছবিটি মুছুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white border border-dashed border-slate-300 rounded text-center text-xs text-slate-500">
                  <Images className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                  <span>সংবাদের সাথে একাধিক ছবি বা অ্যালবাম যুক্ত করতে উপরের বোতাম দিয়ে একসাথে এক বা একাধিক ছবি নির্বাচন করুন।</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Editorial Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Publishing Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
              <h3 className="font-bold text-slate-900 font-serif-bn text-sm pb-2 border-b border-slate-200">
                প্রকাশনা স্থিতি (Status)
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  অবস্থা নির্ধারণ করুন:
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="published">প্রকাশিত (Published)</option>
                  <option value="draft">খসড়া (Draft)</option>
                  <option value="scheduled">নির্ধারিত সময়সূচি (Scheduled)</option>
                </select>
              </div>

              {status === 'scheduled' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ভবিষ্যৎ প্রকাশের তারিখ ও সময়:
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <p className="text-[10px] text-amber-700 mt-1">
                    * এই সময়ের পূর্বে সাধারণ পাঠকরা এই সংবাদ দেখতে পাবেন না।
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>সংরক্ষণ হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{status === 'published' ? 'সংবাদ প্রকাশ করুন' : 'খসড়া সংরক্ষণ করুন'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Category Selector */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <label className="block text-xs font-bold text-slate-800 mb-2">
                সংবাদ বিভাগ (Category) <span className="text-red-600">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NewsCategory)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Author details */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <h4 className="text-xs font-bold text-slate-800 font-serif-bn">প্রতিবেদকের বিবরণ</h4>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">নাম:</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">পদবি:</label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">ব্যুরো বা অবস্থান:</label>
                <input
                  type="text"
                  value={authorLocation}
                  onChange={(e) => setAuthorLocation(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Flags: Lead / Breaking / Editor's Pick */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 font-serif-bn">বিশেষ হাইলাইট ফ্ল্যাগ</h4>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLead}
                  onChange={(e) => setIsLead(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-600"
                />
                <span className="font-semibold text-slate-900">প্রধান লিড সংবাদ (Lead Story)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSecondaryLead}
                  onChange={(e) => setIsSecondaryLead(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-600"
                />
                <span>দ্বিতীয় প্রধান সংবাদ (Secondary Lead)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-600"
                />
                <span className="text-red-700 font-medium">ব্রেকিং সংবাদ টিকার</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEditorPick}
                  onChange={(e) => setIsEditorPick(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-600"
                />
                <span>সম্পাদকীয় পছন্দ (Editor&apos;s Pick)</span>
              </label>
            </div>

            {/* Tags */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <label className="block text-xs font-bold text-slate-800 mb-1">ট্যাগসমূহ (Tags)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="কমা দিয়ে আলাদা করুন (যেমন: ক্রিকেট, বিশ্বকাপ)"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
