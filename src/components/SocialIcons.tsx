import React from 'react';
import { SocialPlatform } from '../types';

interface SocialIconProps {
  platform: SocialPlatform | string;
  className?: string;
  size?: number;
}

export const OfficialSocialLogo: React.FC<SocialIconProps> = ({ 
  platform, 
  className = "w-5 h-5",
  size
}) => {
  const sizeStyle = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  switch (platform) {
    case 'telegram':
      return (
        <svg 
          viewBox="0 0 24 24" 
          className={className} 
          style={sizeStyle}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ios-tg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          <path 
            d="M21.6 3.4a1.2 1.2 0 0 0-1.3-.2L2.8 10.4a1.2 1.2 0 0 0 .1 2.2l4.8 1.6 1.8 5.6a1.2 1.2 0 0 0 2 .4l2.8-2.6 4.9 3.6a1.2 1.2 0 0 0 1.9-.7l3.2-15.5a1.2 1.2 0 0 0-.9-1.6zM9.5 13.7l8.7-6.2-7 7.6-.4 3.7-1.3-5.1z" 
            fill="url(#ios-tg-grad)"
          />
        </svg>
      );

    case 'whatsapp':
      return (
        <svg 
          viewBox="0 0 24 24" 
          className={className} 
          style={sizeStyle}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ios-wa-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
          </defs>
          <path 
            d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.08L2 22l5.08-1.34A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.2a8.17 8.17 0 0 1-4.21-1.16l-.3-.18-3.08.81.82-3-.2-.32A8.18 8.18 0 0 1 3.8 12c0-4.52 3.68-8.2 8.2-8.2 4.52 0 8.2 3.68 8.2 8.2 0 4.52-3.68 8.2-8.2 8.2zm4.64-6.13c-.25-.13-1.5-.74-1.74-.82-.23-.09-.4-.13-.57.13-.17.25-.66.82-.81.99-.15.17-.3.19-.55.06-.25-.13-1.07-.4-2.04-1.26-.76-.68-1.27-1.52-1.42-1.77-.15-.25-.02-.39.11-.51.11-.11.25-.3.38-.44.13-.15.17-.25.25-.42.09-.17.04-.32-.02-.44-.06-.13-.57-1.38-.78-1.89-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.5-.61 1.71-1.21.21-.59.21-1.1.15-1.21-.06-.11-.23-.17-.48-.3z" 
            fill="url(#ios-wa-grad)"
          />
        </svg>
      );

    case 'youtube':
      return (
        <svg 
          viewBox="0 0 24 24" 
          className={className} 
          style={sizeStyle}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ios-yt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>
          <path 
            d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.26 5 12 5 12 5s-6.26 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26.24 26.24 0 0 0 2 12c0 1.64.14 3.25.42 4.81a2.5 2.5 0 0 0 1.76 1.77C5.74 19 12 19 12 19s6.26 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77c.28-1.56.42-3.17.42-4.81 0-1.64-.14-3.25-.42-4.81z" 
            stroke="url(#ios-yt-grad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon points="10,15 15.5,12 10,9" fill="url(#ios-yt-grad)" />
        </svg>
      );

    case 'instagram':
      return (
        <svg 
          viewBox="0 0 24 24" 
          className={className} 
          style={sizeStyle}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ios-ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="35%" stopColor="#F43F5E" />
              <stop offset="70%" stopColor="#D946EF" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <rect 
            x="3" 
            y="3" 
            width="18" 
            height="18" 
            rx="5.5" 
            stroke="url(#ios-ig-grad)" 
            strokeWidth="2" 
          />
          <circle 
            cx="12" 
            cy="12" 
            r="4" 
            stroke="url(#ios-ig-grad)" 
            strokeWidth="2" 
          />
          <circle cx="17.2" cy="6.8" r="1.2" fill="url(#ios-ig-grad)" />
        </svg>
      );

    case 'twitter':
      return (
        <svg 
          viewBox="0 0 24 24" 
          className={className} 
          style={sizeStyle}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ios-tw-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          <path 
            d="M18.244 4.5h2.528l-5.522 6.311 6.496 8.589h-5.088l-3.985-5.211-4.561 5.211H5.584l5.908-6.753L5.256 4.5h5.217l3.603 4.764L18.244 4.5zm-.887 13.385h1.401L9.043 5.942H7.54l9.817 11.943z" 
            fill="url(#ios-tw-grad)"
          />
        </svg>
      );

    case 'facebook':
      return (
        <svg 
          viewBox="0 0 24 24" 
          className={className} 
          style={sizeStyle}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ios-fb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="9.5" stroke="url(#ios-fb-grad)" strokeWidth="1.8" />
          <path 
            d="M13.5 12h2l.4-2.5h-2.4V8c0-.7.2-1.2 1.2-1.2h1.3V4.6c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6V9.5H8.2V12h2.2v6.5h3.1V12z" 
            fill="url(#ios-fb-grad)"
          />
        </svg>
      );

    case 'linkedin':
      return (
        <svg 
          viewBox="0 0 24 24" 
          className={className} 
          style={sizeStyle}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ios-li-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
          </defs>
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="url(#ios-li-grad)" strokeWidth="1.8" />
          <path 
            d="M7 10h2.5v7H7v-7zm1.25-3.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM11.5 10H14v1h.03c.35-.6 1.15-1.2 2.37-1.2 2.5 0 3 1.6 3 3.7V17h-2.5v-3.7c0-.9-.02-2-1.25-2s-1.45 1-1.45 2V17h-2.7V10z" 
            fill="url(#ios-li-grad)"
          />
        </svg>
      );

    case 'discord':
      return (
        <svg 
          viewBox="0 0 24 24" 
          className={className} 
          style={sizeStyle}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ios-dc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A5B4FC" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          <path 
            d="M18.9 5.8a14.2 14.2 0 0 0-3.5-1.1c-.2.3-.3.7-.5 1-1.3-.2-2.6-.2-3.8 0-.2-.3-.3-.7-.5-1A14.2 14.2 0 0 0 7.1 5.8C4.5 9.7 3.8 13.5 4.1 17.2a14.3 14.3 0 0 0 4.4 2.2c.4-.5.7-1 1-1.5-.5-.2-1-.4-1.4-.7.1-.1.2-.2.3-.3 2.8 1.3 5.8 1.3 8.6 0 .1.1.2.2.3.3-.4.3-.9.5-1.4.7.3.5.6 1 1 1.5a14.3 14.3 0 0 0 4.4-2.2c.5-4.4-.7-8.1-3.4-11.4zM9.5 14.5c-.8 0-1.5-.7-1.5-1.6s.7-1.6 1.5-1.6 1.5.7 1.5 1.6-.7 1.6-1.5 1.6zm5 0c-.8 0-1.5-.7-1.5-1.6s.7-1.6 1.5-1.6 1.5.7 1.5 1.6-.7 1.6-1.5 1.6z" 
            fill="url(#ios-dc-grad)"
          />
        </svg>
      );

    default:
      return (
        <svg 
          viewBox="0 0 24 24" 
          className={className} 
          style={sizeStyle}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ios-def-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="9.5" stroke="url(#ios-def-grad)" strokeWidth="1.8" />
          <path 
            d="M12 2.5a14 14 0 0 0 0 19M12 2.5a14 14 0 0 1 0 19M2.5 12h19M4 7.5h16M4 16.5h16" 
            stroke="url(#ios-def-grad)" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
          />
        </svg>
      );
  }
};

