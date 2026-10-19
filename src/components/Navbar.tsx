import React, { useRef, useState, useEffect } from 'react';
import { Home, Image as ImageIcon, Video, Search, ChevronLeft, ChevronRight, ChevronDown, X, Grid } from 'lucide-react';
import { CATEGORIES } from '../data/mockArticles';
import { NewsCategory, PageView } from '../types';

interface NavbarProps {
  currentView: PageView;
  onNavigateHome: () => void;
  onNavigateCategory: (category: NewsCategory) => void;
  onNavigateGallery: () => void;
  onNavigateVideo: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onNavigatePage?: (view: PageView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateHome,
  onNavigateCategory,
  onNavigateGallery,
  onNavigateVideo,
  mobileMenuOpen,
  setMobileMenuOpen,
  onNavigatePage,
}) => {
  const isHomeActive = currentView.type === 'home';
  const isGalleryActive = currentView.type === 'gallery';
  const isVideoActive = currentView.type === 'video';

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showAllCategoriesModal, setShowAllCategoriesModal] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  // Auto-scroll active category button into view whenever view changes
  useEffect(() => {
    if (scrollRef.current && currentView.type === 'category') {
      const activeBtn = scrollRef.current.querySelector<HTMLElement>('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentView]);

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 180, behavior: 'smooth' });
      setTimeout(checkScroll, 250);
    }
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -180, behavior: 'smooth' });
      setTimeout(checkScroll, 250);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-red-600 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center space-x-1 sm:space-x-2 text-sm font-medium">
            <button
              type="button"
              onClick={onNavigateHome}
              className={`px-3 py-2 text-slate-800 hover:text-red-600 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isHomeActive ? 'text-red-600 font-bold border-b-2 border-red-600 -mb-1' : ''
              }`}
            >
              <Home className="w-4 h-4" />
              <span>প্রচ্ছদ</span>
            </button>

            {CATEGORIES.map((cat) => {
              const isActive = currentView.type === 'category' && currentView.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onNavigateCategory(cat.id)}
                  className={`px-2.5 py-2 text-slate-800 hover:text-red-600 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive ? 'text-red-600 font-bold border-b-2 border-red-600 -mb-1' : ''
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Media Links */}
          <div className="flex items-center gap-1 pl-4 border-l border-slate-200 shrink-0 text-xs font-semibold">
            <button
              type="button"
              onClick={onNavigateGallery}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded transition-colors ${
                isGalleryActive
                  ? 'bg-red-50 text-red-700 font-bold'
                  : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>ছবি</span>
            </button>
            <button
              type="button"
              onClick={onNavigateVideo}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded transition-colors ${
                isVideoActive
                  ? 'bg-red-50 text-red-700 font-bold'
                  : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>ভিডিও</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-horizontal Nav Strip with Interactive Scroll Arrows & "সব" Dropdown */}
        <div className="lg:hidden relative py-1.5 flex items-center">
          {/* Left Arrow Button (shown when scrolled to right) */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={handleScrollLeft}
              className="absolute left-0 z-20 h-full px-1 bg-gradient-to-r from-white via-white/95 to-transparent text-slate-800 hover:text-red-600 flex items-center justify-center cursor-pointer shadow-xs"
              title="পূর্ববর্তী বিভাগসমূহ"
              aria-label="পূর্ববর্তী বিভাগ"
            >
              <div className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center shadow-xs">
                <ChevronLeft className="w-4 h-4 text-slate-800" />
              </div>
            </button>
          )}

          {/* Scrollable Category Pills */}
          <div
            ref={scrollRef}
            className="flex items-center overflow-x-auto no-scrollbar py-1 px-1 text-xs sm:text-sm font-medium gap-1.5 scroll-smooth overscroll-x-contain touch-pan-x w-full"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <button
              type="button"
              onClick={onNavigateHome}
              data-active={isHomeActive}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                isHomeActive ? 'bg-red-600 text-white font-bold shadow-xs' : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>প্রচ্ছদ</span>
            </button>

            {CATEGORIES.map((cat) => {
              const isActive = currentView.type === 'category' && currentView.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  data-active={isActive}
                  onClick={() => {
                    onNavigateCategory(cat.id);
                    setMobileMenuOpen(false);
                    setShowAllCategoriesModal(false);
                  }}
                  className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive ? 'bg-red-600 text-white font-bold shadow-xs' : 'text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                onNavigateGallery();
                setMobileMenuOpen(false);
                setShowAllCategoriesModal(false);
              }}
              data-active={isGalleryActive}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                isGalleryActive ? 'bg-red-600 text-white font-bold shadow-xs' : 'text-red-700 bg-red-50 border border-red-200 hover:bg-red-100'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>ছবি</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigateVideo();
                setMobileMenuOpen(false);
                setShowAllCategoriesModal(false);
              }}
              data-active={isVideoActive}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                isVideoActive ? 'bg-red-600 text-white font-bold shadow-xs' : 'text-red-700 bg-red-50 border border-red-200 hover:bg-red-100'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>ভিডিও</span>
            </button>
          </div>

          {/* Right Action Cluster: Next Arrow & "সব" Dropdown */}
          <div className="shrink-0 flex items-center pl-1 z-20">
            {canScrollRight && (
              <button
                type="button"
                onClick={handleScrollRight}
                className="h-8 px-1 bg-gradient-to-l from-white via-white/95 to-transparent text-slate-800 hover:text-red-600 flex items-center justify-center cursor-pointer"
                title="পরবর্তী বিভাগসমূহ দেখতে চাপুন"
                aria-label="পরবর্তী বিভাগসমূহ"
              >
                <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs animate-pulse">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            )}

            {/* "সব" (All Categories) dropdown trigger */}
            <button
              type="button"
              onClick={() => setShowAllCategoriesModal(!showAllCategoriesModal)}
              className="ml-1 px-2.5 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md shrink-0 flex items-center gap-1 cursor-pointer shadow-2xs"
              title="সকল বিভাগ একনজরে দেখুন"
            >
              <span>সব</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAllCategoriesModal ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown panel for All Categories on mobile */}
      {showAllCategoriesModal && (
        <div className="lg:hidden bg-slate-50 border-b-2 border-red-600 p-3 shadow-lg animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-200 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1 text-red-600 font-serif-bn">
              <Grid className="w-3.5 h-3.5" />
              <span>সকল সংবাদ বিভাগসমূহ:</span>
            </span>
            <button
              type="button"
              onClick={() => setShowAllCategoriesModal(false)}
              className="text-slate-400 hover:text-slate-700 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => {
                onNavigateHome();
                setShowAllCategoriesModal(false);
              }}
              className={`p-2 rounded text-center font-medium ${isHomeActive ? 'bg-red-600 text-white font-bold' : 'bg-white border border-slate-200 text-slate-800 hover:bg-red-50'}`}
            >
              প্রচ্ছদ
            </button>
            {CATEGORIES.map((cat) => {
              const isActive = currentView.type === 'category' && currentView.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onNavigateCategory(cat.id);
                    setShowAllCategoriesModal(false);
                  }}
                  className={`p-2 rounded text-center truncate ${isActive ? 'bg-red-600 text-white font-bold' : 'bg-white border border-slate-200 text-slate-800 hover:bg-red-50'}`}
                >
                  {cat.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                onNavigateGallery();
                setShowAllCategoriesModal(false);
              }}
              className={`p-2 rounded text-center font-semibold flex items-center justify-center gap-1 ${isGalleryActive ? 'bg-red-600 text-white' : 'bg-white border border-red-200 text-red-600 hover:bg-red-50'}`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>ছবি</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigateVideo();
                setShowAllCategoriesModal(false);
              }}
              className={`p-2 rounded text-center font-semibold flex items-center justify-center gap-1 ${isVideoActive ? 'bg-red-600 text-white' : 'bg-white border border-red-200 text-red-600 hover:bg-red-50'}`}
            >
              <Video className="w-3 h-3" />
              <span>ভিডিও</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              type="button"
              onClick={() => {
                onNavigateHome();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded hover:bg-slate-50 text-slate-800 font-medium"
            >
              প্রচ্ছদ
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onNavigateCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded hover:bg-slate-50 text-slate-800 font-medium"
              >
                {cat.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                onNavigateGallery();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded hover:bg-slate-50 text-red-600 font-semibold flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              <span>ফটো গ্যালারি</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigateVideo();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded hover:bg-slate-50 text-red-600 font-semibold flex items-center gap-2"
            >
              <Video className="w-4 h-4" />
              <span>ভিডিও সংবাদ</span>
            </button>
          </div>

          {/* Quick Institutional & Admin links for mobile */}
          {onNavigatePage && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <button
                type="button"
                onClick={() => {
                  onNavigatePage({ type: 'about' });
                  setMobileMenuOpen(false);
                }}
                className="hover:text-red-600 font-medium"
              >
                আমাদের সম্পর্কে
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  onNavigatePage({ type: 'contact' });
                  setMobileMenuOpen(false);
                }}
                className="hover:text-red-600 font-medium"
              >
                যোগাযোগ দপ্তর
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  onNavigatePage({ type: 'admin' });
                  setMobileMenuOpen(false);
                }}
                className="text-red-600 font-bold hover:underline"
              >
                অ্যাডমিন লগইন
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
