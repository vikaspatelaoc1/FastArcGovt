import React from 'react';
import { normalizeExternalUrl } from '../utils/urlUtils';
import { ExternalLink } from 'lucide-react';

interface SafeExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  url?: string;
  fallbackText?: string;
  showIcon?: boolean;
}

export function SafeExternalLink({ url, fallbackText = 'Link unavailable', showIcon = true, children, className, ...props }: SafeExternalLinkProps) {
  const normalizedUrl = normalizeExternalUrl(url);

  if (!normalizedUrl) {
    // Return a disabled/dead element if URL is invalid or empty
    return (
      <span
        className={`inline-flex items-center justify-center opacity-50 cursor-not-allowed ${className || ''}`}
        title="This link is currently unavailable. Please try again later."
      >
        {children || fallbackText}
      </span>
    );
  }

  return (
    <a
      href={normalizedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center ${className || ''}`}
      {...props}
    >
      {children}
      {showIcon && <ExternalLink className="w-4 h-4 ml-2" />}
    </a>
  );
}
