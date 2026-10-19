/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import './firebase';
import { TopBar } from './components/TopBar';
import { Masthead } from './components/Masthead';
import { Navbar } from './components/Navbar';
import { BreakingTicker } from './components/BreakingTicker';
import { LeadNewsSection } from './components/LeadNewsSection';
import { CategoryBlock } from './components/CategoryBlock';
import { MostReadAndPicks } from './components/MostReadAndPicks';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { VideoNewsSection } from './components/VideoNewsSection';
import { AdBanner } from './components/AdBanner';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { PhotoLightbox } from './components/PhotoLightbox';
import { VideoPlayerModal } from './components/VideoPlayerModal';

// Admin components
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';

// Pages
import { ArticlePage } from './pages/ArticlePage';
import { CategoryPage } from './pages/CategoryPage';
import { SearchPage } from './pages/SearchPage';
import { GalleryPage } from './pages/GalleryPage';
import { VideoPage } from './pages/VideoPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { EditorialPolicyPage } from './pages/EditorialPolicyPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Data & Services
import { INITIAL_ARTICLES, GALLERY_PHOTOS, VIDEO_REPORTS } from './data/mockArticles';
import { Article, GalleryPhoto, NewsCategory, PageView, VideoReport, AdminUser, AdminSection, SiteSettings } from './types';
import { onAdminAuthState } from './services/authService';
import { getArticlesFromFirestore, subscribeToSiteSettings, getCachedSiteSettings } from './services/firestoreNewsService';
import { updatePageMetaTags } from './utils/seo';
import { X, FileText, CheckCircle, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>({ type: 'home' });
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoReport | null>(null);
  const [epaperModalOpen, setEpaperModalOpen] = useState(false);

  // Live Firestore Articles
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [loadingArticles, setLoadingArticles] = useState(false);

  // Live Site Settings (Head Office, Editor, Tagline, Phone, Email)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getCachedSiteSettings());

  useEffect(() => {
    const unsubscribe = subscribeToSiteSettings((settings) => {
      setSiteSettings(settings);
    });
    return () => unsubscribe();
  }, []);

  // Admin Auth state
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Subscribe to Auth changes
  useEffect(() => {
    const unsubscribe = onAdminAuthState((user) => {
      setAdminUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  // Fetch articles from Firestore
  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      const data = await getArticlesFromFirestore({
        isAdmin: Boolean(adminUser?.isAdmin),
      });
      if (data && data.length > 0) {
        setArticles(data);
      } else {
        setArticles(INITIAL_ARTICLES);
      }
    } catch (err) {
      console.warn('Using fallback articles:', err);
      setArticles(INITIAL_ARTICLES);
    } finally {
      setLoadingArticles(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [adminUser]);

  // Parse URL search params (?article=..., ?category=...) on load and handle browser back/forward
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const articleId = params.get('article');
      const category = params.get('category');
      if (articleId) {
        setCurrentView({ type: 'article', articleId });
      } else if (category) {
        setCurrentView({ type: 'category', category: category as NewsCategory });
      }
    } catch {}

    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const articleId = params.get('article');
        const category = params.get('category');
        if (articleId) {
          setCurrentView({ type: 'article', articleId });
        } else if (category) {
          setCurrentView({ type: 'category', category: category as NewsCategory });
        } else {
          setCurrentView({ type: 'home' });
        }
      } catch {}
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update default page meta tags when on home or other non-article views
  useEffect(() => {
    if (currentView.type === 'home') {
      updatePageMetaTags({
        title: siteSettings?.siteNameBn || 'হাজরাবাড়ী ২৪. কম - Hazarabari 24',
        description: siteSettings?.tagline || 'সত্যের পথে, সংবাদের সাথে। জাতীয়, রাজনীতি, অর্থনীতি, খেলাধুলা, আন্তর্জাতিক ও সারাদেশের নির্ভরযোগ্য সংবাদমাধ্যম।',
        image: '/images/og-image.png',
        type: 'website',
        url: window.location.origin,
      });
    } else if (currentView.type === 'category') {
      updatePageMetaTags({
        title: `${currentView.category} সংবাদ`,
        description: `${siteSettings?.siteNameBn || 'হাজরাবাড়ী ২৪. কম'} — ${currentView.category} বিভাগের তাজা সংবাদ ও বিশ্লেষণ।`,
        image: '/images/og-image.png',
        type: 'website',
      });
    }
  }, [currentView, siteSettings]);

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigateHome = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('article');
      url.searchParams.delete('category');
      url.hash = '';
      window.history.pushState(null, '', url.pathname);
    } catch {}
    setCurrentView({ type: 'home' });
  };

  const handleSelectArticle = (articleId: string) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('article', articleId);
      url.searchParams.delete('category');
      window.history.pushState({ articleId }, '', url.toString());
    } catch {}
    setCurrentView({ type: 'article', articleId });
  };

  const handleSelectCategory = (category: NewsCategory) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('category', category);
      url.searchParams.delete('article');
      window.history.pushState({ category }, '', url.toString());
    } catch {}
    setCurrentView({ type: 'category', category });
  };

  const handleSearchSubmit = (query: string) => {
    setCurrentView({ type: 'search', query });
  };

  // Group articles for home sections
  const getCategoryArticles = (category: NewsCategory) => {
    const list = articles.filter((a) => a.category === category);
    if (list.length > 0) return list;
    return INITIAL_ARTICLES.filter((a) => a.category === category).slice(0, 4);
  };

  // Render the current view
  const renderCurrentView = () => {
    switch (currentView.type) {
      case 'home':
        return (
          <>
            {/* Breaking News Ticker */}
            <BreakingTicker
              onSelectHeadline={(headline) => {
                const match = articles.find((a) =>
                  headline.includes(a.category) || headline.includes(a.tags[0])
                );
                if (match) {
                  handleSelectArticle(match.id);
                } else if (articles[0]) {
                  handleSelectArticle(articles[0].id);
                }
              }}
            />

            {/* Main Lead Story & Latest News */}
            <LeadNewsSection
              articles={articles}
              onSelectArticle={handleSelectArticle}
              onSelectCategory={handleSelectCategory}
            />

            {/* Primary Leaderboard Ad Banner */}
            <AdBanner slot="leaderboard" />

            {/* Core News Categories Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 divide-y divide-slate-200">
              <CategoryBlock
                category="জাতীয়"
                articles={getCategoryArticles('জাতীয়')}
                onSelectArticle={handleSelectArticle}
                onViewAllCategory={handleSelectCategory}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
                <CategoryBlock
                  category="রাজনীতি"
                  articles={getCategoryArticles('রাজনীতি')}
                  onSelectArticle={handleSelectArticle}
                  onViewAllCategory={handleSelectCategory}
                />
                <CategoryBlock
                  category="সারাদেশ"
                  articles={getCategoryArticles('সারাদেশ')}
                  onSelectArticle={handleSelectArticle}
                  onViewAllCategory={handleSelectCategory}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
                <CategoryBlock
                  category="আন্তর্জাতিক"
                  articles={getCategoryArticles('আন্তর্জাতিক')}
                  onSelectArticle={handleSelectArticle}
                  onViewAllCategory={handleSelectCategory}
                />
                <CategoryBlock
                  category="অর্থনীতি"
                  articles={getCategoryArticles('অর্থনীতি')}
                  onSelectArticle={handleSelectArticle}
                  onViewAllCategory={handleSelectCategory}
                />
              </div>
            </div>

            {/* Most Read & Editor's Picks */}
            <MostReadAndPicks
              articles={articles}
              onSelectArticle={handleSelectArticle}
            />

            {/* Photo Gallery Spotlight */}
            <PhotoGallerySection
              photos={GALLERY_PHOTOS}
              onSelectPhoto={(photo) => setActivePhoto(photo)}
              onViewAllPhotos={() => setCurrentView({ type: 'gallery' })}
            />

            {/* Remaining Category Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 divide-y divide-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
                <CategoryBlock
                  category="খেলাধুলা"
                  articles={getCategoryArticles('খেলাধুলা')}
                  onSelectArticle={handleSelectArticle}
                  onViewAllCategory={handleSelectCategory}
                />
                <CategoryBlock
                  category="বিনোদন"
                  articles={getCategoryArticles('বিনোদন')}
                  onSelectArticle={handleSelectArticle}
                  onViewAllCategory={handleSelectCategory}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
                <CategoryBlock
                  category="শিক্ষা"
                  articles={getCategoryArticles('শিক্ষা')}
                  onSelectArticle={handleSelectArticle}
                  onViewAllCategory={handleSelectCategory}
                />
                <CategoryBlock
                  category="প্রযুক্তি"
                  articles={getCategoryArticles('প্রযুক্তি')}
                  onSelectArticle={handleSelectArticle}
                  onViewAllCategory={handleSelectCategory}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <CategoryBlock
                  category="স্বাস্থ্য"
                  articles={getCategoryArticles('স্বাস্থ্য')}
                  onSelectArticle={handleSelectArticle}
                  onViewAllCategory={handleSelectCategory}
                />
                <CategoryBlock
                  category="ধর্ম"
                  articles={getCategoryArticles('ধর্ম')}
                  onSelectArticle={handleSelectArticle}
                  onViewAllCategory={handleSelectCategory}
                />
                <CategoryBlock
                  category="জীবনযাপন"
                  articles={getCategoryArticles('জীবনযাপন')}
                  onSelectArticle={handleSelectArticle}
                  onViewAllCategory={handleSelectCategory}
                />
              </div>
            </div>

            {/* Video News Section */}
            <VideoNewsSection
              videos={VIDEO_REPORTS}
              onSelectVideo={(video) => setActiveVideo(video)}
              onViewAllVideos={() => setCurrentView({ type: 'video' })}
            />
          </>
        );

      case 'article': {
        const found =
          articles.find((a) => a.id === currentView.articleId) ||
          INITIAL_ARTICLES.find((a) => a.id === currentView.articleId) ||
          articles[0];

        return (
          <ArticlePage
            article={found}
            allArticles={articles}
            fontSize={fontSize}
            setFontSize={setFontSize}
            onSelectArticle={handleSelectArticle}
            onSelectCategory={handleSelectCategory}
            onNavigateHome={handleNavigateHome}
          />
        );
      }

      case 'category':
        return (
          <CategoryPage
            category={currentView.category}
            allArticles={articles}
            onSelectArticle={handleSelectArticle}
            onNavigateHome={handleNavigateHome}
            onSelectCategory={handleSelectCategory}
          />
        );

      case 'search':
        return (
          <SearchPage
            initialQuery={currentView.query}
            allArticles={articles}
            onSelectArticle={handleSelectArticle}
            onNavigateHome={handleNavigateHome}
          />
        );

      case 'gallery':
        return (
          <GalleryPage
            onSelectPhoto={(photo) => setActivePhoto(photo)}
            onNavigateHome={handleNavigateHome}
          />
        );

      case 'video':
        return (
          <VideoPage
            onSelectVideo={(video) => setActiveVideo(video)}
            onNavigateHome={handleNavigateHome}
          />
        );

      case 'about':
        return <AboutPage onNavigateHome={handleNavigateHome} />;

      case 'contact':
        return <ContactPage siteSettings={siteSettings} onNavigateHome={handleNavigateHome} />;

      case 'privacy':
        return <PrivacyPolicyPage onNavigateHome={handleNavigateHome} />;

      case 'editorial-policy':
        return <EditorialPolicyPage onNavigateHome={handleNavigateHome} />;

      case 'admin':
      case 'admin-login': {
        if (!adminUser) {
          return (
            <AdminLogin
              onSuccess={(user) => {
                setAdminUser(user);
                setCurrentView({ type: 'admin', section: 'dashboard' });
              }}
              onBackToHome={handleNavigateHome}
            />
          );
        }

        const activeSection: AdminSection =
          currentView.type === 'admin' && currentView.section
            ? currentView.section
            : 'dashboard';

        const editId =
          currentView.type === 'admin' ? currentView.editArticleId : undefined;

        return (
          <AdminLayout
            adminUser={adminUser}
            currentSection={activeSection}
            editArticleId={editId}
            onNavigateSection={(sec, editId) =>
              setCurrentView({ type: 'admin', section: sec, editArticleId: editId })
            }
            articles={articles}
            onRefreshArticles={fetchArticles}
            loadingArticles={loadingArticles}
            onSettingsUpdated={(s) => setSiteSettings(s)}
            onPreviewArticle={(previewArt) => {
              // Add preview article to state temporarily & view
              setArticles((prev) => [
                previewArt,
                ...prev.filter((a) => a.id !== previewArt.id),
              ]);
              handleSelectArticle(previewArt.id);
            }}
            onViewPublicSite={handleNavigateHome}
            onLogout={() => {
              setAdminUser(null);
              handleNavigateHome();
            }}
          />
        );
      }

      default:
        return (
          <NotFoundPage
            onNavigateHome={handleNavigateHome}
            onOpenSearch={() => setSearchModalOpen(true)}
          />
        );
    }
  };

  // If in Admin view with valid admin user, render AdminLayout directly without public header/footer
  const isAdminViewActive = currentView.type === 'admin' || currentView.type === 'admin-login';

  if (isAdminViewActive) {
    return <div className="min-h-screen bg-slate-100">{renderCurrentView()}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* 1. Slim Top Bar with Admin button */}
      <TopBar
        fontSize={fontSize}
        setFontSize={setFontSize}
        onNavigateCategory={handleSelectCategory}
        onOpenEpaper={() => setEpaperModalOpen(true)}
        onOpenAdmin={() => {
          setCurrentView({ type: 'admin', section: 'dashboard' });
        }}
      />

      {/* 2. Newspaper Masthead */}
      <Masthead
        siteSettings={siteSettings}
        onHomeClick={handleNavigateHome}
        onOpenSearch={() => setSearchModalOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* 3. Sticky Navigation */}
      <Navbar
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        onNavigateCategory={handleSelectCategory}
        onNavigateGallery={() => setCurrentView({ type: 'gallery' })}
        onNavigateVideo={() => setCurrentView({ type: 'video' })}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onNavigatePage={(view) => setCurrentView(view)}
      />

      {/* Main Content Area */}
      <main className="flex-1">{renderCurrentView()}</main>

      {/* Professional Footer */}
      <Footer
        siteSettings={siteSettings}
        onNavigateHome={handleNavigateHome}
        onNavigateCategory={handleSelectCategory}
        onNavigatePage={(view) => {
          setCurrentView(view);
        }}
      />

      {/* Interactive Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        articles={articles}
        onSelectArticle={handleSelectArticle}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Photo Lightbox */}
      <PhotoLightbox photo={activePhoto} onClose={() => setActivePhoto(null)} />

      {/* Video Player Modal */}
      <VideoPlayerModal video={activeVideo} onClose={() => setActiveVideo(null)} />

      {/* E-Paper Modal */}
      {epaperModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white max-w-xl w-full rounded-lg shadow-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 font-serif-bn flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                <span>হাজরাবাড়ী ২৪ ই-পেপার সংস্করণ</span>
              </h3>
              <button
                type="button"
                onClick={() => setEpaperModalOpen(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-6 text-center space-y-3">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 font-serif-bn text-base">
                আজকের মুদ্রিত পত্রিকার ডিজিটাল প্রতিরূপ
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                হাজরাবাড়ী ২৪. কম-এর পূর্ণাঙ্গ মুদ্রিত পত্রিকার পৃষ্ঠাবিশিষ্ট ই-পেপার পোর্টাল সংস্করণ প্রস্তুত হচ্ছে। শীঘ্রই পাঠকরা পৃষ্ঠা উল্টে পড়ার সুবিধা উপভোগ করতে পারবেন।
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setEpaperModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
