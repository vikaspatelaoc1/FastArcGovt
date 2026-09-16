import React from 'react';
import { normalizeExternalUrl } from '../utils/urlUtils';
import { ExternalLink } from 'lucide-react';

export interface SafeExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  url?: string;
  fallbackUrl?: string;
  fallbackText?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function SafeExternalLink({
  url,
  fallbackUrl = 'https://www.india.gov.in',
  fallbackText = 'Official Portal',
  showIcon = true,
  children,
  className,
  ...props
}: SafeExternalLinkProps) {
  let targetUrl = normalizeExternalUrl(url);
  let isFallback = false;

  if (!targetUrl && fallbackUrl) {
    targetUrl = normalizeExternalUrl(fallbackUrl);
    isFallback = true;
  }

  if (!targetUrl) {
    return (
      <span
        className={`inline-flex items-center justify-center opacity-50 cursor-not-allowed ${className || ''}`}
        title="This link is currently being verified. Please visit the official state/national portal."
      >
        {children || fallbackText}
      </span>
    );
  }

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={isFallback ? 'Visit Official National / State Govt Portal' : undefined}
      className={`inline-flex items-center justify-center ${className || ''}`}
      {...props}
    >
      {children}
      {showIcon && <ExternalLink className="w-4 h-4 ml-1.5 flex-shrink-0" />}
    </a>
  );
}
