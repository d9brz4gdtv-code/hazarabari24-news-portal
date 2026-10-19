import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  onSnapshot,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { Article, ArticleStatus, BreakingNewsItem, MediaItem, SiteSettings } from '../types';
import { INITIAL_ARTICLES, BREAKING_NEWS } from '../data/mockArticles';
import { getSafeImageUrl } from '../utils/imageUtils';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Sanitizes an object before writing to Firestore.
 * Strips any properties with value `undefined` which causes Firestore setDoc/updateDoc to throw,
 * while preserving Firestore FieldValues (such as serverTimestamp, deleteField, increment).
 */
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      continue;
    }
    if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      // Preserve Firestore FieldValues (such as serverTimestamp, deleteField, etc.)
      if (typeof (value as any)._methodName === 'string' || value.constructor?.name === 'FieldValue') {
        result[key] = value;
      } else {
        result[key] = sanitizeForFirestore(value);
      }
    } else if (Array.isArray(value)) {
      result[key] = value
        .filter((item) => item !== undefined)
        .map((item) => (item !== null && typeof item === 'object' && !(item instanceof Date) ? sanitizeForFirestore(item) : item));
    } else {
      result[key] = value;
    }
  }
  return result;
}

const DELETED_ARTICLES_KEY = 'hazrabari_deleted_articles';
const SEEDED_ARTICLES_KEY = 'hazrabari_articles_seeded';

export function getDeletedArticleIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_ARTICLES_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

export function markArticleDeleted(id: string): void {
  const set = getDeletedArticleIds();
  set.add(id);
  localStorage.setItem(DELETED_ARTICLES_KEY, JSON.stringify(Array.from(set)));
}

/**
 * Fetch all articles (for admin) or public published articles (for readers)
 */
export async function getArticlesFromFirestore(options?: {
  isAdmin?: boolean;
  category?: string;
  status?: ArticleStatus;
}): Promise<Article[]> {
  const deletedIds = getDeletedArticleIds();

  try {
    const colRef = collection(db, 'articles');
    let q = query(colRef);

    const snapshot = await getDocs(q);

    // If completely new and empty in Firestore, seed INITIAL_ARTICLES once
    if (snapshot.empty && !localStorage.getItem(SEEDED_ARTICLES_KEY)) {
      try {
        for (const art of INITIAL_ARTICLES) {
          if (!deletedIds.has(art.id)) {
            await setDoc(doc(db, 'articles', art.id), sanitizeForFirestore(art));
          }
        }
        localStorage.setItem(SEEDED_ARTICLES_KEY, 'true');
        return INITIAL_ARTICLES.filter((a) => !deletedIds.has(a.id));
      } catch (seedErr) {
        console.warn('Initial articles seeding notice:', seedErr);
        localStorage.setItem(SEEDED_ARTICLES_KEY, 'true');
        return INITIAL_ARTICLES.filter((a) => !deletedIds.has(a.id));
      }
    }

    const articles: Article[] = [];

    snapshot.forEach((snap) => {
      // Exclude permanently deleted articles
      if (deletedIds.has(snap.id)) return;

      const data = snap.data();
      const status: ArticleStatus = data.status || 'published';
      const publishedAt = data.publishedAt || new Date().toISOString();

      // Filter for public readers: only published articles that are not future-scheduled
      if (!options?.isAdmin) {
        if (status !== 'published') return;
        if (new Date(publishedAt).getTime() > Date.now()) return;
      }

      if (options?.category && data.category !== options.category) {
        return;
      }

      if (options?.status && status !== options.status) {
        return;
      }

      articles.push({
        id: snap.id,
        slug: data.slug || snap.id,
        title: data.title || '',
        summary: data.summary || '',
        content: Array.isArray(data.content)
          ? data.content
          : typeof data.content === 'string'
          ? data.content.split('\n\n')
          : [],
        category: data.category || 'জাতীয়',
        categorySlug: data.categorySlug || 'national',
        tags: Array.isArray(data.tags) ? data.tags : [],
        author: {
          name: data.author?.name || 'হাজরাবাড়ী ২৪ বার্তা ডেস্ক',
          role: data.author?.role || 'প্রতিবেদক',
          location: data.author?.location || 'ঢাকা',
        },
        publishedAt,
        updatedAt: data.updatedAt,
        scheduledAt: data.scheduledAt,
        coverImage: getSafeImageUrl(data.coverImage),
        imageCaption: data.imageCaption,
        imageFit: data.imageFit || 'auto',
        additionalImages: Array.isArray(data.additionalImages)
          ? data.additionalImages.map((img: any) =>
              typeof img === 'string'
                ? { url: getSafeImageUrl(img), caption: '' }
                : { url: getSafeImageUrl(img?.url), caption: img?.caption || '' }
            )
          : [],
        readTimeMinutes: typeof data.readTimeMinutes === 'number' ? data.readTimeMinutes : 3,
        viewCount: typeof data.viewCount === 'number' ? data.viewCount : 100,
        status,
        isLead: Boolean(data.isLead),
        isSecondaryLead: Boolean(data.isSecondaryLead),
        isBreaking: Boolean(data.isBreaking),
        isEditorPick: Boolean(data.isEditorPick),
        isMostRead: Boolean(data.isMostRead),
      });
    });

    // Sort by publication date descending
    articles.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return articles;
  } catch (error) {
    console.warn('Failed to fetch from Firestore, checking local cache:', error);
    // Even in offline fallback, never resurrect deleted articles!
    return INITIAL_ARTICLES.filter((a) => !deletedIds.has(a.id));
  }
}

