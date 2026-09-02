import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, Sparkles, Edit2, ArrowUpDown } from 'lucide-react';
import { JobAlert, JobCategory } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { VirtualizedJobList } from './VirtualizedJobList';

const parseJobTimestamp = (job: JobAlert): number => {
  // 1. Try postDate (e.g. DD-MM-YYYY or DD/MM/YYYY)
  if (job.postDate) {
    const dmy = job.postDate.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
    if (dmy) {
      const d = new Date(parseInt(dmy[3], 10), parseInt(dmy[2], 10) - 1, parseInt(dmy[1], 10));
      if (!isNaN(d.getTime())) return d.getTime();
    }
    const ymd = job.postDate.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (ymd) {
      const d = new Date(parseInt(ymd[1], 10), parseInt(ymd[2], 10) - 1, parseInt(ymd[3], 10));
      if (!isNaN(d.getTime())) return d.getTime();
    }
  }

  // 2. Try dates.start or dates.last
  const altDate = job.dates?.start || job.dates?.last;
  if (altDate) {
    const dmy = altDate.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
    if (dmy) {
      const d = new Date(parseInt(dmy[3], 10), parseInt(dmy[2], 10) - 1, parseInt(dmy[1], 10));
      if (!isNaN(d.getTime())) return d.getTime();
    }
  }

  // 3. Fallback: extract 4-digit year from title
  const yearMatch = job.title?.match(/20\d\d/);
  if (yearMatch) {
    const year = parseInt(yearMatch[0], 10);
    return new Date(year, 0, 1).getTime();
  }

  return 0;
};

interface JobColumnProps {
  id?: string;
  className?: string;
  title: string;
  hindiTitle?: string;
  tagline?: string;
  badgeText?: string;
  icon: React.ReactNode;
  jobs: JobAlert[];
  categoryId: JobCategory;
  gradientFrom: string;
  gradientTo: string;
  onJobClick: (id: string) => void;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
  onQuickEditTitle?: () => void;
  onEdit: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  bgDark?: boolean;
  disableFilter?: boolean;
  onSeeMore?: (categoryId: JobCategory) => void;
  defaultExpanded?: boolean;
  defaultSort?: 'recent' | 'oldest';
  searchQuery?: string;
  initialLimit?: number;
  maxHeightClass?: string;
  maxHeightExpandedClass?: string;
}

