import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Mic, MicOff, X, Sparkles } from 'lucide-react';
import { JobAlert, SocialLinkItem } from '../types';
import { ColumnConfigsMap } from '../utils/columnConfig';
import { isImageIconUrl } from './CategoryIcon';
import { OfficialSocialLogo } from './SocialIcons';

interface ModernAppViewProps {
  jobs: JobAlert[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onSelectJob?: (job: JobAlert) => void;
  socialLinks?: SocialLinkItem[];
  siteLogo?: string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  columnConfigs?: ColumnConfigsMap;
}

export const ModernAppView: React.FC<ModernAppViewProps> = ({
  jobs,
  activeTab,
  onTabChange,
  onSelectJob,
  socialLinks,
  siteLogo = "/logo.png",
  searchQuery = "",
  setSearchQuery,
  columnConfigs
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Trending slides with recruitment themes matching the screenshot
  const trendingSlides = [
    {
      id: 'ssc-chsl',
      title: 'SSC 10+2 CHSL Apply Online',
      subtitle: 'Staff Selection Commission Combined Higher Secondary Level (10+2) Examination 2026',
      gradient: 'from-[#7db61a] via-[#85b822] to-[#8c1328]',
      readMoreColor: 'text-[#8c1328]',
      category: 'latest-jobs',
      boardText: 'इतिहास'
    },
    {
      id: 'railway-alp',
      title: 'Railway RRB ALP & Technician Online Form',
      subtitle: 'Ministry of Railways Recruitment Board 18,799+ Vacancies Apply Online',
      gradient: 'from-[#ea580c] via-[#f97316] to-[#991b1b]',
      readMoreColor: 'text-[#991b1b]',
      category: 'latest-jobs',
      boardText: 'भूगोल'
    },
    {
      id: 'upsc-civil',
      title: 'UPSC Civil Services Pre 2026 Apply',
      subtitle: 'Union Public Service Commission IAS / IFS Examination Online Application',
      gradient: 'from-[#0284c7] via-[#0369a1] to-[#1e1b4b]',
      readMoreColor: 'text-[#0369a1]',
      category: 'latest-jobs',
      boardText: 'संविधान'
    },
    {
      id: 'up-police',
      title: 'UP Police Constable Exam City / Admit Card',
      subtitle: 'Uttar Pradesh Police Recruitment & Promotion Board 60,244 Posts',
      gradient: 'from-[#10b981] via-[#059669] to-[#881337]',
      readMoreColor: 'text-[#881337]',
      category: 'admit-card',
      boardText: 'गणित'
    },
    {
      id: 'neet-jee',
      title: 'NTA NEET UG & JEE Main 2026 Registration',
      subtitle: 'National Testing Agency Medical & Engineering Entrance Exam Online Form',
      gradient: 'from-[#e11d48] via-[#be123c] to-[#4c0519]',
      readMoreColor: 'text-[#be123c]',
      category: 'admission',
      boardText: 'विज्ञान'
    },
    {
      id: 'ibps-po',
      title: 'IBPS PO / Clerk Recruitment Form',
      subtitle: 'Institute of Banking Personnel Selection Common Recruitment Process',
      gradient: 'from-[#854d0e] via-[#ca8a04] to-[#7f1d1d]',
      readMoreColor: 'text-[#7f1d1d]',
      category: 'latest-jobs',
      boardText: 'तर्कशक्ति'
    },
    {
      id: 'ctet-exam',
      title: 'CBSE CTET 2026 Online Application Form',
      subtitle: 'Central Board of Secondary Education Teacher Eligibility Test',
      gradient: 'from-[#4338ca] via-[#6366f1] to-[#831843]',
      readMoreColor: 'text-[#4338ca]',
      category: 'latest-jobs',
      boardText: 'शिक्षा'
    },
    {
      id: 'bihar-police',
      title: 'Bihar Police CSBC Constable Result & Cutoff',
      subtitle: 'Central Selection Board of Constable Bihar Police Exam Results Released',
      gradient: 'from-[#059669] via-[#10b981] to-[#1e3a8a]',
      readMoreColor: 'text-[#059669]',
      category: 'results',
      boardText: 'हिन्दी'
    }
  ];

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % trendingSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, trendingSlides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      // Next slide
      setCurrentSlide(prev => (prev + 1) % trendingSlides.length);
    } else if (diff < -40) {
      // Prev slide
      setCurrentSlide(prev => (prev - 1 + trendingSlides.length) % trendingSlides.length);
    }
    touchStartX.current = null;
  };