/**
 * Fetch a single article by ID
 */
export async function getArticleByIdFromFirestore(id: string): Promise<Article | null> {
  try {
    const docRef = doc(db, 'articles', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    const data = snap.data();
    return {
      id: snap.id,
      slug: data.slug || snap.id,
      title: data.title || '',
      summary: data.summary || '',
      content: Array.isArray(data.content) ? data.content : [],
      category: data.category || 'জাতীয়',
      categorySlug: data.categorySlug || 'national',
      tags: data.tags || [],
      author: data.author || { name: 'বার্তা ডেস্ক', role: 'প্রতিবেদক' },
      publishedAt: data.publishedAt || new Date().toISOString(),
      updatedAt: data.updatedAt,
      scheduledAt: data.scheduledAt,
      coverImage: getSafeImageUrl(data.coverImage),
      imageCaption: data.imageCaption,
      imageFit: data.imageFit || 'auto',
      additionalImages: Array.isArray(data.additionalImages)
        ? data.additionalImages.map((img: any) =>
            typeof img === 'string'
              ? { url: getSafeImageUrl(img), caption: '' }
              : { url: getSafeImageUrl(img?.url), caption: img?.caption || '' }
          )
        : [],
      readTimeMinutes: data.readTimeMinutes || 3,
      viewCount: data.viewCount || 0,
      status: data.status || 'published',
      isLead: data.isLead,
      isSecondaryLead: data.isSecondaryLead,
      isBreaking: data.isBreaking,
      isEditorPick: data.isEditorPick,
      isMostRead: data.isMostRead,
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

/**
 * Save (create or update) an article in Firestore
 */
export async function saveArticleToFirestore(
  articleData: Partial<Article>,
  id?: string
): Promise<string> {
  const articleId = id || articleData.id || `news-${Date.now()}`;
  const docRef = doc(db, 'articles', articleId);

  const rawData: Record<string, any> = { ...articleData };

  // Handle scheduledAt cleanup if status is not 'scheduled'
  if (rawData.status !== 'scheduled') {
    if (id) {
      // If updating an existing doc, explicitly delete scheduledAt field from Firestore
      rawData.scheduledAt = deleteField();
    } else {
      delete rawData.scheduledAt;
    }
  } else if (!rawData.scheduledAt) {
    rawData.scheduledAt = new Date().toISOString();
  }

  const payload = sanitizeForFirestore({
    ...rawData,
    id: articleId,
    updatedAt: new Date().toISOString(),
    serverUpdatedAt: serverTimestamp(),
  });

  if (!id) {
    if (!payload.publishedAt) {
      payload.publishedAt = new Date().toISOString();
    }
    if (typeof payload.viewCount !== 'number') {
      payload.viewCount = 0;
    }
  }

  try {
    await setDoc(docRef, payload, { merge: true });
    return articleId;
  } catch (err: any) {
    if (auth.currentUser && (err?.message?.includes('permission') || err?.code === 'permission-denied')) {
      try {
        await auth.currentUser.getIdToken(true);
        await setDoc(docRef, payload, { merge: true });
        return articleId;
      } catch (retryErr) {
        handleFirestoreError(retryErr, OperationType.WRITE, `articles/${articleId}`);
      }
    }
    handleFirestoreError(err, OperationType.WRITE, `articles/${articleId}`);
  }
}

/**
 * Delete an article from Firestore permanently
 */
export async function deleteArticleFromFirestore(id: string): Promise<void> {
  markArticleDeleted(id);
  const docRef = doc(db, 'articles', id);
  try {
    await deleteDoc(docRef);
  } catch (err: any) {
    if (auth.currentUser && (err?.message?.includes('permission') || err?.code === 'permission-denied')) {
      try {
        await auth.currentUser.getIdToken(true);
        await deleteDoc(docRef);
        return;
      } catch (retryErr) {
        console.warn('Retry delete article warning:', retryErr);
      }
    }
    console.warn('Delete article notice:', err);
  }
}

/**
 * Update publication status of an article
 */
export async function updateArticleStatus(id: string, status: ArticleStatus): Promise<void> {
  const docRef = doc(db, 'articles', id);
  const updatePayload: Record<string, any> = {
    status,
    updatedAt: new Date().toISOString(),
  };
  if (status !== 'scheduled') {
    updatePayload.scheduledAt = deleteField();
  }
  try {
    await updateDoc(docRef, updatePayload);
  } catch (err: any) {
    if (auth.currentUser && (err?.message?.includes('permission') || err?.code === 'permission-denied')) {
      try {
        await auth.currentUser.getIdToken(true);
        await updateDoc(docRef, updatePayload);
        return;
      } catch (retryErr) {
        handleFirestoreError(retryErr, OperationType.UPDATE, `articles/${id}`);
      }
    }
    handleFirestoreError(err, OperationType.UPDATE, `articles/${id}`);
  }
}

/**
 * Seed initial sample news into Firestore if empty
 */
export async function seedInitialArticlesToFirestore(): Promise<number> {
  const batch = writeBatch(db);
  let count = 0;

  for (const art of INITIAL_ARTICLES) {
    const docRef = doc(db, 'articles', art.id);
    batch.set(docRef, {
      ...art,
      status: 'published',
      serverCreatedAt: serverTimestamp(),
    });
    count++;
  }

  try {
    await batch.commit();
    return count;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'articles');
  }
}

/**
 * Compress an image to an optimized web Data URL
 */
export async function compressImageToDataUrl(
  file: File,
  maxWidth = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const format = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(format, quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(event.target?.result as string);
      img.src = event.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image to Firebase Storage with type & size validation and instant fallback
 */
export async function uploadImageToStorage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ url: string; id: string; name: string; isFallback?: boolean }> {
  // 1. Validation
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error('শুধুমাত্র JPG, PNG বা WEBP ফরম্যাটের ছবি আপলোড করা যাবে।');
  }

  // Max 5MB
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারে।');
  }

  onProgress?.(20);
  // Prepare optimized local data URL first
  const optimizedDataUrl = await compressImageToDataUrl(file);
  onProgress?.(45);

  const mediaId = `media-${Date.now()}`;
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `news_uploads/${Date.now()}_${cleanName}`;

  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Promise with 5-second timeout so user is never stuck at 0%
    const uploadPromise = new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            const rawProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 55;
            onProgress?.(Math.min(95, Math.round(45 + rawProgress)));
          }
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          } catch (e) {
            reject(e);
          }
        }
      );
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('স্টোরেজ আপলোড সময় শেষ হয়েছে')), 5000)
    );

    const downloadUrl = await Promise.race([uploadPromise, timeoutPromise]);
    onProgress?.(100);

    // Save to media library in Firestore
    try {
      await setDoc(doc(db, 'media', mediaId), {
        id: mediaId,
        name: file.name,
        url: downloadUrl,
        size: file.size,
        type: file.type,
        storagePath: path,
        uploadedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Media document write notice:', err);
    }

    return { url: downloadUrl, id: mediaId, name: file.name };
  } catch (error) {
    console.warn('Firebase Storage upload failed or timed out, using optimized fallback:', error);
    onProgress?.(100);

    // Save fallback to media in Firestore
    try {
      await setDoc(doc(db, 'media', mediaId), {
        id: mediaId,
        name: file.name,
        url: optimizedDataUrl,
        size: file.size,
        type: file.type,
        storagePath: 'local-optimized',
        uploadedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Media fallback write notice:', err);
    }

    return { url: optimizedDataUrl, id: mediaId, name: file.name, isFallback: true };
  }
}

/**
 * Get media items from Firestore
 */
export async function getMediaLibrary(): Promise<MediaItem[]> {
  try {
    const snap = await getDocs(collection(db, 'media'));
    const items: MediaItem[] = [];
    snap.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        name: data.name || 'Image',
        url: data.url,
        size: data.size || 0,
        type: data.type || 'image/jpeg',
        uploadedAt: data.uploadedAt || new Date().toISOString(),
      });
    });
    items.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    return items;
  } catch (error) {
    console.warn('Failed to load media library:', error);
    return [];
  }
}

