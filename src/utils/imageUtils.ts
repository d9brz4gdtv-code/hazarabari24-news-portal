/**
 * Image resolution and error fallback utility for Hazrabari 24
 * Ensures all local images, Vite bundles, and uploaded images resolve cleanly in all environments.
 */

export const DEFAULT_NEWS_FALLBACK_IMAGE = '/images/hazrabari_mayor_election.jpg';
export const BAZAR_IMAGE = '/images/hazrabari_bazar_1792213090999.jpg';
export const ROAD_IMAGE = '/images/hazrabari_road_1792213104200.jpg';
export const ADMIN_IMAGE = '/images/hazrabari_admin_1792213122080.jpg';
export const NATIONAL_IMAGE = '/images/lead_story_national_1791700530475.jpg';
export const SPORTS_IMAGE = '/images/sports_cricket_action_1791700545844.jpg';
export const TECH_IMAGE = '/images/tech_business_summit_1791700557910.jpg';
export const GALLERY_IMAGE = '/images/photo_gallery_coxsbazar_1791700570601.jpg';

// Mapping table for known image file names
const KNOWN_IMAGES: Record<string, string> = {
  'hazrabari_mayor_election.jpg': DEFAULT_NEWS_FALLBACK_IMAGE,
  'hazrabari_bazar_1792213090999.jpg': BAZAR_IMAGE,
  'hazrabari_road_1792213104200.jpg': ROAD_IMAGE,
  'hazrabari_admin_1792213122080.jpg': ADMIN_IMAGE,
  'lead_story_national_1791700530475.jpg': NATIONAL_IMAGE,
  'sports_cricket_action_1791700545844.jpg': SPORTS_IMAGE,
  'tech_business_summit_1791700557910.jpg': TECH_IMAGE,
  'photo_gallery_coxsbazar_1791700570601.jpg': GALLERY_IMAGE,
};

/**
 * Resolves any image URL to a reliable, working browser path
 */
export function getSafeImageUrl(rawUrl?: string | null, fallback: string = DEFAULT_NEWS_FALLBACK_IMAGE): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return fallback;
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return fallback;
  }

  // Blob or inline data URLs (e.g. fresh file uploads or compressed previews)
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Match known local image names
  for (const [filename, publicPath] of Object.entries(KNOWN_IMAGES)) {
    if (trimmed.includes(filename)) {
      return publicPath;
    }
  }

  // Handle paths pointing to dev assets directory like /src/assets/images/xyz.jpg or assets/images/xyz.jpg
  if (trimmed.includes('/assets/images/') || trimmed.includes('src/assets/images/')) {
    const filename = trimmed.split('/').pop();
    if (filename) {
      if (KNOWN_IMAGES[filename]) {
        return KNOWN_IMAGES[filename];
      }
      return `/images/${filename}`;
    }
  }

  // If it's already a public path or full URL (http, https, /images/, /assets/)
  if (trimmed.startsWith('/') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Fallback for relative paths without leading slash
  return `/${trimmed}`;
}

/**
 * Universal onError handler for <img> elements
 * Prevents broken image icons by replacing with high-quality fallback and stopping loops
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = DEFAULT_NEWS_FALLBACK_IMAGE
): void {
  const img = event.currentTarget;
  if (img.dataset.hasFallback === 'true') {
    // If fallback also fails, avoid infinite loop
    return;
  }
  img.dataset.hasFallback = 'true';
  img.src = fallback;
}
