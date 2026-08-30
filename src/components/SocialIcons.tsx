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
          <circle cx="12" cy="12" r="12" fill="#29B6F6"/>
          <path 
            d="M5.4 11.6L17.2 7c.6-.2 1.1.3.9.9l-2 9.5c-.1.7-.6.9-1.2.6l-3.3-2.4-1.6 1.5c-.2.2-.4.2-.6.4l.2-3.4 6.2-5.6c.3-.2-.1-.4-.4-.2l-7.7 4.8-3.3-1c-.7-.2-.7-.7.2-1.1z" 
            fill="white"
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
          <circle cx="12" cy="12" r="12" fill="#25D366"/>
          <path 
            d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-1 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5 0 1.5 1.1 2.9 1.2 3.1.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z" 
            fill="white"
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
          <rect width="24" height="24" rx="6" fill="#FF0000"/>
          <path 
            d="M21.5 8.2c-.2-.8-.8-1.4-1.6-1.6C18.5 6.2 12 6.2 12 6.2s-6.5 0-7.9.4c-.8.2-1.4.8-1.6 1.6C2.1 9.6 2.1 12 2.1 12s0 2.4.4 3.8c.2.8.8 1.4 1.6 1.6 1.4.4 7.9.4 7.9.4s6.5 0 7.9-.4c.8-.2 1.4-.8 1.6-1.6.4-1.4.4-3.8.4-3.8s0-2.4-.4-3.8z" 
            fill="#FF0000"
          />
          <path 
            d="M10 15.2l5.5-3.2L10 8.8v6.4z" 
            fill="white"
          />
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
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="5%" stopColor="#fdf497" />
              <stop offset="45%" stopColor="#fd5949" />
              <stop offset="60%" stopColor="#d6249f" />
              <stop offset="90%" stopColor="#285AEB" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="6" fill="url(#ig-grad)"/>
          <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
          <circle cx="12" cy="12" r="3.5" stroke="white" strokeWidth="1.8" fill="none"/>
          <circle cx="16.3" cy="7.7" r="1.1" fill="white"/>
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
          <rect width="24" height="24" rx="6" fill="#000000"/>
          <path 
            d="M18.244 4.5h2.528l-5.522 6.311 6.496 8.589h-5.088l-3.985-5.211-4.561 5.211H5.584l5.908-6.753L5.256 4.5h5.217l3.603 4.764L18.244 4.5zm-.887 13.385h1.401L9.043 5.942H7.54l9.817 11.943z" 
            fill="white"
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
          <circle cx="12" cy="12" r="12" fill="#1877F2"/>
          <path 
            d="M14.5 12.8l.5-3.3h-3.2V7.4c0-.9.3-1.6 1.6-1.6H15V2.9c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.2H5.1v3.3H8v8.3c.6.1 1.3.1 2 .1s1.4 0 2-.1v-8.3h2.5z" 
            fill="white"
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
          <rect width="24" height="24" rx="6" fill="#0A66C2"/>
          <path 
            d="M6.5 9.5H9v8.5H6.5V9.5zm1.25-4c.8 0 1.45.65 1.45 1.45S8.55 8.4 7.75 8.4 6.3 7.75 6.3 6.95 6.95 5.5 7.75 5.5zM11 9.5h2.4v1.2h.03c.33-.63 1.14-1.3 2.37-1.3 2.53 0 3 1.66 3 3.83V18h-2.5v-3.95c0-.94-.02-2.15-1.31-2.15-1.31 0-1.51 1.02-1.51 2.08V18H11V9.5z" 
            fill="white"
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
          <rect width="24" height="24" rx="6" fill="#5865F2"/>
          <path 
            d="M17.4 6.7a13.3 13.3 0 0 0-3.3-1 .1.1 0 0 0-.1.05c-.14.26-.3.6-.4.86a12.3 12.3 0 0 0-3.6 0c-.12-.26-.28-.6-.42-.86a.1.1 0 0 0-.1-.05 13.3 13.3 0 0 0-3.3 1 .1.1 0 0 0-.05.04C4.1 9.9 3.5 13 3.8 16.1a.1.1 0 0 0 .04.08 13.4 13.4 0 0 0 4 2 .1.1 0 0 0 .12-.04c.3-.42.58-.87.82-1.34a.1.1 0 0 0-.06-.14 8.8 8.8 0 0 1-1.25-.6.1.1 0 0 1 0-.16c.09-.06.17-.13.25-.2a.1.1 0 0 1 .1 0 9.5 9.5 0 0 0 8.36 0 .1.1 0 0 1 .1 0c.08.07.16.14.25.2a.1.1 0 0 1 0 .16 8.8 8.8 0 0 1-1.25.6.1.1 0 0 0-.06.14c.24.47.52.92.82 1.34a.1.1 0 0 0 .12.04 13.4 13.4 0 0 0 4.04-2 .1.1 0 0 0 .04-.08c.36-3.6-.62-6.7-2.3-9.36a.1.1 0 0 0-.04-.04zM8.8 14.1c-.8 0-1.45-.73-1.45-1.63 0-.9.64-1.63 1.45-1.63.82 0 1.47.74 1.45 1.63 0 .9-.63 1.63-1.45 1.63zm6.4 0c-.8 0-1.45-.73-1.45-1.63 0-.9.64-1.63 1.45-1.63.82 0 1.47.74 1.45 1.63 0 .9-.63 1.63-1.45 1.63z" 
            fill="white"
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
          <circle cx="12" cy="12" r="12" fill="#F59E0B"/>
          <path 
            d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 17.93V18c0-.55-.45-1-1-1h-2v-2h2c1.1 0 2-.9 2-2v-1l4.07-2.03A8.006 8.006 0 0 1 13 19.93zM6.07 14.5A7.97 7.97 0 0 1 4 12c0-2.22.9-4.22 2.36-5.68l1.41 1.41C6.67 8.82 6 10.33 6 12c0 .88.22 1.7.6 2.43L6.07 14.5z" 
            fill="white"
          />
        </svg>
      );
  }
};