/**
 * Breaking news items CRUD
 */
/**
 * Breaking news items real-time subscription and CRUD
 */
export function subscribeToBreakingNews(callback: (items: BreakingNewsItem[]) => void): () => void {
  // 1. Instant response from local cache
  const cached = localStorage.getItem('hazrabari_breaking_news');
  if (cached) {
    try {
      callback(JSON.parse(cached));
    } catch {}
  }

  // 2. Real-time Firestore query
  const q = query(collection(db, 'breakingNews'));
  return onSnapshot(
    q,
    async (snap) => {
      if (snap.empty) {
        const isSeeded = localStorage.getItem('hazrabari_breaking_seeded');
        // Only seed once if completely new; never resurrect after user deletion!
        if (!isSeeded) {
          try {
            const initialItems: BreakingNewsItem[] = [];
            for (let i = 0; i < BREAKING_NEWS.length; i++) {
              const id = `break-${Date.now()}-${i}`;
              const item: BreakingNewsItem = {
                id,
                headline: BREAKING_NEWS[i],
                active: true,
                createdAt: new Date(Date.now() - i * 60000).toISOString(),
              };
              await setDoc(doc(db, 'breakingNews', id), item);
              initialItems.push(item);
            }
            localStorage.setItem('hazrabari_breaking_seeded', 'true');
            localStorage.setItem('hazrabari_breaking_news', JSON.stringify(initialItems));
            callback(initialItems);
            return;
          } catch (seedErr) {
            console.warn('Initial breaking news seeding note:', seedErr);
          }
        }
        // If empty and already seeded, it means the user intentionally deleted all breaking news!
        localStorage.setItem('hazrabari_breaking_news', JSON.stringify([]));
        callback([]);
        return;
      }

      const items: BreakingNewsItem[] = [];
      snap.forEach((d) => {
        const data = d.data();
        items.push({
          id: d.id,
          headline: data.headline || '',
          active: data.active !== false,
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });

      // Sort by createdAt desc
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      localStorage.setItem('hazrabari_breaking_seeded', 'true');
      localStorage.setItem('hazrabari_breaking_news', JSON.stringify(items));
      callback(items);
    },
    (err) => {
      console.warn('Breaking news subscription fallback:', err);
      const cachedData = localStorage.getItem('hazrabari_breaking_news');
      if (cachedData) {
        try {
          callback(JSON.parse(cachedData));
        } catch {}
      }
    }
  );
}

export async function getBreakingNewsFromFirestore(): Promise<BreakingNewsItem[]> {
  const cached = localStorage.getItem('hazrabari_breaking_news');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }

  try {
    const snap = await getDocs(collection(db, 'breakingNews'));
    if (snap.empty) {
      const isSeeded = localStorage.getItem('hazrabari_breaking_seeded');
      if (!isSeeded) {
        return BREAKING_NEWS.map((h, i) => ({
          id: `break-${Date.now()}-${i}`,
          headline: h,
          active: true,
          createdAt: new Date().toISOString(),
        }));
      }
      return [];
    }

    const items: BreakingNewsItem[] = [];
    snap.forEach((d) => {
      const data = d.data();
      items.push({
        id: d.id,
        headline: data.headline || '',
        active: data.active !== false,
        createdAt: data.createdAt || new Date().toISOString(),
      });
    });
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    localStorage.setItem('hazrabari_breaking_news', JSON.stringify(items));
    return items;
  } catch (error) {
    console.warn('Failed to fetch breaking news:', error);
    return [];
  }
}

export async function addBreakingNewsToFirestore(headline: string): Promise<string> {
  const id = `break-${Date.now()}`;
  const newItem: BreakingNewsItem = {
    id,
    headline,
    active: true,
    createdAt: new Date().toISOString(),
  };

  // Immediate local cache update
  const cached = localStorage.getItem('hazrabari_breaking_news');
  let currentList: BreakingNewsItem[] = [];
  if (cached) {
    try {
      currentList = JSON.parse(cached);
    } catch {}
  }
  localStorage.setItem('hazrabari_breaking_news', JSON.stringify([newItem, ...currentList]));
  localStorage.setItem('hazrabari_breaking_seeded', 'true');

  try {
    await setDoc(doc(db, 'breakingNews', id), newItem);
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `breakingNews/${id}`);
    return id;
  }
}