  // Find matching job or fallback
  const handleReadMore = (slide: typeof trendingSlides[0]) => {
    const matching = jobs.find(j => 
      j.title.toLowerCase().includes('ssc') || 
      j.title.toLowerCase().includes('chsl') ||
      j.category === slide.category
    ) || jobs[0];

    if (matching && onSelectJob) {
      onSelectJob(matching);
    } else {
      onTabChange(slide.category);
      const el = document.getElementById(`section-${slide.category}`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Round Categories from Screenshot & Column Configs
  const categories = [
    {
      id: 'home',
      label: 'HOME',
      type: 'logo',
      targetTab: 'home',
      configKey: undefined,
      icon: null
    },
    {
      id: 'latest-jobs',
      label: 'LATEST JOBS',
      type: 'jobs',
      targetTab: 'latest-jobs',
      configKey: 'latest-jobs',
      icon: (
        // Bright Golden 5-Point Star matching Screenshot PNG
        <svg viewBox="0 0 48 48" className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M24 5.5l5.8 11.8 13 1.9-9.4 9.2 2.2 13-11.6-6.1-11.6 6.1 2.2-13-9.4-9.2 13-1.9L24 5.5z" 
            fill="url(#goldStarGrad)" 
            stroke="#F59E0B" 
            strokeWidth="1.2" 
            strokeLinejoin="round" 
          />
          <defs>
            <linearGradient id="goldStarGrad" x1="24" y1="5.5" x2="24" y2="41.4" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="35%" stopColor="#FBBF24" />
              <stop offset="85%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'result',
      label: 'RESULT',
      type: 'result',
      targetTab: 'results',
      configKey: 'results',
      icon: (
        // Golden Trophy Cup matching Screenshot PNG
        <svg viewBox="0 0 48 48" className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldTrophyGrad" x1="24" y1="7" x2="24" y2="39" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="40%" stopColor="#FBBF24" />
              <stop offset="80%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          <path d="M15 9h18v11c0 5-4 9-9 9s-9-4-9-9V9z" fill="url(#goldTrophyGrad)" stroke="#D97706" strokeWidth="1.2" />
          <path d="M15 12H9a3 3 0 0 0-3 3v2a6 6 0 0 0 6 6h3" stroke="#FBBF24" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M33 12h6a3 3 0 0 1 3 3v2a6 6 0 0 1-6 6h-3" stroke="#FBBF24" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M24 29v6" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
          <rect x="14" y="35" width="20" height="4" rx="1.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />
        </svg>
      )
    },
    {
      id: 'admit-card',
      label: 'ADMIT CARD',
      type: 'admit',
      targetTab: 'admit-card',
      configKey: 'admit-cards',
      icon: (
        // White Document with blue header band matching Screenshot PNG
        <svg viewBox="0 0 48 48" className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="8" width="24" height="32" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
          <path d="M12 11a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v5H12v-5z" fill="#0284C7" />
          <line x1="17" y1="21" x2="31" y2="21" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <line x1="17" y1="26" x2="31" y2="26" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <line x1="17" y1="31" x2="26" y2="31" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'admission',
      label: 'ADMISSION',
      type: 'admission',
      targetTab: 'admission',
      configKey: 'admission',
      icon: (
        // Graduation mortarboard cap with golden tassel matching Screenshot PNG
        <svg viewBox="0 0 48 48" className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 10L6 19l18 9 18-9-18-9z" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
          <path d="M14 23.5v8c0 3.2 4.5 5.5 10 5.5s10-2.3 10-5.5v-8" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
          <path d="M38 20.5v11" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
          <circle cx="38" cy="33" r="2" fill="#FBBF24" />
        </svg>
      )
    },
    {
      id: 'answer-key',
      label: 'ANSWER KEY',
      type: 'answer',
      targetTab: 'answer-key',
      configKey: 'answer-key',
      icon: (
        // Golden diagonal key matching Screenshot PNG
        <svg viewBox="0 0 48 48" className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="17" cy="17" r="7.5" fill="none" stroke="#FBBF24" strokeWidth="3" />
          <path d="M23 23l14 14" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 32l3-3" stroke="#FBBF24" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M35 35l3-3" stroke="#FBBF24" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'syllabus',
      label: 'SYLLABUS',
      type: 'syllabus',
      targetTab: 'syllabus',
      configKey: 'syllabus',
      icon: (
        // Open book with graduation cap
        <svg viewBox="0 0 48 48" className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 28c4-2 8-2 12 1 4-3 8-3 12-1v10c-4-2-8-2-12 1-4-3-8-3-12-1V28z" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.8" />
          <path d="M24 29v10" stroke="#38BDF8" strokeWidth="1.8" />
          {/* Cap */}
          <path d="M24 10l12 6-12 6-12-6 12-6z" fill="#FBBF24" />
          <path d="M18 19v4c0 3.3 2.7 6 6 6s6-2.7 6-6v-4" fill="#FBBF24" />
          <path d="M33 17v7" stroke="#F59E0B" strokeWidth="1.8" />
        </svg>
      )
    },
    {
      id: 'certificates',
      label: 'CERTIFICATE',
      type: 'certificates',
      targetTab: 'documents',
      configKey: 'documents',
      icon: (
        // Certificate with rosette seal
        <svg viewBox="0 0 48 48" className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="11" y="9" width="26" height="30" rx="3" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="24" cy="22" r="5.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.2" />
          <path d="M22 26.5l-2.5 6.5 4.5-2 4.5 2-2.5-6.5" fill="#EF4444" />
          <rect x="15" y="31" width="18" height="2" rx="1" fill="#38BDF8" />
        </svg>
      )
    },
    {
      id: 'important',
      label: 'IMPORTANT',
      type: 'important',
      targetTab: 'important',
      configKey: 'important',
      icon: (
        // Important warning / notice
        <svg viewBox="0 0 48 48" className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 7l18 31H6L24 7z" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round" />
          <line x1="24" y1="18" x2="24" y2="28" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="24" cy="33.5" r="2.2" fill="#FBBF24" />
        </svg>
      )
    }
  ];

  // Render category icon helper: respects custom admin icons and provides fallback
  const renderCategoryIcon = (cat: typeof categories[0]) => {
    if (cat.configKey && columnConfigs?.[cat.configKey]?.icon) {
      const customIcon = columnConfigs[cat.configKey].icon;
      if (isImageIconUrl(customIcon)) {
        return (
          <img
            src={customIcon}
            alt={cat.label}
            className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7 object-contain rounded-full"
          />
        );
      }
      // If emoji or text string
      return (
        <span className="text-xl sm:text-2xl select-none" role="img" aria-label={cat.label}>
          {customIcon}
        </span>
      );
    }
    return cat.icon;
  };

  // Social Links matching exact order and design from the uploaded screenshot:
  // 1. Telegram, 2. WhatsApp, 3. YouTube, 4. Instagram, 5. X, 6. Facebook
  const socials = [
    {
      id: 'telegram',
      label: 'TELEGRAM',
      platform: 'telegram',
      url: socialLinks?.find(s => s.platform === 'telegram')?.url || 'https://t.me/fastarcgovtofficial',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-5.5 sm:h-5.5" fill="none">
          <path 
            d="M21.5 3.5L2.5 10.8C1.2 11.3 1.2 12.1 2.3 12.4L7.2 13.9L18.5 6.8C19 6.5 19.5 6.7 19.1 7.1L10 15.3L9.6 19.8C10.1 19.8 10.3 19.6 10.6 19.3L13.5 16.5L18.8 20.4C19.8 21 20.5 20.7 20.7 19.5L22.8 4.6C23.2 3.2 22.3 2.6 21.5 3.5Z" 
            fill="#29B6F6" 
          />
        </svg>
      )
    },
    {
      id: 'whatsapp',
      label: 'WHATSAPP',
      platform: 'whatsapp',
      url: socialLinks?.find(s => s.platform === 'whatsapp')?.url || 'https://whatsapp.com/channel/fastarcgovtofficial',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-5.5 sm:h-5.5" fill="none">
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M12.04 2C6.56 2 2.1 6.46 2.1 11.94C2.1 13.72 2.57 15.45 3.46 16.98L2.05 22.14L7.34 20.76C8.82 21.57 10.48 22 12.04 22C17.52 22 21.98 17.54 21.98 12.06C21.98 6.58 17.52 2 12.04 2ZM17.48 16.2C17.25 16.84 16.35 17.42 15.63 17.57C15.14 17.67 14.49 17.75 12.35 16.86C9.62 15.73 7.85 12.97 7.71 12.79C7.58 12.6 6.57 11.26 6.57 9.87C6.57 8.48 7.28 7.8 7.55 7.52C7.78 7.28 8.16 7.17 8.52 7.17C8.64 7.17 8.75 7.18 8.85 7.18C9.14 7.2 9.29 7.21 9.48 7.67C9.72 8.24 10.3 9.68 10.37 9.83C10.45 9.98 10.52 10.18 10.42 10.38C10.33 10.58 10.24 10.67 10.1 10.84C9.95 11 9.81 11.13 9.66 11.31C9.5 11.49 9.34 11.69 9.52 12C9.7 12.31 10.33 13.34 11.26 14.17C12.46 15.24 13.45 15.58 13.81 15.73C14.09 15.85 14.43 15.82 14.63 15.6C14.89 15.32 15.21 14.86 15.54 14.4C15.77 14.07 16.07 14.12 16.37 14.23C16.68 14.34 18.32 15.15 18.66 15.32C19 15.49 19.23 15.57 19.29 15.69C19.35 15.8 19.35 16.44 17.48 16.2Z" 
            fill="#25D366" 
          />
        </svg>
      )
    },
    {
      id: 'youtube',
      label: 'YOUTUBE',
      platform: 'youtube',
      url: socialLinks?.find(s => s.platform === 'youtube')?.url || 'https://youtube.com/@fastarcgovtofficial',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 sm:w-6 sm:h-6" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="4.5" fill="#FF0000" />
          <path d="M10 8.5L15.5 12L10 15.5V8.5Z" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      id: 'instagram',
      label: 'INSTAGRAM',
      platform: 'instagram',
      url: socialLinks?.find(s => s.platform === 'instagram')?.url || 'https://instagram.com/fastarcgovtofficial',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-5.5 sm:h-5.5" fill="none">
          <defs>
            <linearGradient id="ig-grad-modern" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFDC80" />
              <stop offset="25%" stopColor="#F56040" />
              <stop offset="50%" stopColor="#FD1D1D" />
              <stop offset="75%" stopColor="#E1306C" />
              <stop offset="100%" stopColor="#833AB4" />
            </linearGradient>
          </defs>
          <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="url(#ig-grad-modern)" strokeWidth="2.2" fill="none" />
          <circle cx="12" cy="12" r="4" stroke="url(#ig-grad-modern)" strokeWidth="2.2" fill="none" />
          <circle cx="17.2" cy="6.8" r="1.3" fill="url(#ig-grad-modern)" />
        </svg>
      )
    },
    {
      id: 'twitter',
      label: 'X',
      platform: 'twitter',
      url: socialLinks?.find(s => s.platform === 'twitter')?.url || 'https://x.com/fastarcgovt',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-5.5 sm:h-5.5" fill="none">
          <path 
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" 
            fill="#00BAF2" 
          />
        </svg>
      )
    },
    {
      id: 'facebook',
      label: 'FACEBOOK',
      platform: 'facebook',
      url: socialLinks?.find(s => s.platform === 'facebook')?.url || 'https://facebook.com/fastarcgovtofficial',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 sm:w-6 sm:h-6" fill="none">
          <circle cx="12" cy="12" r="10" fill="#1877F2" />
          <path 
            d="M13.5 12H15.2L15.5 9.8H13.5V8.4C13.5 7.8 13.7 7.3 14.6 7.3H15.6V5.4C15.1 5.3 14.3 5.2 13.5 5.2C11.8 5.2 10.6 6.2 10.6 8.1V9.8H8.8V12H10.6V17.8C11.1 17.9 11.6 18 12.1 18C12.6 18 13.1 17.9 13.5 17.8V12Z" 
            fill="#FFFFFF" 
          />
        </svg>
      )
    }
  ];

  const activeSlideData = trendingSlides[currentSlide];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900/50 pb-6 transition-colors">
      {/* 1. TRENDING SECTION */}
      <section className="w-full max-w-6xl mx-auto pt-3 px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Trending</span>
          </h2>
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
            {currentSlide + 1} / {trendingSlides.length}
          </span>
        </div>

        {/* Carousel Container with Side Peeks */}
        <div 
          className="relative w-full overflow-hidden flex items-center justify-center py-1 select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Peeking Left Card */}
          <div 
            onClick={() => setCurrentSlide(prev => (prev - 1 + trendingSlides.length) % trendingSlides.length)}
            className="hidden sm:block absolute -left-8 md:-left-12 w-14 md:w-20 h-40 md:h-52 rounded-r-3xl bg-gradient-to-r from-orange-500 to-amber-500 opacity-60 hover:opacity-100 transition-all cursor-pointer shadow-lg z-0 scale-90"
          />

          {/* Active Main Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlideData.id}
              initial={{ opacity: 0.8, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.8, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className={`w-full max-w-4xl h-44 sm:h-56 md:h-64 rounded-2xl sm:rounded-3xl bg-gradient-to-r ${activeSlideData.gradient} p-4 sm:p-6 md:p-8 flex items-center justify-between shadow-xl relative overflow-hidden text-white z-10`}
            >
              {/* Left Side Scene Illustration (Blackboard "इतिहास", Teacher/Student, Desk, Globe, Plant) */}
              <div className="w-1/2 sm:w-5/12 h-full flex items-center justify-center relative shrink-0">
                <svg viewBox="0 0 280 200" className="w-full h-full max-h-52 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Green Chalkboard with wooden frame */}
                  <rect x="20" y="20" width="130" height="85" rx="4" fill="#654321" stroke="#4a3525" strokeWidth="2.5" />
                  <rect x="25" y="25" width="120" height="75" rx="2" fill="#2d5a27" />
                  {/* Chalkboard Hindi Text "इतिहास" */}
                  <text x="85" y="65" fill="#ffffff" fontSize="19" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" opacity="0.95">
                    {activeSlideData.boardText || 'इतिहास'}
                  </text>
                  <line x1="45" y1="78" x2="125" y2="78" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

                  {/* Floor line */}
                  <line x1="5" y1="175" x2="275" y2="175" stroke="#ffffff" strokeWidth="1.5" opacity="0.2" />

                  {/* Wooden Teacher/Student Desk */}
                  <rect x="75" y="105" width="125" height="10" rx="2" fill="#d97706" />
                  <rect x="85" y="115" width="6" height="60" fill="#92400e" />
                  <rect x="185" y="115" width="6" height="60" fill="#92400e" />
                  <rect x="80" y="145" width="115" height="4" fill="#b45309" opacity="0.6" />

                  {/* Teacher / Candidate Character */}
                  <circle cx="160" cy="80" r="14" fill="#fed7aa" />
                  {/* Hair */}
                  <path d="M148 78c0-8 6-15 14-15s14 7 14 15c-3-2-7-3-11-2-5 1-9 1-17 2z" fill="#1e293b" />
                  {/* Specs */}
                  <rect x="153" y="77" width="6" height="4" rx="1" stroke="#0f172a" strokeWidth="1" fill="none" />
                  <rect x="162" y="77" width="6" height="4" rx="1" stroke="#0f172a" strokeWidth="1" fill="none" />
                  <line x1="159" y1="79" x2="162" y2="79" stroke="#0f172a" strokeWidth="1" />
                  {/* Body & Blue Shirt */}
                  <path d="M142 120c0-14 8-24 18-24s18 10 18 24v25h-36v-25z" fill="#0284c7" />
                  {/* Collar & Tie */}
                  <path d="M156 96l4 8 4-8h-8z" fill="#ffffff" />
                  <path d="M158 104l2 12 2-12h-4z" fill="#e11d48" />

                  {/* Globe on desk */}
                  <circle cx="100" cy="90" r="10" fill="#38bdf8" />
                  <path d="M93 88c4 3 10 2 14-2" stroke="#22c55e" strokeWidth="2.5" fill="none" />
                  <path d="M96 95c3 2 7 1 8-2" stroke="#22c55e" strokeWidth="2" fill="none" />
                  <path d="M100 80a10 10 0 0 1 0 20" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
                  <line x1="100" y1="100" x2="100" y2="105" stroke="#64748b" strokeWidth="2" />
                  <rect x="95" y="104" width="10" height="2" rx="1" fill="#64748b" />

                  {/* Books Stack on desk */}
                  <rect x="120" y="99" width="22" height="4" rx="1" fill="#ef4444" />
                  <rect x="122" y="95" width="18" height="4" rx="1" fill="#f59e0b" />
                  <rect x="121" y="91" width="20" height="4" rx="1" fill="#10b981" />

                  {/* Green Potted Plant on floor */}
                  <path d="M40 148l5 27h16l5-27H40z" fill="#b45309" />
                  <circle cx="53" cy="138" r="10" fill="#22c55e" />
                  <circle cx="44" cy="144" r="8" fill="#16a34a" />
                  <circle cx="62" cy="144" r="8" fill="#15803d" />
                </svg>
              </div>

              {/* Right Side Info & Action Button */}
              <div className="w-1/2 sm:w-7/12 pl-2 sm:pl-6 flex flex-col items-start justify-center z-10">
                <span className="bg-white/20 backdrop-blur-xs text-white text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 sm:mb-2.5">
                  Top Alert
                </span>
                <h3 className="text-base sm:text-2xl md:text-3xl font-black text-white leading-snug sm:leading-tight mb-2 sm:mb-4 drop-shadow-sm">
                  {activeSlideData.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-white/90 line-clamp-1 sm:line-clamp-2 mb-3 sm:mb-4 hidden sm:block">
                  {activeSlideData.subtitle}
                </p>
                <button
                  type="button"
                  onClick={() => handleReadMore(activeSlideData)}
                  className={`bg-white ${activeSlideData.readMoreColor} font-black text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full shadow-lg hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer`}
                >
                  Read More
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Peeking Right Card */}
          <div 
            onClick={() => setCurrentSlide(prev => (prev + 1) % trendingSlides.length)}
            className="hidden sm:block absolute -right-8 md:-right-12 w-14 md:w-20 h-40 md:h-52 rounded-l-3xl bg-gradient-to-r from-lime-500 to-emerald-600 opacity-60 hover:opacity-100 transition-all cursor-pointer shadow-lg z-0 scale-90"
          />
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-2.5 mt-3.5 mb-2">
          {trendingSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                currentSlide === idx
                  ? 'w-3 h-3 bg-[#8c1328] dark:bg-[#e11d48] scale-110 shadow-xs'
                  : 'w-2.5 h-2.5 border-2 border-slate-400 dark:border-slate-500 bg-transparent hover:border-slate-600'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. CATEGORIES SECTION (Squircle Buttons with Light/Dark Mode Theme) */}
      <section className="w-full mt-2.5 bg-white dark:bg-[#0B1120] border-y border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-sm py-2.5 sm:py-3 transition-colors duration-300">
        {/* Category Header Bar */}
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between mb-2 sm:mb-2.5">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
            <h2 className="text-[11px] sm:text-xs md:text-sm font-black tracking-[0.16em] sm:tracking-[0.2em] text-slate-900 dark:text-white uppercase drop-shadow-xs transition-colors">
              CATEGORIES
            </h2>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold hidden sm:inline uppercase tracking-wider transition-colors">
            Select category to view notices
          </span>
        </div>

        {/* Categories Squircle Scroll Strip */}
        <div className="max-w-6xl mx-auto px-2 sm:px-4 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-start justify-start sm:justify-center gap-2 sm:gap-3 md:gap-4 min-w-max px-2">
            {categories.map((cat) => {
              const isCatActive = activeTab === cat.targetTab;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onTabChange(cat.targetTab);
                    if (cat.targetTab === 'home') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      const el = document.getElementById(`section-${cat.targetTab}`) || document.getElementById('main-job-columns');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none transition-transform active:scale-95 shrink-0"
                >
                  {/* Squircle Container matching PNG with Light & Dark Mode */}
                  <div className={`relative w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:-translate-y-0.5 aspect-square ${
                    isCatActive 
                      ? 'bg-amber-50/90 dark:bg-[#15233e] border-2 border-amber-500 dark:border-amber-400 ring-2 ring-amber-400/30 shadow-md scale-105' 
                      : 'bg-slate-100 hover:bg-slate-200/90 dark:bg-[#0f172a] dark:hover:bg-[#162238] border border-slate-200 dark:border-slate-700/70 group-hover:border-amber-500/70 dark:group-hover:border-amber-400/70 shadow-xs dark:shadow-md dark:shadow-black/40 group-hover:shadow-md'
                  }`}>
                    {/* Inside Icon */}
                    <div className="relative z-10 flex items-center justify-center w-full h-full p-1.5 sm:p-2">
                      {cat.type === 'logo' ? (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden p-0.5 bg-slate-200/70 dark:bg-white/10 flex items-center justify-center transition-colors">
                          <img 
                            src={siteLogo} 
                            alt="Home" 
                            className="w-full h-full object-contain rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/d/1IE6MQ8EUwyKmGeXnpLTXx7d5HBLJiKb4";
                            }}
                          />
                        </div>
                      ) : (
                        renderCategoryIcon(cat)
                      )}
                    </div>
                  </div>

                  {/* Label underneath */}
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-center mt-1.5 max-w-[72px] truncate transition-colors ${
                    isCatActive 
                      ? 'text-amber-600 dark:text-amber-400 font-black underline underline-offset-4' 
                      : 'text-slate-700 dark:text-slate-300 group-hover:text-amber-600 dark:group-hover:text-amber-400'
                  }`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FOLLOW US SECTION (Squircle Buttons with Light/Dark Mode Theme) */}
      <section className="w-full mt-2.5 bg-white dark:bg-[#0B1120] border-y border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-sm py-2.5 sm:py-3 transition-colors duration-300">
        {/* Follow Us Header Bar */}
        <div className="max-w-6xl mx-auto px-4 text-center mb-2 sm:mb-2.5">
          <h2 className="text-[11px] sm:text-xs md:text-sm font-black tracking-[0.16em] sm:tracking-[0.22em] text-slate-900 dark:text-white uppercase drop-shadow-xs transition-colors">
            OFFICIAL CHANNELS &amp; SOCIAL LINKS
          </h2>
        </div>

        {/* Social Squircle Scroll Strip */}
        <div className="max-w-6xl mx-auto px-2 sm:px-4 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-start justify-start sm:justify-center gap-2 sm:gap-3 md:gap-4 min-w-max px-2">
            {socials.map((soc) => (
              <a
                key={soc.id}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group cursor-pointer focus:outline-none transition-transform active:scale-95 shrink-0"
              >
                {/* Squircle Container matching PNG with Light & Dark Mode */}
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-xl sm:rounded-2xl flex items-center justify-center bg-slate-100 hover:bg-slate-200/90 dark:bg-[#0f172a] dark:hover:bg-[#162238] border border-slate-200 dark:border-slate-700/70 group-hover:border-sky-500/80 dark:group-hover:border-sky-400/80 group-hover:shadow-md transition-all duration-200 group-hover:-translate-y-0.5 shadow-xs dark:shadow-md dark:shadow-black/40 aspect-square">
                  {/* Inside Social Icon */}
                  <div className="relative z-10 flex items-center justify-center w-full h-full p-1.5 sm:p-2">
                    {soc.icon}
                  </div>
                </div>

                {/* Label underneath */}
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 text-center mt-1.5 max-w-[72px] truncate transition-colors">
                  {soc.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
