import React, { useState, useEffect } from 'react';
import {
  Clock,
  Share2,
  Bookmark,
  Printer,
  Volume2,
  VolumeX,
  Facebook,
  Twitter,
  Copy,
  Check,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  User,
  MapPin,
  Send,
  Eye,
  Images,
  Maximize2,
  ChevronLeft,
  X,
} from 'lucide-react';
import { Article, CommentItem, NewsCategory } from '../types';
import { getBengaliRelativeTime, toBengaliNumber } from '../utils/dateUtils';
import { AdBanner } from '../components/AdBanner';
import { SocialShareBar, SocialShareCard } from '../components/SocialShareBar';
import { subscribeArticleComments, addArticleComment, likeComment } from '../services/newsService';
import { getSafeImageUrl, handleImageError, DEFAULT_NEWS_FALLBACK_IMAGE } from '../utils/imageUtils';
import { updatePageMetaTags } from '../utils/seo';

interface ArticlePageProps {
  article: Article;
  allArticles: Article[];
  fontSize: 'sm' | 'md' | 'lg';
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  onSelectArticle: (articleId: string) => void;
  onSelectCategory: (category: NewsCategory) => void;
  onNavigateHome: () => void;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({
  article,
  allArticles,
  fontSize,
  setFontSize,
  onSelectArticle,
  onSelectCategory,
  onNavigateHome,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Normalize additional images with safe URLs
  const extraImages: Array<{ url: string; caption?: string }> = (article.additionalImages || [])
    .map((img) =>
      typeof img === 'string'
        ? { url: getSafeImageUrl(img), caption: '' }
        : { url: getSafeImageUrl(img.url), caption: img.caption || '' }
    )
    .filter((img) => img.url && img.url.trim().length > 0);

  // Safe cover image
  const safeCoverImage = getSafeImageUrl(article.coverImage);

  // All photos including cover image for full lightbox album
  const allPhotos: Array<{ url: string; caption?: string }> = [
    ...(safeCoverImage ? [{ url: safeCoverImage, caption: article.imageCaption || article.title }] : []),
    ...extraImages,
  ];

  // Specific article share URL ensuring query parameter ?article=id is included
  const articleShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?article=${article.id}`
    : `https://hazarabari24.com/?article=${article.id}`;

  // Dynamically update document title and social share meta tags (OG Image, Twitter Large Card)
  useEffect(() => {
    const rawContent = typeof article.content === 'string'
      ? article.content
      : Array.isArray(article.content)
      ? article.content.join(' ')
      : '';
    updatePageMetaTags({
      title: article.title,
      description: article.summary || rawContent.slice(0, 150),
      image: '/images/og-image.png',
      type: 'article',
      url: articleShareUrl,
    });
  }, [article.id, article.title, article.summary, articleShareUrl, article.content]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + allPhotos.length) % allPhotos.length : 0));
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allPhotos.length : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, allPhotos.length]);

  // Reader comments state
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 'c-1',
      articleId: article.id,
      authorName: 'মো. তৌহিদুল ইসলাম',
      authorLocation: 'জামালপুর সদর',
      commentText: 'খুবই সময়োপযোগী ও বস্তুনিষ্ঠ প্রতিবেদন। হাজরাবাড়ী ২৪-এর এই নিরপেক্ষ অবস্থান বজায় থাকুক।',
      createdAt: '১ ঘণ্টা আগে',
      likes: 12,
    },
    {
      id: 'c-2',
      articleId: article.id,
      authorName: 'মাহমুদা আক্তার',
      authorLocation: 'ঢাকা',
      commentText: 'উন্নয়ন কাজের গুণগত মান বজায় রাখা অত্যন্ত জরুরি। তথ্যের জন্য ধন্যবাদ।',
      createdAt: '৩ ঘণ্টা আগে',
      likes: 8,
    },
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentLocation, setNewCommentLocation] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Subscribe to real-time comments from Firestore
  useEffect(() => {
    const unsubscribe = subscribeArticleComments(article.id, (firestoreComments) => {
      if (firestoreComments && firestoreComments.length > 0) {
        setComments(firestoreComments);
      }
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [article.id]);

  // Related articles
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 4);

  // Fallback if not enough category-specific articles
  const fallbackRelated =
    relatedArticles.length > 0
      ? relatedArticles
      : allArticles.filter((a) => a.id !== article.id).slice(0, 4);

  // Current index in allArticles to find previous and next articles
  const currentIdx = allArticles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIdx > 0 ? allArticles[currentIdx - 1] : null;
  const nextArticle =
    currentIdx >= 0 && currentIdx < allArticles.length - 1
      ? allArticles[currentIdx + 1]
      : allArticles.length > 1
      ? allArticles.find((a) => a.id !== article.id) || null
      : null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const authorName = newCommentName.trim();
    const authorLocation = newCommentLocation.trim() || 'বাংলাদেশ';
    const commentText = newCommentText.trim();

    // Optimistic local update
    const tempId = `c-${Date.now()}`;
    const newComment: CommentItem = {
      id: tempId,
      articleId: article.id,
      authorName,
      authorLocation,
      commentText,
      createdAt: 'এইমাত্র',
      likes: 1,
    };

    setComments((prev) => [newComment, ...prev]);
    setNewCommentName('');
    setNewCommentLocation('');
    setNewCommentText('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 4000);

    // Save to Firestore
    await addArticleComment(article.id, {
      authorName,
      authorLocation,
      commentText,
    });
  };

  const handleLikeComment = async (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
    );
    await likeComment(article.id, commentId);
  };

  // Font size classes
  const fontBodyClass =
    fontSize === 'sm'
      ? 'text-base leading-relaxed'
      : fontSize === 'lg'
      ? 'text-xl leading-loose'
      : 'text-lg leading-relaxed';

  return (
    <article className="py-6 sm:py-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium no-print">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-red-600 transition-colors cursor-pointer"
          >
            প্রচ্ছদ
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            type="button"
            onClick={() => onSelectCategory(article.category)}
            className="hover:text-red-600 transition-colors font-semibold text-red-600 cursor-pointer"
          >
            {article.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-700 truncate max-w-xs sm:max-w-md">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content (8 cols) */}
          <div className="lg:col-span-8">
            {/* Category Tag & Reading Time */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span className="font-bold text-red-600 uppercase tracking-wide">
                {article.category}
              </span>
              <span aria-hidden="true">·</span>
              <span>পড়ার আনুমানিক সময়: {toBengaliNumber(article.readTimeMinutes)} মিনিট</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Eye className="w-3.5 h-3.5" />
                <span>{toBengaliNumber(article.viewCount)} বার পঠিত</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-black text-slate-950 font-serif-bn leading-tight mb-4">
              {article.title}
            </h1>

            {/* Subtitle / Teaser Summary */}
            <p className="text-base sm:text-xl text-slate-700 font-serif-bn leading-relaxed mb-6 font-normal border-l-4 border-red-600 pl-4 py-1 bg-red-50/40 rounded-r">
              {article.summary}
            </p>

            {/* Byline & Timestamps */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 text-xs text-slate-600 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{article.author.name}</div>
                  <div className="text-slate-500 text-xs">
                    {article.author.role} {article.author.location ? `· ${article.author.location}` : ''}
                  </div>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>প্রকাশ: {getBengaliRelativeTime(article.publishedAt)}</span>
                </div>
                {article.updatedAt && (
                  <div className="text-slate-400 text-[11px]">
                    আপডেট: {getBengaliRelativeTime(article.updatedAt)}
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar (Audio Read, Resizer, Share, Print) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md mb-6 no-print">
              {/* Left group: Audio reading & Font controls */}
              <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                    isPlayingAudio
                      ? 'bg-red-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:text-red-600'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                      <span>থামান</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-red-600" />
                      <span>শুনুন</span>
                    </>
                  )}
                </button>

                {/* Font controls & Print */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 bg-white border border-slate-300 rounded px-1.5 py-0.5">
                    <span className="text-[10px] text-slate-400 mr-0.5">হরফ:</span>
                    <button
                      type="button"
                      onClick={() => setFontSize('sm')}
                      className={`px-1 py-0.5 text-xs rounded font-medium ${
                        fontSize === 'sm' ? 'bg-red-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      ক-
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize('md')}
                      className={`px-1.5 py-0.5 text-xs rounded font-medium ${
                        fontSize === 'md' ? 'bg-red-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      ক
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize('lg')}
                      className={`px-1 py-0.5 text-xs rounded font-medium ${
                        fontSize === 'lg' ? 'bg-red-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      ক+
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="p-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:text-red-600 transition-colors hidden xs:flex items-center justify-center"
                    title="প্রিন্ট করুন"
                    aria-label="প্রিন্ট"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Social Media Share Bar (Facebook, WhatsApp, Twitter) */}
              <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                <span className="text-xs text-slate-500 sm:hidden font-medium">শেয়ার:</span>
                <SocialShareBar title={article.title} summary={article.summary} url={articleShareUrl} />
              </div>
            </div>

            {/* Audio playing message */}
            {isPlayingAudio && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
                  <span>সংবাদটি অডিও আকারে সম্প্রচার হচ্ছে... (ভয়েস ডেমো প্লেয়ার)</span>
                </div>
                <button
                  type="button"
                  onClick={toggleAudio}
                  className="text-red-700 underline font-semibold"
                >
                  থামুন
                </button>
              </div>
            )}

            {/* Featured Image & Caption */}
            <figure className="mb-8">
              <div className="rounded-lg overflow-hidden bg-slate-900 border border-slate-200 shadow-xs relative flex items-center justify-center min-h-[260px] max-h-[540px]">
                {/* Subtle blurred ambient background for non-standard aspect ratios */}
                <img
                  src={safeCoverImage}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110 pointer-events-none"
                  onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                />
                <img
                  src={safeCoverImage}
                  alt={article.title}
                  className={`relative z-10 max-w-full max-h-[540px] transition-all duration-300 ${
                    article.imageFit === 'contain'
                      ? 'h-auto object-contain'
                      : article.imageFit === 'cover'
                      ? 'w-full h-full object-cover'
                      : 'h-auto max-h-[540px] object-contain mx-auto'
                  }`}
                  loading="eager"
                  onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                />
              </div>
              {article.imageCaption && (
                <figcaption className="text-xs text-slate-500 mt-2 px-1 font-serif-bn italic text-center sm:text-left">
                  {article.imageCaption}
                </figcaption>
              )}
            </figure>

            {/* Article Body */}
            <div className={`space-y-6 text-slate-800 font-sans-bn ${fontBodyClass}`}>
              {article.content.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Additional Photo Gallery / Album */}
            {extraImages.length > 0 && (
              <section className="my-8 p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Images className="w-5 h-5 text-red-600" />
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif-bn">
                      সংবাদের আরও ছবি ও অ্যালবাম
                    </h3>
                  </div>
                  <span className="text-xs bg-red-100 text-red-700 font-semibold px-2.5 py-0.5 rounded-full">
                    {toBengaliNumber(extraImages.length)}টি ছবি
                  </span>
                </div>

                <div
                  className={`grid gap-4 ${
                    extraImages.length === 1
                      ? 'grid-cols-1'
                      : extraImages.length === 2
                      ? 'grid-cols-1 sm:grid-cols-2'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  }`}
                >
                  {extraImages.map((img, idx) => (
                    <figure
                      key={idx}
                      className="group cursor-pointer bg-white rounded-lg overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col"
                      onClick={() => setLightboxIndex(article.coverImage ? idx + 1 : idx)}
                      title="বড় করে দেখতে ক্লিক করুন"
                    >
                      <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
                        <img
                          src={img.url}
                          alt={img.caption || article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="p-2 bg-black/60 rounded-full text-white backdrop-blur-xs flex items-center gap-1 text-xs">
                            <Maximize2 className="w-4 h-4" />
                            <span>বড় করে দেখুন</span>
                          </span>
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-sans">
                          ছবি #{toBengaliNumber(idx + 1)}
                        </span>
                      </div>
                      {img.caption && (
                        <figcaption className="p-2.5 text-xs text-slate-700 font-serif-bn italic bg-white border-t border-slate-100 flex-1">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* Tags list */}
            {article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <span className="text-xs font-semibold text-slate-500 mr-2">বিষয়:</span>
                <div className="inline-flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 px-2.5 py-1 rounded cursor-pointer transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Prominent Social Media Sharing Component (Facebook, WhatsApp, Twitter) */}
            <SocialShareCard
              title={article.title}
              summary={article.summary}
              url={articleShareUrl}
              className="mt-8 mb-6"
            />

            {/* Previous and Next Article Navigation (পরের খবর ও আগের খবর) */}
            <div className="my-6 border-y border-slate-200 py-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prevArticle ? (
                <div
                  onClick={() => {
                    onSelectArticle(prevArticle.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-lg transition-all cursor-pointer group flex items-center gap-3"
                  title="আগের খবর পড়তে চাপুন"
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-300 group-hover:bg-red-600 group-hover:border-red-600 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                    <ChevronLeft className="w-4 h-4 text-slate-700 group-hover:text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-red-600 block">
                      পূর্ববর্তী সংবাদ (আগের খবর)
                    </span>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-700 font-serif-bn line-clamp-1">
                      {prevArticle.title}
                    </h5>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:block" />
              )}

              {nextArticle && (
                <div
                  onClick={() => {
                    onSelectArticle(nextArticle.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3 bg-red-50/70 hover:bg-red-100/80 border border-red-200 hover:border-red-400 rounded-lg transition-all cursor-pointer group flex items-center justify-between gap-3 text-right"
                  title="পরের খবর পড়তে চাপুন"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-red-600 block">
                      পরবর্তী সংবাদ (পরের খবর পড়ুন &rarr;)
                    </span>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-950 group-hover:text-red-700 font-serif-bn line-clamp-1">
                      {nextArticle.title}
                    </h5>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-red-600 group-hover:bg-red-700 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile View: Quick Related Stories directly accessible before comments */}
            <div className="lg:hidden my-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b-2 border-red-600 mb-3">
                <h4 className="font-bold text-slate-900 font-serif-bn text-sm">
                  এই বিভাগের অন্যান্য সংবাদ ({article.category})
                </h4>
                <button
                  type="button"
                  onClick={() => onSelectCategory(article.category)}
                  className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
                >
                  সব দেখুন &rarr;
                </button>
              </div>
              <div className="divide-y divide-slate-200">
                {fallbackRelated.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onSelectArticle(rel.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="py-2.5 flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="w-16 h-12 rounded overflow-hidden bg-slate-900 shrink-0 border border-slate-200 relative">
                      <img
                        src={getSafeImageUrl(rel.coverImage)}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-slate-900 group-hover:text-red-700 font-serif-bn line-clamp-2">
                        {rel.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {getBengaliRelativeTime(rel.publishedAt)}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* In-content Advertisement Area */}
            <AdBanner slot="rectangle" />

            {/* Reader Comments Section */}
            <section className="mt-10 pt-8 border-t-2 border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-900 font-serif-bn flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-red-600" />
                  <span>পাঠকের মন্তব্য ({toBengaliNumber(comments.length)})</span>
                </h3>
                <span className="text-xs text-slate-500">মতামত প্রকাশের নিয়ম মেনে লিখুন</span>
              </div>

              {/* Comment submission form */}
              <form onSubmit={handleAddComment} className="p-4 bg-slate-50 border border-slate-200 rounded-md mb-8">
                <h4 className="text-sm font-bold text-slate-800 mb-3 font-serif-bn">আপনার মন্তব্য দিন</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    required
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    placeholder="আপনার পুরো নাম *"
                    className="p-2.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <input
                    type="text"
                    value={newCommentLocation}
                    onChange={(e) => setNewCommentLocation(e.target.value)}
                    placeholder="স্থান বা জেলা (ঐচ্ছিক)"
                    className="p-2.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <textarea
                  required
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="আপনার সুচিন্তিত মতামত লিখুন... (অশালীন বা রাজনৈতিক আক্রমণাত্মক মন্তব্য অনুমোদিত নয়)"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
                ></textarea>

                {commentSuccess && (
                  <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded">
                    আপনার মন্তব্য সফলভাবে প্রকাশিত হয়েছে! ধন্যবাদ।
                  </div>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>মন্তব্য জমা দিন</span>
                </button>
              </form>

              {/* Comments list */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-white border border-slate-200 rounded-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{comment.authorName}</span>
                        {comment.authorLocation && (
                          <span className="text-[11px] text-slate-400">({comment.authorLocation})</span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{comment.createdAt}</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-2 font-serif-bn">
                      {comment.commentText}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleLikeComment(comment.id)}
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-red-600 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>সমর্থন ({toBengaliNumber(comment.likes)})</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Rail: Related Stories & Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Related news in same category */}
            <div className="bg-slate-50 p-5 rounded-md border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b-2 border-red-600 mb-4">
                <h3 className="font-bold text-slate-900 font-serif-bn text-base">
                  এই বিভাগের আরও খবর
                </h3>
                <span className="text-xs text-red-600 font-bold">{article.category}</span>
              </div>

              <div className="space-y-4">
                {fallbackRelated.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectArticle(rel.id)}
                    className="group cursor-pointer flex gap-3 items-start"
                  >
                    <div className="w-20 h-16 rounded overflow-hidden bg-slate-950 shrink-0 border border-slate-200 relative flex items-center justify-center">
                      <img
                        src={getSafeImageUrl(rel.coverImage)}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-sm opacity-25 scale-110 pointer-events-none"
                        onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                      />
                      <img
                        src={getSafeImageUrl(rel.coverImage)}
                        alt={rel.title}
                        className={`relative z-10 transition-transform ${
                          rel.imageFit === 'cover'
                            ? 'w-full h-full object-cover group-hover:scale-105'
                            : 'max-h-full max-w-full object-contain mx-auto'
                        }`}
                        loading="lazy"
                        onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-slate-400 block mb-0.5">
                        {getBengaliRelativeTime(rel.publishedAt)}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors font-serif-bn line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advertisement Sidebar */}
            <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                বিজ্ঞাপন
              </span>
              <div className="py-8 bg-white border border-slate-200 rounded">
                <p className="text-xs text-slate-600 font-serif-bn font-semibold">
                  হাজরাবাড়ী ২৪ সংবাদ নেটওয়ার্ক
                </p>
                <p className="text-[11px] text-slate-400 mt-1">দেশজুড়ে লক্ষাধিক পাঠকের প্রতিদিনের বিশ্বস্ত মাধ্যম</p>
              </div>
            </div>

            {/* Most Read Box */}
            <div className="border border-slate-200 rounded-md p-4 bg-white">
              <h4 className="font-black text-slate-900 font-serif-bn text-sm pb-2 border-b border-slate-200 mb-3">
                আজকের আলোচিত সংবাদ
              </h4>
              <div className="divide-y divide-slate-100">
                {allArticles.slice(0, 4).map((art, idx) => (
                  <div
                    key={art.id}
                    onClick={() => onSelectArticle(art.id)}
                    className="py-2.5 first:pt-0 last:pb-0 group cursor-pointer"
                  >
                    <span className="text-[10px] text-red-600 font-bold block mb-0.5">
                      {art.category}
                    </span>
                    <h5 className="text-xs font-bold text-slate-800 group-hover:text-red-700 transition-colors font-serif-bn line-clamp-2">
                      {art.title}
                    </h5>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Photo Lightbox Modal */}
      {lightboxIndex !== null && allPhotos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar with Counter and Close Button */}
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white py-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm font-bold bg-white/15 px-3 py-1 rounded-full text-white shadow-xs">
                ছবি {toBengaliNumber(lightboxIndex + 1)} / {toBengaliNumber(allPhotos.length)}
              </span>
              <span className="hidden sm:inline text-xs text-slate-300 truncate max-w-md font-serif-bn">
                {article.title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              title="বন্ধ করুন (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Photo Display and Navigation Arrows */}
          <div
            className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-2"
            onClick={(e) => e.stopPropagation()}
          >
            {allPhotos.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev !== null ? (prev - 1 + allPhotos.length) % allPhotos.length : 0
                  )
                }
                className="absolute left-1 sm:left-4 z-20 p-2 sm:p-3 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all border border-white/20 cursor-pointer shadow-lg active:scale-95"
                title="পূর্ববর্তী ছবি (← তীর বোতাম)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="max-h-[75vh] max-w-full flex items-center justify-center p-2">
              <img
                src={getSafeImageUrl(allPhotos[lightboxIndex].url)}
                alt=""
                className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl transition-all"
                onError={(e) => handleImageError(e, DEFAULT_NEWS_FALLBACK_IMAGE)}
              />
            </div>

            {allPhotos.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev !== null ? (prev + 1) % allPhotos.length : 0
                  )
                }
                className="absolute right-1 sm:right-4 z-20 p-2 sm:p-3 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all border border-white/20 cursor-pointer shadow-lg active:scale-95"
                title="পরবর্তী ছবি (→ তীর বোতাম)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Caption at Bottom */}
          {allPhotos[lightboxIndex].caption && (
            <div
              className="w-full max-w-3xl text-center pb-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xs sm:text-sm text-slate-200 bg-black/70 backdrop-blur-xs px-4 py-2 rounded-lg border border-white/10 inline-block font-serif-bn shadow-md">
                {allPhotos[lightboxIndex].caption}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
};
