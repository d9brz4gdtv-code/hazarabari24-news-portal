import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderKanban,
  Flame,
  Image as ImageIcon,
  DollarSign,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  User,
} from 'lucide-react';
import { AdminSection, AdminUser, Article, SiteSettings } from '../types';
import { DashboardOverview } from './sections/DashboardOverview';
import { NewsManager } from './sections/NewsManager';
import { NewsEditor } from './sections/NewsEditor';
import { BreakingManager } from './sections/BreakingManager';
import { MediaManager } from './sections/MediaManager';
import { CategoriesManager } from './sections/CategoriesManager';
import { AdsManager } from './sections/AdsManager';
import { SettingsManager } from './sections/SettingsManager';
import { logoutAdmin } from '../services/authService';
import { BrandLogo } from '../components/BrandLogo';

interface AdminLayoutProps {
  adminUser: AdminUser;
  currentSection: AdminSection;
  onNavigateSection: (section: AdminSection, editArticleId?: string) => void;
  articles: Article[];
  onRefreshArticles: () => void;
  loadingArticles: boolean;
  onPreviewArticle: (article: Article) => void;
  onViewPublicSite: () => void;
  onLogout: () => void;
  editArticleId?: string;
  onSettingsUpdated?: (settings: SiteSettings) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  adminUser,
  currentSection,
  onNavigateSection,
  articles,
  onRefreshArticles,
  loadingArticles,
  onPreviewArticle,
  onViewPublicSite,
  onLogout,
  editArticleId,
  onSettingsUpdated,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const editArticle = editArticleId
    ? articles.find((a) => a.id === editArticleId) || null
    : null;

  const handleLogout = async () => {
    await logoutAdmin();
    onLogout();
  };

  const navItems: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'news', label: 'সংবাদ তালিকা', icon: <FileText className="w-4 h-4" /> },
    { id: 'add-news', label: 'নতুন সংবাদ লিখুন', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'categories', label: 'বিভাগসমূহ', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'breaking', label: 'ব্রেকিং নিউজ টিকার', icon: <Flame className="w-4 h-4 text-red-500" /> },
    { id: 'media', label: 'মিডিয়া লাইব্রেরি', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'ads', label: 'বিজ্ঞাপন জোন', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'settings', label: 'সাইট সেটিংস', icon: <Settings className="w-4 h-4" /> },
  ];

  const renderSectionContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <DashboardOverview
            articles={articles}
            adminUser={adminUser}
            onNavigateSection={onNavigateSection}
            onEditArticle={(art) => onNavigateSection('edit-news', art.id)}
            onRefreshArticles={onRefreshArticles}
          />
        );
      case 'news':
        return (
          <NewsManager
            articles={articles}
            onAddNew={() => onNavigateSection('add-news')}
            onEditArticle={(art) => onNavigateSection('edit-news', art.id)}
            onPreviewArticle={onPreviewArticle}
            onRefresh={onRefreshArticles}
            loading={loadingArticles}
          />
        );
      case 'add-news':
        return (
          <NewsEditor
            onSaveSuccess={() => {
              onRefreshArticles();
              onNavigateSection('news');
            }}
            onCancel={() => onNavigateSection('news')}
            onPreview={onPreviewArticle}
          />
        );
      case 'edit-news':
        return (
          <NewsEditor
            initialArticle={editArticle}
            onSaveSuccess={() => {
              onRefreshArticles();
              onNavigateSection('news');
            }}
            onCancel={() => onNavigateSection('news')}
            onPreview={onPreviewArticle}
          />
        );
      case 'breaking':
        return <BreakingManager />;
      case 'media':
        return <MediaManager />;
      case 'categories':
        return <CategoriesManager articles={articles} />;
      case 'ads':
        return <AdsManager />;
      case 'settings':
        return <SettingsManager onSettingsUpdated={onSettingsUpdated} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 text-slate-300 border-r border-slate-800 shrink-0 select-none">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <BrandLogo variant="icon" className="w-9 h-9" />
            <div>
              <h1 className="text-base font-extrabold text-white font-serif-bn leading-tight">
                হাজরাবাড়ী <span className="text-red-500">২৪</span>
              </h1>
              <span className="text-[10px] text-slate-400 font-mono">অ্যাডমিন পোর্টাল v2.0</span>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 bg-slate-900/80 mx-3 my-3 rounded-lg border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {adminUser.displayName || adminUser.email}
            </p>
            <span className="inline-block text-[10px] bg-red-950 text-red-400 border border-red-800/60 px-1.5 py-0.2 rounded font-semibold uppercase">
              {adminUser.role}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigateSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <button
            type="button"
            onClick={onViewPublicSite}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-900 rounded-md transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-slate-500" />
            <span>মূল ওয়েবসাইট দেখুন</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1 rounded text-slate-300 hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <BrandLogo variant="icon" className="w-6 h-6" />
          <span className="font-bold text-sm font-serif-bn">
            হাজরাবাড়ী <span className="text-red-500">২৪</span> অ্যাডমিন
          </span>
        </div>
        <button
          type="button"
          onClick={onViewPublicSite}
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
        >
          <span>সাইট</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-slate-950 text-slate-300 border-b border-slate-800 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigateSection(item.id);
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold ${
                currentSection === item.id ? 'bg-red-600 text-white' : 'text-slate-300'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-red-400 hover:bg-slate-900 rounded"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট</span>
          </button>
        </div>
      )}

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{renderSectionContent()}</div>
      </main>
    </div>
  );
};
