export type NewsCategory =
  | 'জাতীয়'
  | 'রাজনীতি'
  | 'সারাদেশ'
  | 'আন্তর্জাতিক'
  | 'অর্থনীতি'
  | 'খেলাধুলা'
  | 'বিনোদন'
  | 'শিক্ষা'
  | 'প্রযুক্তি'
  | 'স্বাস্থ্য'
  | 'ধর্ম'
  | 'জীবনযাপন';

export type ArticleStatus = 'draft' | 'published' | 'scheduled';

export interface CategoryMeta {
  id: NewsCategory;
  slug: string;
  label: string;
  description: string;
  order?: number;
}

export interface Author {
  name: string;
  role: string;
  avatar?: string;
  location?: string;
}

export interface ArticleImageItem {
  url: string;
  caption?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string[];
  category: NewsCategory;
  categorySlug: string;
  tags: string[];
  author: Author;
  publishedAt: string; // ISO date string
  updatedAt?: string;
  scheduledAt?: string;
  coverImage: string;
  imageCaption?: string;
  imageFit?: 'cover' | 'contain' | 'auto';
  additionalImages?: (string | ArticleImageItem)[];
  readTimeMinutes: number;
  viewCount: number;
  status: ArticleStatus;
  isLead?: boolean;
  isSecondaryLead?: boolean;
  isBreaking?: boolean;
  isEditorPick?: boolean;
  isMostRead?: boolean;
  isTrending?: boolean;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  photographer: string;
  location: string;
  date: string;
  image: string;
  category: string;
}

export interface VideoReport {
  id: string;
  title: string;
  summary: string;
  duration: string;
  thumbnail: string;
  category: NewsCategory;
  publishedAt: string;
  viewCount: string;
  videoUrl?: string;
}

export interface CommentItem {
  id: string;
  articleId: string;
  authorName: string;
  authorLocation?: string;
  commentText: string;
  createdAt: string;
  likes: number;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'superadmin' | 'editor' | 'reporter';
  isAdmin: boolean;
}

export interface BreakingNewsItem {
  id: string;
  headline: string;
  active: boolean;
  createdAt: string;
  priority?: number;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy?: string;
}

export interface AdItem {
  id: string;
  slot: 'leaderboard' | 'rectangle' | 'sidebar';
  title: string;
  sponsorName: string;
  linkUrl: string;
  bannerText: string;
  active: boolean;
  updatedAt?: string;
}

export interface SiteSettings {
  id: string;
  siteNameBn: string;
  siteNameEn: string;
  tagline: string;
  logoUrl?: string;
  contactEmail: string;
  adsEmail: string;
  phone: string;
  officeHazrabari: string;
  officeDhaka: string;
  editorName: string;
  executiveEditor: string;
  weatherCity?: string;
  breakingTickerActive: boolean;
}

export type AdminSection =
  | 'dashboard'
  | 'news'
  | 'add-news'
  | 'edit-news'
  | 'categories'
  | 'breaking'
  | 'media'
  | 'ads'
  | 'settings';

export type PageView =
  | { type: 'home' }
  | { type: 'category'; category: NewsCategory }
  | { type: 'article'; articleId: string }
  | { type: 'search'; query: string }
  | { type: 'gallery' }
  | { type: 'video' }
  | { type: 'about' }
  | { type: 'contact' }
  | { type: 'privacy' }
  | { type: 'editorial-policy' }
  | { type: 'admin'; section?: AdminSection; editArticleId?: string }
  | { type: 'admin-login' }
  | { type: 'not-found' };
