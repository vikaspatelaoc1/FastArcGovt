import { isSyntheticOrBrokenDomain } from './govtPortals';

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

