import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, ExternalLink, Sparkles, Edit2, ArrowUpDown } from 'lucide-react';
import { JobAlert, JobCategory } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { getJobDetailUrl, openJobInNewTab } from '../utils/jobUrl';

const HighlightText = ({ text, query }: { text: string; query?: string }) => {
  if (!query || !text) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-amber-400/50 dark:bg-amber-500/50 text-amber-950 dark:text-amber-100 px-0.5 rounded rounded-sm">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

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

  const displayJobs = isExpanded || disableFilter ? sortedCategoryJobs : sortedCategoryJobs.slice(0, initialLimit);
  const hasMore = sortedCategoryJobs.length > initialLimit;

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
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col overflow-hidden transition-all duration-300 h-full scroll-mt-24 ${
        isExpanded ? 'ring-2 ring-amber-500/20 dark:ring-amber-400/20 shadow-lg' : ''
      }`}
    >
      {/* Column Header */}
      <div 
        className={`${
          bgDark 
            ? 'bg-slate-800 dark:bg-slate-850' 
            : `bg-gradient-to-r ${gradientFrom} ${gradientTo}`
        } p-3.5 sm:p-4 text-white flex justify-between items-center shrink-0 select-none`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          <span className="text-base sm:text-lg shrink-0 flex items-center justify-center">
            <CategoryIcon icon={icon} className="w-5 h-5 object-contain shrink-0" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
              <h3 className="font-extrabold tracking-tight text-xs sm:text-sm truncate">
                {title}
              </h3>
              {badgeText && (
                <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded shadow-xs uppercase shrink-0">
                  {badgeText}
                </span>
              )}
            </div>
            {tagline && (
              <p className="text-[9px] sm:text-[10px] text-white/80 truncate leading-none mt-0.5 font-normal">
                {tagline}
              </p>
            )}
          </div>
          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-xs shrink-0 ml-1">
            {sortedCategoryJobs.length}
          </span>
        </div>

        {/* Right side controls: Quick Edit, Sort Toggle, Tab switch & Down Arrow toggle */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Sort Toggle Button */}
          <button
            onClick={handleToggleSort}
            title={
              sortOrder === 'recent'
                ? 'Sorted by: Most Recent. Click to sort by Oldest.'
                : 'Sorted by: Oldest first. Click to sort by Most Recent.'
            }
            className={`p-1.5 rounded-lg transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 ${
              sortOrder === 'oldest'
                ? 'bg-amber-400 text-slate-950 shadow-xs ring-1 ring-amber-300'
                : 'bg-white/15 hover:bg-white/30 text-white'
            }`}
            aria-label={`Toggle sort order for ${title}: currently ${
              sortOrder === 'recent' ? 'Most Recent' : 'Oldest'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-tight hidden sm:inline">
              {sortOrder === 'recent' ? 'Recent' : 'Oldest'}
            </span>
          </button>

          {isSuperAdmin && onQuickEditTitle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickEditTitle();
              }}
              title={`Edit title & text for ${title}`}
              className="p-1.5 rounded-lg bg-white/15 hover:bg-amber-400 hover:text-slate-950 text-white transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label={`Edit ${title} column`}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onSeeMore && !disableFilter && (
            <button
              onClick={handleOpenTab}
              title={`Open all ${title} in dedicated tab`}
              className="p-1.5 rounded-lg bg-white/15 hover:bg-white/30 text-white transition-all text-xs font-semibold flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label={`Open ${title} Tab`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Column Items List */}
      <div 
        className="p-3 divide-y divide-slate-100 dark:divide-slate-800 transition-all duration-300"
      >
        {sortedCategoryJobs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 italic">
            No items found in {title}.
          </div>
        ) : (
          displayJobs.map(item => {
            const lastDateStr = (item as any).lastDate || item.dates?.last;
            let daysUntil = null;
            if (lastDateStr) {
              const match = lastDateStr.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
              if (match) {
                const targetDate = new Date(parseInt(match[3], 10), parseInt(match[2], 10) - 1, parseInt(match[1], 10));
                const now = new Date();
                targetDate.setHours(0, 0, 0, 0);
                now.setHours(0, 0, 0, 0);
                const diffTime = targetDate.getTime() - now.getTime();
                daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              }
            }
            const isExpiringSoon = daysUntil !== null && daysUntil >= 0 && daysUntil <= 3;

            return (
              <div 
                key={item.id} 
                className={`py-3 px-2.5 hover:bg-slate-50 dark:hover:bg-slate-850/80 transition-all duration-200 transform hover:scale-[1.015] hover:shadow-xs active:scale-[0.99] flex items-start justify-between group rounded-xl will-change-transform ${
                  isExpiringSoon ? 'bg-rose-50/50 dark:bg-rose-950/20 ring-1 ring-rose-500/40 dark:ring-rose-400/30 shadow-xs' : ''
                }`}
              >
                <a 
                  href={getJobDetailUrl(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    openJobInNewTab(item);
                  }}
                  className="flex-grow pr-3 cursor-pointer no-underline block"
                >
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-relaxed block">
                    <HighlightText text={item.title} query={searchQuery.trim()} />
                  </span>
                  <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
                    <span className="text-[9px] text-slate-400 font-medium">
                      📅 {item.postDate}
                    </span>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                      {item.state}
                    </span>
                    {lastDateStr && (
                      <span className={`text-[9px] font-medium ${isExpiringSoon ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                        Last Date: {lastDateStr}
                      </span>
                    )}
                    {isExpiringSoon && (
                      <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-sm">
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {daysUntil === 0 ? 'Expires Today' : `Expires in ${daysUntil} ${daysUntil === 1 ? 'Day' : 'Days'}`}
                      </span>
                    )}
                  </div>
                </a>
                <div className="flex items-center space-x-1.5 shrink-0 pt-0.5">
                  {isAdmin && (
                    <>
                      <button 
                        onClick={(e) => onEdit(item.id, e)} 
                        className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded transition-all text-[11px]" 
                        title="Edit Entry"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button 
                        onClick={(e) => onDelete(item.id, e)} 
                        className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-500 p-1 rounded transition-all text-[11px]" 
                        title="Delete Entry"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </>
                  )}
                  {item.isNew && (
                    <span className="bg-red-500 text-white text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded uppercase badge-pulse">
                      NEW
                    </span>
                  )}
                  <a
                    href={getJobDetailUrl(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      openJobInNewTab(item);
                    }}
                    className="p-1 text-slate-300 group-hover:text-amber-500 transition-colors cursor-pointer"
                    title="Open Job Details in New Tab"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action footer: See More Tab and Expand / Show Less buttons */}
      {!disableFilter && (
        <div className="pt-3 pb-2 px-3 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-xl shrink-0">
          
          {/* In-column Expand / Collapse toggle */}
          <div className="flex-1 w-full sm:w-auto">
            {hasMore && (
              <button 
                onClick={handleToggleExpand}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>Expand All ({sortedCategoryJobs.length})</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Primary 'See More' button that opens the dedicated tab */}
          {onSeeMore && (
            <div className="flex justify-end">
              <button 
                onClick={handleOpenTab}
                className="inline-flex items-center justify-center gap-1 px-2 py-2 text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 bg-transparent transition-colors cursor-pointer"
              >
                <span>See More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

