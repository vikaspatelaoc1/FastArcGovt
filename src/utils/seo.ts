import { JobAlert } from '../types';
import { saveSeoConfigToFirestore } from '../services/firestoreService';

export interface GlobalSeoConfig {
  siteTitle: string;
  metaDescription: string;
  metaKeywords: string;
  authorName: string;
  ogImageUrl: string;
  robotsDirective: string;
}

export const DEFAULT_GLOBAL_SEO: GlobalSeoConfig = {
  siteTitle: "Fast_Arc Govt Result | Latest Online Form, Admit Card & Results 2026",
  metaDescription: "FastArc Government Jobs Portal: Get instant updates for latest Sarkari Naukri, Online Forms, Admit Cards, Exam Results, Answer Keys, Syllabus & Admissions 2026.",
  metaKeywords: "Sarkari Result, Govt Jobs 2026, Latest Online Form, Admit Card, Exam Results, Answer Key, FastArc, Recruitment Notification",
  authorName: "FastArc Portal Team",
  ogImageUrl: "/logo.png",
  robotsDirective: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
};

const SEO_STORAGE_KEY = 'fastarc_global_seo_config';

/**
 * Loads custom global SEO configuration from LocalStorage or returns defaults.
 */
export function loadGlobalSeoConfig(): GlobalSeoConfig {
  if (typeof window === 'undefined') return DEFAULT_GLOBAL_SEO;
  try {
    const saved = localStorage.getItem(SEO_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_GLOBAL_SEO, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to parse saved SEO config from localStorage:', err);
  }
  return DEFAULT_GLOBAL_SEO;
}

/**
 * Saves global SEO configuration to LocalStorage and triggers live update event.
 */
export function saveGlobalSeoConfig(config: GlobalSeoConfig) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SEO_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('fastarc_seo_updated', { detail: config }));

    // Asynchronously save to Firestore database
    saveSeoConfigToFirestore(config).catch(err => {
      console.warn('Firestore SEO config sync error:', err);
    });
  } catch (err) {
    console.warn('Failed to save SEO config to localStorage:', err);
  }
}

/**
 * Helper to update or create a meta tag by name or property attribute.
 */
function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper to update or create a canonical link tag.
 */
function setCanonicalUrl(url: string) {
  if (typeof document === 'undefined') return;
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

/**
 * Helper to inject or update JSON-LD Structured Data Schema for Google indexing.
 */
function setJsonLdSchema(id: string, schemaObj: object) {
  if (typeof document === 'undefined') return;
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaObj, null, 2);
}

/**
 * Injects dynamic SEO metadata for a specific Job/Result/Admit Card detail page.
 */
export function updateJobDetailSeo(job: JobAlert) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}/?jobId=${encodeURIComponent(job.id)}`;
  const siteName = "FastArc Govt Result";

  const categoryName = job.category
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const fullTitle = `${job.title} - ${categoryName} 2026 | FastArc`;
  const description = job.shortInfo && job.shortInfo.trim().length > 20
    ? `${job.title}: ${job.shortInfo.slice(0, 160)}... Check eligibility, important dates, and apply online on FastArc.`
    : `${job.title} notification released. Check latest eligibility, total vacancies, examination dates, admit card, and direct online form links at FastArc.`;

  const keywords = [
    job.title,
    categoryName,
    "Sarkari Result",
    "Govt Jobs 2026",
    "Admit Card",
    "Answer Key",
    "Online Form",
    job.state || 'All India',
    "FastArc"
  ].filter(Boolean).join(', ');

  const imageUrl = `${baseUrl}/logo.png`;

  // 1. Browser Title
  document.title = fullTitle;

  // 2. Primary Meta Tags
  setMetaTag('name', 'title', fullTitle);
  setMetaTag('name', 'description', description);
  setMetaTag('name', 'keywords', keywords);
  setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  // 3. Canonical Link
  setCanonicalUrl(canonicalUrl);

  // 4. OpenGraph Meta Tags
  setMetaTag('property', 'og:type', 'article');
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:title', fullTitle);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:image', imageUrl);
  setMetaTag('property', 'og:site_name', siteName);

  // 5. Twitter Meta Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:url', canonicalUrl);
  setMetaTag('name', 'twitter:title', fullTitle);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', imageUrl);

  // 6. Google JobPosting / Article Schema.org Structured Data
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": description,
    "datePosted": job.dates?.start || job.postDate || new Date().toISOString().split('T')[0],
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Government Recruitment / Exam Board",
      "sameAs": canonicalUrl
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.state || "India",
        "addressCountry": "IN"
      }
    },
    "url": canonicalUrl
  };

  if (job.dates?.last) {
    schema["validThrough"] = job.dates.last;
  }

  setJsonLdSchema('seo-schema', schema);
}

/**
 * Resets or applies the default homepage / category SEO metadata based on Super Admin custom settings.
 */
export function resetDefaultSeo(activeTab = 'home') {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const globalSeo = loadGlobalSeoConfig();
  const baseUrl = window.location.origin;

  let title = globalSeo.siteTitle || DEFAULT_GLOBAL_SEO.siteTitle;
  let canonicalUrl = `${baseUrl}/`;

  if (activeTab && activeTab !== 'home') {
    const tabName = activeTab
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    title = `${tabName} 2026 - Latest Notifications & Updates | FastArc`;
    canonicalUrl = `${baseUrl}/?tab=${encodeURIComponent(activeTab)}`;
  }

  const description = globalSeo.metaDescription || DEFAULT_GLOBAL_SEO.metaDescription;
  const keywords = globalSeo.metaKeywords || DEFAULT_GLOBAL_SEO.metaKeywords;
  const imageUrl = globalSeo.ogImageUrl?.startsWith('http')
    ? globalSeo.ogImageUrl
    : `${baseUrl}${globalSeo.ogImageUrl || '/logo.png'}`;

  // 1. Browser Title
  document.title = title;

  // 2. Primary Meta Tags
  setMetaTag('name', 'title', title);
  setMetaTag('name', 'description', description);
  setMetaTag('name', 'keywords', keywords);
  setMetaTag('name', 'author', globalSeo.authorName || 'FastArc');
  setMetaTag('name', 'robots', globalSeo.robotsDirective || DEFAULT_GLOBAL_SEO.robotsDirective);

  // 3. Canonical Link
  setCanonicalUrl(canonicalUrl);

  // 4. OpenGraph Meta Tags
  setMetaTag('property', 'og:type', 'website');
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:image', imageUrl);
  setMetaTag('property', 'og:site_name', "FastArc Govt Result");

  // 5. Twitter Meta Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:url', canonicalUrl);
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', imageUrl);

  // 6. Base WebSite Schema.org
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FastArc Govt Result",
    "url": canonicalUrl,
    "author": {
      "@type": "Organization",
      "name": globalSeo.authorName || "FastArc"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  setJsonLdSchema('seo-schema', baseSchema);
}
