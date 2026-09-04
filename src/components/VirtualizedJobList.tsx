import React, { useRef, useLayoutEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { JobAlert } from '../types';
import { getJobDetailUrl } from '../utils/jobUrl';
import { useVirtualList } from '../utils/useVirtualList';

const HighlightText: React.FC<{ text: string; query?: string }> = ({ text, query }) => {
  if (!query || !text) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-amber-400/50 dark:bg-amber-500/50 text-amber-950 dark:text-amber-100 px-0.5 rounded-sm">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

interface VirtualJobRowProps {
  item: JobAlert;
  index: number;
  searchQuery?: string;
  isAdmin: boolean;
  onJobClick: (id: string) => void;
  onEdit: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onMeasureHeight?: (index: number, height: number) => void;
}

const VirtualJobRow: React.FC<VirtualJobRowProps> = ({
  item,
  index,
  searchQuery,
  isAdmin,
  onJobClick,
  onEdit,
  onDelete,
  onMeasureHeight
}) => {
  const rowRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (rowRef.current && onMeasureHeight) {
      const height = rowRef.current.offsetHeight;
      if (height > 0) {
        onMeasureHeight(index, height);
      }
    }
  }, [index, item, onMeasureHeight]);

  const lastDateStr = (item as any).lastDate || item.dates?.last;
  let daysUntil: number | null = null;
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
      ref={rowRef}
      className={`py-2 sm:py-2.5 px-2.5 sm:px-3 hover:bg-slate-50 dark:hover:bg-slate-850/90 transition-all duration-150 transform hover:scale-[1.004] hover:shadow-xs active:scale-[0.99] flex items-start justify-between group rounded-xl border-b border-slate-100 dark:border-slate-800/80 last:border-b-0 will-change-transform ${
        isExpiringSoon ? 'bg-rose-50/50 dark:bg-rose-950/20 ring-1 ring-rose-500/40 dark:ring-rose-400/30 shadow-xs' : ''
      }`}
    >
      <a
        href={getJobDetailUrl(item)}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey) {
            return;
          }
          e.preventDefault();
          onJobClick(item.id);
        }}
        className="w-full min-w-0 cursor-pointer no-underline block"
      >
        <div className="flex items-start justify-between gap-2">
          <span className="job-link-title-text text-[13px] sm:text-[13.5px] md:text-[14px] lg:text-[14.5px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-amber-400 group-hover:underline transition-colors leading-snug flex-1 min-w-0 tracking-tight">
            <HighlightText text={item.title} query={searchQuery?.trim()} />
          </span>
          {(item.isNew || isAdmin) && (
            <div className="flex items-center space-x-1.5 shrink-0 ml-1.5 mt-0.5">
              {isAdmin && (
                <>
                  <button
                    onClick={(e) => onEdit(item.id, e)}
                    className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 rounded transition-all text-xs cursor-pointer"
                    title="Edit Entry"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => onDelete(item.id, e)}
                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-500 p-0.5 rounded transition-all text-xs cursor-pointer"
                    title="Delete Entry"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </>
              )}
              {item.isNew && (
                <span className="bg-red-500 text-white text-[9.5px] sm:text-[10px] md:text-[10.5px] font-black tracking-wider px-1.5 py-0.5 rounded uppercase badge-pulse shadow-xs">
                  NEW
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            📅 {item.postDate}
          </span>
          <span className="text-[10px] sm:text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide border border-slate-200/80 dark:border-slate-700/80">
            {item.state}
          </span>
          {isExpiringSoon && (
            <span className="text-[9.5px] sm:text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded font-black uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-xs">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {daysUntil === 0 ? 'Expires Today' : `Expires in ${daysUntil} ${daysUntil === 1 ? 'Day' : 'Days'}`}
            </span>
          )}
        </div>
      </a>
    </div>
  );
};

export interface VirtualizedJobListProps {
  jobs: JobAlert[];
  searchQuery?: string;
  isAdmin: boolean;
  onJobClick: (id: string) => void;
  onEdit: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  maxHeightClass?: string;
  emptyMessage?: string;
  isExpanded?: boolean;
}

export const VirtualizedJobList: React.FC<VirtualizedJobListProps> = ({
  jobs,
  searchQuery = '',
  isAdmin,
  onJobClick,
  onEdit,
  onDelete,
  maxHeightClass = 'max-h-[480px]',
  emptyMessage = 'No items found.',
  isExpanded = false
}) => {
  const {
    containerRef,
    virtualItems,
    totalHeight,
    scrollTop,
    setItemHeight,
    scrollToTop
  } = useVirtualList({
    itemCount: jobs.length,
    estimatedItemHeight: 58,
    overscan: 4,
    containerHeightFallback: 480
  });

  if (jobs.length === 0) {
    return (
      <div className="py-8 text-center text-xs sm:text-sm text-slate-400 dark:text-slate-500 italic">
        {emptyMessage}
      </div>
    );
  }

  // If list is small (e.g. <= 12) and not in an expanded scroll view, render flat list directly for zero overhead
  if (jobs.length <= 12 && !isExpanded) {
    return (
      <div className="p-1 sm:p-1.5 divide-y divide-slate-100 dark:divide-slate-800">
        {jobs.map((item, idx) => (
          <VirtualJobRow
            key={item.id}
            item={item}
            index={idx}
            searchQuery={searchQuery}
            isAdmin={isAdmin}
            onJobClick={onJobClick}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // Virtualized Scroll Container for long / expanded lists (hundreds of jobs)
  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`custom-scrollbar overflow-y-auto ${maxHeightClass} p-1 sm:p-1.5 focus:outline-none`}
        tabIndex={0}
        aria-label="Job list"
        role="region"
      >
        <div
          style={{
            height: `${totalHeight}px`,
            width: '100%',
            position: 'relative'
          }}
        >
          {virtualItems.map((virtualRow) => {
            const item = jobs[virtualRow.index];
            if (!item) return null;

            return (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`
                }}
              >
                <VirtualJobRow
                  item={item}
                  index={virtualRow.index}
                  searchQuery={searchQuery}
                  isAdmin={isAdmin}
                  onJobClick={onJobClick}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onMeasureHeight={setItemHeight}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Scroll To Top button when deeply scrolled */}
      {scrollTop > 300 && (
        <button
          onClick={() => scrollToTop(true)}
          className="absolute bottom-2.5 right-3 p-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer z-10 opacity-90 hover:opacity-100 flex items-center justify-center text-xs"
          title="Back to top"
          aria-label="Scroll back to top"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