export async function toggleBreakingNewsInFirestore(id: string, active: boolean): Promise<void> {
  const cached = localStorage.getItem('hazrabari_breaking_news');
  if (cached) {
    try {
      const currentList: BreakingNewsItem[] = JSON.parse(cached);
      const updated = currentList.map((i) => (i.id === id ? { ...i, active } : i));
      localStorage.setItem('hazrabari_breaking_news', JSON.stringify(updated));
    } catch {}
  }

  try {
    await updateDoc(doc(db, 'breakingNews', id), { active });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `breakingNews/${id}`);
  }
}

export async function deleteBreakingNewsFromFirestore(id: string): Promise<void> {
  // Immediate permanent removal from localStorage cache
  localStorage.setItem('hazrabari_breaking_seeded', 'true');
  const cached = localStorage.getItem('hazrabari_breaking_news');
  if (cached) {
    try {
      const currentList: BreakingNewsItem[] = JSON.parse(cached);
      const filtered = currentList.filter((i) => i.id !== id);
      localStorage.setItem('hazrabari_breaking_news', JSON.stringify(filtered));
    } catch {}
  }

  try {
    await deleteDoc(doc(db, 'breakingNews', id));
  } catch (err: any) {
    if (auth.currentUser && (err?.message?.includes('permission') || err?.code === 'permission-denied')) {
      try {
        await auth.currentUser.getIdToken(true);
        await deleteDoc(doc(db, 'breakingNews', id));
        return;
      } catch (retryErr) {
        console.warn('Retry delete breaking news warning:', retryErr);
      }
    }
    console.warn('Firestore delete breaking news note:', err);
  }
}

