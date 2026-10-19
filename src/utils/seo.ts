/**
 * SEO & OpenGraph Social Share Utility
 * Ensures that whenever pages or articles are viewed or shared,
 * full OpenGraph and Twitter card metadata (including large logo preview)
 * are accurately set and formatted for Facebook, WhatsApp, Twitter/X, LinkedIn, etc.
 */

export interface MetaTagsConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

const DEFAULT_BANNER = '/images/og-image.png';
const DEFAULT_TITLE = 'হাজরাবাড়ী ২৪. কম - Hazarabari 24';
const DEFAULT_DESC = 'হাজরাবাড়ী ২৪. কম (Hazarabari 24) — সত্যের পথে, সংবাদের সাথে। জাতীয়, রাজনীতি, অর্থনীতি, খেলাধুলা, আন্তর্জাতিক ও সারাদেশের নির্ভরযোগ্য সংবাদমাধ্যম।';

export function updatePageMetaTags(config: MetaTagsConfig = {}) {
  if (typeof document === 'undefined') return;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://hazarabari24.com';
  const currentUrl = config.url || (typeof window !== 'undefined' ? window.location.href : 'https://hazarabari24.com');

  const title = config.title
    ? `${config.title} | হাজরাবাড়ী ২৪. কম`
    : DEFAULT_TITLE;
  const description = config.description || DEFAULT_DESC;

  // Resolve image to absolute URL
  let imageUrl = config.image || DEFAULT_BANNER;
  if (imageUrl.startsWith('/')) {
    imageUrl = `${origin}${imageUrl}`;
  }

  // Update document title
  document.title = title;

  // Helper to set or create meta tag
  const setMeta = (attributeName: 'name' | 'property', attrValue: string, contentValue: string) => {
    let el = document.querySelector(`meta[${attributeName}="${attrValue}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attributeName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', contentValue);
  };

  // Standard Meta
  setMeta('name', 'description', description);

  // OpenGraph (Facebook, WhatsApp, LinkedIn)
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', currentUrl);
  setMeta('property', 'og:type', config.type || 'website');
  setMeta('property', 'og:site_name', 'হাজরাবাড়ী ২৪. কম');
  setMeta('property', 'og:locale', 'bn_BD');
  setMeta('property', 'og:image', imageUrl);
  setMeta('property', 'og:image:secure_url', imageUrl);
  setMeta('property', 'og:image:type', 'image/png');
  setMeta('property', 'og:image:width', '1200');
  setMeta('property', 'og:image:height', '630');
  setMeta('property', 'og:image:alt', 'হাজরাবাড়ী ২৪. কম - অফিসিয়াল লোগো');

  // Twitter / X (Large Image Summary Card)
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', imageUrl);
  setMeta('name', 'twitter:image:alt', 'হাজরাবাড়ী ২৪. কম লোগো');

  // Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', currentUrl);
}
