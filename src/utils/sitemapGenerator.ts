/**
 * Helper to escape special XML characters
 */
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Format date string (e.g. "15-08-2026" or ISO) to standard YYYY-MM-DD format for XML sitemaps
 */
function formatSitemapDate(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  try {
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr.trim())) {
      const parts = dateStr.trim().split('-');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch {
    // fallback
  }
  return new Date().toISOString().split('T')[0];
}

export interface SitemapJobItem {
  id: string;
  title: string;
  category: string;
  postDate?: string;
  isNew?: boolean;
  shortInfo?: string;
}

/**
 * Generates valid XML sitemap string compliant with Google Search Console standards.
 */
export function generateSitemapXml(jobs: SitemapJobItem[], baseUrl: string): string {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  const nowStr = new Date().toISOString().split('T')[0];

  const categories = [
    { id: 'latest-jobs', priority: '0.9', freq: 'daily' },
    { id: 'admit-cards', priority: '0.9', freq: 'daily' },
    { id: 'results', priority: '0.9', freq: 'daily' },
    { id: 'answer-key', priority: '0.8', freq: 'daily' },
    { id: 'syllabus', priority: '0.8', freq: 'weekly' },
    { id: 'admission', priority: '0.8', freq: 'daily' },
    { id: 'documents', priority: '0.8', freq: 'weekly' }
  ];

  let urlNodes = '';

  // 1. Root / Homepage
  urlNodes += `  <url>
    <loc>${escapeXml(cleanBaseUrl)}/</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>\n`;

  // 2. Category Tab Pages
  categories.forEach(cat => {
    urlNodes += `  <url>
    <loc>${escapeXml(cleanBaseUrl)}/?tab=${cat.id}</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>${cat.freq}</changefreq>
    <priority>${cat.priority}</priority>
  </url>\n`;
  });

  // 3. Individual Job Detail Pages
  jobs.forEach(job => {
    const jobUrl = `${cleanBaseUrl}/?jobId=${encodeURIComponent(job.id)}`;
    const lastMod = formatSitemapDate(job.postDate);
    const priority = job.isNew ? '0.9' : '0.8';

    urlNodes += `  <url>
    <loc>${escapeXml(jobUrl)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>\n`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlNodes}</urlset>`;
}