/**
 * Global Site Settings
 */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'site-settings',
  siteNameBn: 'হাজরাবাড়ী ২৪. কম',
  siteNameEn: 'Hazarabari 24',
  tagline: 'সত্যের পথে, সংবাদের সাথে',
  logoUrl: '/images/official_logo.png',
  editorName: 'মো. আল-আমীন শেখ',
  executiveEditor: 'ড. এম. এ. হাসান',
  contactEmail: 'news@hazarabari24.com',
  adsEmail: 'ads@hazarabari24.com',
  phone: '+৮৮০১৭১২-৩৪৫৬৭৮',
  officeHazrabari: 'হাজরাবাড়ী পৌরসভা, মেলান্দহ, জামালপুর',
  officeDhaka: 'পুরানা পল্টন লাইন, ঢাকা-১০০০, বাংলাদেশ।',
  breakingTickerActive: true,
};

const SITE_SETTINGS_KEY = 'hazrabari_site_settings';

export function getCachedSiteSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(SITE_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate old address if found in cache
      if (parsed.officeHazrabari && parsed.officeHazrabari.includes('মাদারগঞ্জ')) {
        parsed.officeHazrabari = 'হাজরাবাড়ী পৌরসভা, মেলান্দহ, জামালপুর';
        localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(parsed));
      }
      return { ...DEFAULT_SITE_SETTINGS, ...parsed };
    }
  } catch {}
  return DEFAULT_SITE_SETTINGS;
}

