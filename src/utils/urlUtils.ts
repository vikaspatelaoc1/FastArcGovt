import { isSyntheticOrBrokenDomain } from './govtPortals';

/**
 * Checks if the app is currently running in standalone (installed PWA / mobile app) mode.
 */
export function isStandaloneApp(): boolean {
  if (typeof window === 'undefined') return false;
  const isStandalone = 
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://') ||
    window.location.search.includes('mode=app');
  return !!isStandalone;
}

export function normalizeExternalUrl(url?: string): string {
  if (!url || typeof url !== 'string' || !url.trim() || url.trim() === '#') return '';
  
  let clean = url.trim();

  // Handle invalid markers or placeholders
  if (clean.toLowerCase() === 'needs review' || clean.toLowerCase() === 'n/a' || clean.toLowerCase() === 'pending') {
    return '';
  }

  // Remove invalid characters like quotation marks and angle brackets
  clean = clean.replace(/['"<>]/g, '');

  // Fix protocol relative URLs
  if (clean.startsWith('//')) {
    clean = 'https:' + clean;
  }

  // Ensure protocol exists
  if (!/^https?:\/\//i.test(clean)) {
    if (/^(javascript|data|file):/i.test(clean)) return '';
    // If it doesn't have a dot in the domain part, it's not a valid URL
    if (!clean.includes('.')) return '';
    clean = `https://${clean}`;
  }

  // Fix duplicate protocols
  clean = clean.replace(/^https?:\/\/(https?:\/\/)+/i, 'https://');
  
  // Fix double slashes in path (but not in protocol)
  clean = clean.replace(/([^:])\/\//g, '$1/');

  try {
    const u = new URL(clean);

    // Filter out synthetic or broken domains
    if (isSyntheticOrBrokenDomain(u.hostname)) {
      return '';
    }
    
    // Only prepend 'www.' for specific known domains that strictly require it
    const requiresWww = new Set(['upsc.gov.in', 'ibps.in', 'india.gov.in']);
    if (requiresWww.has(u.hostname.toLowerCase())) {
      u.hostname = 'www.' + u.hostname;
    }

    return u.toString();
  } catch {
    return '';
  }
}

/**
 * Opens any external job/portal link in the user's DEFAULT BROWSER on a NEW PAGE.
 * Specifically configured for installed mobile apps (PWA / Android standalone),
 * ensuring the phone's default browser (Chrome, Samsung Internet, Firefox, Edge, etc.)
 * is invoked instead of staying trapped in a webview.
 */
export function openInDefaultBrowser(url: string, e?: React.MouseEvent | MouseEvent | Event): void {
  if (e) {
    if ('stopPropagation' in e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
  }

  const targetUrl = normalizeExternalUrl(url);
  if (!targetUrl) return;

  if (typeof window === 'undefined') return;

  try {
    // 1. Create a dynamic, untruncated link element with explicit external rel
    const link = document.createElement('a');
    link.href = targetUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer external';
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer external');

    // On mobile devices / Android PWA, standard programmatic click on anchor with rel="external"
    // triggers the OS default browser intent
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    try {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = targetUrl;
    }
  }
}


