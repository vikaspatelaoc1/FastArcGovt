import type React from 'react';
import { JobAlert } from '../types';
import { generateJobSlug } from './jobEnricher';

/**
 * Returns the dynamic Job Details page URL (supports both clean slug or query param)
 */
export function getJobDetailUrl(jobOrId: JobAlert | string): string {
  if (typeof jobOrId === 'string') {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.origin);
      url.searchParams.set('jobId', jobOrId);
      return url.toString();
    }
    return `/?jobId=${encodeURIComponent(jobOrId)}`;
  }

  const id = jobOrId.id;
  const slug = jobOrId.slug || (jobOrId.title ? generateJobSlug(jobOrId.title, id) : id);

  // Use URL with jobId param to guarantee flawless client-side routing on any host while maintaining clean title
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.origin);
    url.searchParams.set('jobId', id);
    if (slug) {
      url.searchParams.set('slug', slug);
    }
    return url.toString();
  }
  return `/?jobId=${encodeURIComponent(id)}`;
}

/**
 * Opens the Job Details page in a new browser tab with proper security attributes
 */
export function openJobInNewTab(jobOrId: JobAlert | string, e?: React.MouseEvent): void {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  const targetUrl = getJobDetailUrl(jobOrId);
  if (typeof window !== 'undefined') {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Extracts current job ID or Slug from current window URL
 */
export function getJobIdentifierFromUrl(): { jobId: string | null; slug: string | null } {
  if (typeof window === 'undefined') return { jobId: null, slug: null };

  const params = new URLSearchParams(window.location.search);
  const jobId = params.get('jobId') || params.get('id') || null;
  const slug = params.get('slug') || params.get('job') || null;

  // Also check pathname like /jobs/:slug or /job/:slug
  const pathname = window.location.pathname;
  const pathMatch = pathname.match(/^\/(?:jobs|job)\/([^\/?#]+)/i);
  if (pathMatch && pathMatch[1]) {
    const extracted = decodeURIComponent(pathMatch[1]);
    return {
      jobId: jobId || extracted,
      slug: slug || extracted
    };
  }

  return { jobId, slug };
}
