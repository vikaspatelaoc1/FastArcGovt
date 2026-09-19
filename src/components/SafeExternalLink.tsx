import React from 'react';
import { normalizeExternalUrl, openInDefaultBrowser, isStandaloneApp } from '../utils/urlUtils';
import { ExternalLink } from 'lucide-react';
import { trackLinkClick } from '../utils/trafficAnalytics';

export interface SafeExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  url?: string;
  fallbackUrl?: string;
  fallbackText?: string;
  showIcon?: boolean;
  linkType?: string;
  jobTitle?: string;
  category?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SafeExternalLink({
  url,
  fallbackUrl = 'https://www.india.gov.in',
  fallbackText = 'Official Portal',
  showIcon = true,
  linkType,
  jobTitle,
  category,
  children,
  className,
  onClick,
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackLinkClick(targetUrl, linkType, jobTitle, category);
    
    // In standalone mobile PWA or mobile app mode, ensure opening in user's default browser
    if (isStandaloneApp()) {
      e.preventDefault();
      openInDefaultBrowser(targetUrl, e);
    }
    
    if (onClick) onClick(e);
  };

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer external"
      onClick={handleClick}
      title={isFallback ? 'Visit Official National / State Govt Portal' : undefined}
      className={`inline-flex items-center justify-center ${className || ''}`}
      {...props}
    >
      {children}
      {showIcon && <ExternalLink className="w-4 h-4 ml-1.5 flex-shrink-0" />}
    </a>
  );
}

