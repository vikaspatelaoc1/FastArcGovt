export function normalizeExternalUrl(url?: string): string {
  if (!url || typeof url !== 'string' || !url.trim() || url.trim() === '#') return '';
  
  let clean = url.trim();

  // Remove invalid characters like quotation marks and angle brackets
  clean = clean.replace(/['"<>]/g, '');

  // Fix protocol relative URLs
  if (clean.startsWith('//')) {
    clean = 'https:' + clean;
  }

  // Ensure protocol exists
  if (!/^https?:\/\//i.test(clean)) {
    if (/^(javascript|data|file):/i.test(clean)) return '';
    clean = `https://${clean}`;
  }

  // Fix duplicate protocols
  clean = clean.replace(/^https?:\/\/(https?:\/\/)+/i, 'https://');
  
  // Fix double slashes in path (but not in protocol)
  clean = clean.replace(/([^:])\/\//g, '$1/');

  try {
    const u = new URL(clean);
    
    // Many Indian govt websites require 'www.' to resolve properly.
    // If it's a naked domain like 'upsc.gov.in' or 'ssc.nic.in', add 'www.'
    const hostParts = u.hostname.split('.');
    
    // Heuristic: if it has 2 parts (example.com) or 3 parts ending in country code (example.gov.in)
    // and it's not already starting with www.
    if (!u.hostname.startsWith('www.')) {
      const isCountryTLD = hostParts.length === 3 && hostParts[2].length === 2;
      const isNormalTLD = hostParts.length === 2;
      
      if (isNormalTLD || isCountryTLD) {
        u.hostname = 'www.' + u.hostname;
      }
    }

    return u.toString();
  } catch {
    return clean;
  }
}