export function subscribeToSiteSettings(callback: (settings: SiteSettings) => void): () => void {
  // Call immediately with cached or default for instant render
  callback(getCachedSiteSettings());

  return onSnapshot(
    doc(db, 'settings', 'site-settings'),
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as SiteSettings;
        let officeHazrabari = data.officeHazrabari || DEFAULT_SITE_SETTINGS.officeHazrabari;
        if (officeHazrabari.includes('মাদারগঞ্জ')) {
          officeHazrabari = 'হাজরাবাড়ী পৌরসভা, মেলান্দহ, জামালপুর';
        }
        const merged: SiteSettings = {
          ...DEFAULT_SITE_SETTINGS,
          ...data,
          officeHazrabari,
        };
        localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(merged));
        callback(merged);
      }
    },
    (err) => {
      console.warn('Site settings snapshot notice:', err);
    }
  );
}

export async function getSiteSettingsFromFirestore(): Promise<SiteSettings> {
  const cached = getCachedSiteSettings();
  try {
    const snap = await getDoc(doc(db, 'settings', 'site-settings'));
    if (snap.exists()) {
      const data = snap.data() as SiteSettings;
      let officeHazrabari = data.officeHazrabari || DEFAULT_SITE_SETTINGS.officeHazrabari;
      if (officeHazrabari.includes('মাদারগঞ্জ')) {
        officeHazrabari = 'হাজরাবাড়ী পৌরসভা, মেলান্দহ, জামালপুর';
      }
      const merged: SiteSettings = {
        ...DEFAULT_SITE_SETTINGS,
        ...data,
        officeHazrabari,
      };
      localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('Failed to fetch site settings from Firestore:', err);
  }
  return cached;
}

export async function saveSiteSettingsToFirestore(settings: Partial<SiteSettings>): Promise<void> {
  const current = getCachedSiteSettings();
  const updated: SiteSettings = {
    ...current,
    ...settings,
    id: 'site-settings',
  };

  // Immediate synchronous cache update so page refresh or any component has the new values instantly
  localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(updated));

  const payload = sanitizeForFirestore(updated);
  try {
    await setDoc(doc(db, 'settings', 'site-settings'), payload, { merge: true });
  } catch (err: any) {
    if (auth.currentUser && (err?.message?.includes('permission') || err?.code === 'permission-denied')) {
      try {
        await auth.currentUser.getIdToken(true);
        await setDoc(doc(db, 'settings', 'site-settings'), payload, { merge: true });
        return;
      } catch (retryErr) {
        console.warn('Retry save site settings warning:', retryErr);
      }
    }
    console.warn('Save site settings notice:', err);
  }
}