export const JobColumn: React.FC<JobColumnProps> = ({ 
  id,
  className = '',
  title, 
  hindiTitle,
  tagline,
  badgeText,
  icon, 
  jobs, 
  categoryId, 
  gradientFrom, 
  gradientTo, 
  onJobClick,
  isAdmin,
  isSuperAdmin = false,
  onQuickEditTitle,
  onEdit,
  onDelete,
  bgDark = false,
  disableFilter = false,
  onSeeMore,
  defaultExpanded = false,
  defaultSort = 'recent',
  searchQuery = '',
  initialLimit = 15,
  maxHeightClass = 'max-h-[460px]',
  maxHeightExpandedClass = 'max-h-[700px]'
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isPwaMode, setIsPwaMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    setIsPwaMode(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsPwaMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>(defaultSort);

  const sortedCategoryJobs = useMemo(() => {
    const filtered = disableFilter ? [...jobs] : jobs.filter(j => j.category === categoryId);
    return filtered.sort((a, b) => {
      const timeA = parseJobTimestamp(a);
      const timeB = parseJobTimestamp(b);
      if (timeA !== timeB) {
        return sortOrder === 'recent' ? timeB - timeA : timeA - timeB;
      }
      return a.title.localeCompare(b.title);
    });
  }, [jobs, categoryId, disableFilter, sortOrder]);

  const effectiveLimit = isPwaMode ? 5 : initialLimit;
  const displayJobs = isExpanded || disableFilter ? sortedCategoryJobs : sortedCategoryJobs.slice(0, effectiveLimit);
  const hasMore = sortedCategoryJobs.length > effectiveLimit;

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  };

  const handleToggleSort = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSortOrder(prev => (prev === 'recent' ? 'oldest' : 'recent'));
  };

  const handleOpenTab = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSeeMore) {
      onSeeMore(categoryId);
    }
  };

  return (
    <section 
      id={id} 
      className={`bg-white dark:bg-slate-900 flex flex-col overflow-hidden transition-all duration-300 h-full scroll-mt-24 rounded-2xl border border-slate-200/90 dark:border-slate-700/90 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 ${
        className
      } ${
        isExpanded ? 'ring-2 ring-amber-500/30 dark:ring-amber-400/30 shadow-lg z-10' : ''
      }`}
    >
      {/* Column Header */}
      <div 
        className={`${
          bgDark 
            ? 'bg-slate-800 dark:bg-slate-850' 
            : `bg-gradient-to-r ${gradientFrom} ${gradientTo}`
        } p-3 sm:p-3.5 text-white flex justify-between items-center shrink-0`}
      >
        <div 
          className={`flex items-center gap-2.5 min-w-0 flex-1 mr-2 ${onSeeMore && !disableFilter ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
          onClick={onSeeMore && !disableFilter ? handleOpenTab : undefined}
          title={onSeeMore && !disableFilter ? `Open all ${title} in dedicated tab` : undefined}
          role={onSeeMore && !disableFilter ? "button" : undefined}
          tabIndex={onSeeMore && !disableFilter ? 0 : undefined}
        >
          <span className="text-lg sm:text-xl shrink-0 flex items-center justify-center">
            <CategoryIcon icon={icon} className="w-5.5 h-5.5 sm:w-6 sm:h-6 object-contain shrink-0" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
              <h3 className="font-black tracking-tight text-base sm:text-[17.5px] lg:text-[19px] truncate">
                {title}
              </h3>
              {badgeText && (
                <span className="bg-amber-400 text-slate-950 text-[11px] sm:text-xs font-black px-2 py-0.5 rounded shadow-xs uppercase shrink-0">
                  {badgeText}
                </span>
              )}
            </div>
            {tagline && (
              <p className="text-xs sm:text-[13px] text-white/90 truncate leading-tight mt-0.5 font-medium">
                {tagline}
              </p>
            )}
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-black bg-white/20 text-white backdrop-blur-xs shrink-0 ml-1">
            {sortedCategoryJobs.length}
          </span>
        </div>

        {/* Right side controls: Quick Edit, Sort Toggle, Tab switch & Down Arrow toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Sort Toggle Button */}
          <button
            onClick={handleToggleSort}
            title={
              sortOrder === 'recent'
                ? 'Sorted by: Most Recent. Click to sort by Oldest.'
                : 'Sorted by: Oldest first. Click to sort by Most Recent.'
            }
            className={`p-1.5 sm:p-2 rounded-lg transition-all text-xs sm:text-sm font-bold flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 ${
              sortOrder === 'oldest'
                ? 'bg-amber-400 text-slate-950 shadow-xs ring-1 ring-amber-300'
                : 'bg-white/15 hover:bg-white/30 text-white'
            }`}
            aria-label={`Toggle sort order for ${title}: currently ${
              sortOrder === 'recent' ? 'Most Recent' : 'Oldest'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>

          {isSuperAdmin && onQuickEditTitle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickEditTitle();
              }}
              title={`Edit title & text for ${title}`}
              className="p-1.5 sm:p-2 rounded-lg bg-white/15 hover:bg-amber-400 hover:text-slate-950 text-white transition-all text-xs sm:text-sm font-bold flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label={`Edit ${title} column`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>

      {/* Column Items List - Virtualized for maximum performance */}
      <VirtualizedJobList
        jobs={displayJobs}
        searchQuery={searchQuery}
        isAdmin={isAdmin}
        onJobClick={onJobClick}
        onEdit={onEdit}
        onDelete={onDelete}
        maxHeightClass={isExpanded ? 'h-auto' : 'h-auto'}
        emptyMessage={`No items found in ${title}.`}
        isExpanded={isExpanded}
      />

      {/* Action footer: See More Tab */}
      {!disableFilter && (
        <div className={`pt-2 pb-3 px-3 flex items-center shrink-0 ${isPwaMode ? 'justify-center bg-transparent rounded-b-xl' : 'sm:px-4 sm:justify-between border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-xl'}`}>
          {onSeeMore && (
            <button 
              onClick={handleOpenTab}
              className={isPwaMode 
                ? "inline-flex items-center justify-center px-6 py-1.5 text-[13px] font-medium text-black dark:text-white border border-[#b01a33] rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer"
                : "inline-flex items-center justify-center gap-1 px-2 py-2 text-xs sm:text-sm font-extrabold text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 bg-transparent transition-colors cursor-pointer ml-auto"
              }
            >
              {isPwaMode ? 'View More' : (
                <>
                  <span>See More</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </section>
  );
};

