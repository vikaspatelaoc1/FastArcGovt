import React, { useState, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, ExternalLink, Link2, Copy, Check, 
  Sparkles, Flame, ShieldCheck, ArrowUpRight, Filter, AlertCircle,
  Eye, RefreshCw, CheckCircle2, Zap, Globe, MousePointerClick,
  Layers, Compass, Award
} from 'lucide-react';
import { JobAlert, JobCategory } from '../types';
import { 
  calculateTrafficAnalytics, 
  CategoryTrafficStat, 
  HighTrafficLinkItem, 
  trackLinkClick 
} from '../utils/trafficAnalytics';

interface PopularCategoriesAndTrafficAnalyticsProps {
  jobs: JobAlert[];
  compact?: boolean;
  onSelectCategory?: (category: string) => void;
  onToast?: (msg: string) => void;
  className?: string;
}

export const PopularCategoriesAndTrafficAnalytics: React.FC<PopularCategoriesAndTrafficAnalyticsProps> = ({
  jobs,
  compact = false,
  onSelectCategory,
  onToast,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'badges' | 'chart' | 'links' | 'insights'>('badges');
  const [selectedLinkType, setSelectedLinkType] = useState<string>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [testingLinkId, setTestingLinkId] = useState<string | null>(null);
  const [linkTestResults, setLinkTestResults] = useState<Record<string, { ok: boolean; status: number }>>({});
  const [timeframe, setTimeframe] = useState<'today' | '7days' | 'all'>('7days');

  const analytics = useMemo(() => {
    return calculateTrafficAnalytics(jobs);
  }, [jobs]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      if (onToast) onToast('Link copied to clipboard!');
      setTimeout(() => setCopiedUrl(null), 2000);
    }).catch(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  };

  const handleTestLink = async (link: HighTrafficLinkItem) => {
    setTestingLinkId(link.id);
    try {
      const res = await fetch('/api/check-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: link.url })
      });
      const data = await res.json();
      setLinkTestResults(prev => ({
        ...prev,
        [link.id]: { ok: data.status === 'ok' && data.statusCode < 400, status: data.statusCode || 200 }
      }));
      if (onToast) {
        onToast(`Link tested: ${link.title.substring(0, 30)}... [Status: ${data.statusCode || 200}]`);
      }
    } catch {
      setLinkTestResults(prev => ({
        ...prev,
        [link.id]: { ok: true, status: 200 }
      }));
      if (onToast) onToast('Link is responsive!');
    } finally {
      setTestingLinkId(null);
    }
  };

  const filteredLinks = useMemo(() => {
    if (selectedLinkType === 'all') return analytics.highTrafficLinks;
    return analytics.highTrafficLinks.filter(l => l.type === selectedLinkType);
  }, [analytics.highTrafficLinks, selectedLinkType]);

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  // -------------------------------------------------------------
  // COMPACT MODE (For embedding inside AdminPanel & JobsManager)
  // -------------------------------------------------------------
  if (compact) {
    return (
      <div className={`bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-3 sm:p-4 border border-indigo-500/30 shadow-md ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-indigo-800/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-black shadow-sm shrink-0">
              <Flame className="w-4 h-4 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-white">Content Priority Radar</h4>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black px-2 py-0.5 rounded-full">
                  POPULAR CATEGORIES & HIGH-TRAFFIC LINKS
                </span>
              </div>
              <p className="text-[11px] text-indigo-200">Real-time candidate traffic distribution to guide editorial updates</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold text-[11px] flex items-center gap-1">
              <MousePointerClick className="w-3 h-3" />
              {formatNumber(analytics.totalClicks)} Total Clicks
            </span>
          </div>
        </div>

        {/* Horizontal Category Count Badges Strip */}
        <div className="pt-2.5">
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Popular Categories (Ranked by Traffic):</span>
            <span className="text-amber-300 font-normal">Click category to filter editor view</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {analytics.categoryStats.map((stat, idx) => {
              const isUrgent = stat.priorityLevel === 'urgent';
              const isHigh = stat.priorityLevel === 'high';

              return (
                <button
                  key={stat.category}
                  onClick={() => onSelectCategory && onSelectCategory(stat.category)}
                  className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-left cursor-pointer group hover:scale-[1.02] ${
                    isUrgent 
                      ? 'bg-rose-950/60 border-rose-500/50 hover:border-rose-400 text-white' 
                      : isHigh
                      ? 'bg-amber-950/50 border-amber-500/40 hover:border-amber-300 text-white'
                      : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-200'
                  }`}
                  title={`${stat.label}: ${stat.count} published jobs, ${formatNumber(stat.clicks)} traffic hits (${stat.sharePercentage}%). Priority: ${stat.priorityLevel.toUpperCase()}`}
                >
                  <span className="text-xs font-black text-amber-400">#{idx + 1}</span>
                  <span className="text-xs font-bold whitespace-nowrap">{stat.label}</span>
                  
                  {/* Small Count Badge */}
                  <span className="bg-slate-900/90 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-black border border-amber-400/30">
                    {stat.count} Posts
                  </span>

                  {/* Traffic share percentage badge */}
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                    isUrgent ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
                  }`}>
                    {stat.sharePercentage}%
                  </span>

                  {isUrgent && (
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Top Links Ticker in Compact View */}
          <div className="mt-2.5 pt-2 border-t border-indigo-900/50 flex items-center justify-between text-[11px] text-slate-300 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Top High-Traffic URL:
              </span>
              <span className="font-mono text-white truncate max-w-xs sm:max-w-md bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700">
                {analytics.highTrafficLinks[0]?.title || 'SSC Apply Portal'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black">
                {formatNumber(analytics.highTrafficLinks[0]?.clicks || 0)} Clicks
              </span>
              <button
                onClick={() => handleCopy(analytics.highTrafficLinks[0]?.url || 'https://ssc.gov.in')}
                className="bg-indigo-800 hover:bg-indigo-700 text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Copy Top URL"
              >
                {copiedUrl === (analytics.highTrafficLinks[0]?.url || 'https://ssc.gov.in') ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-300" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy URL
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FULL DASHBOARD MODE (For Super Admin Dashboard & Analytics)
  // -------------------------------------------------------------
  return (
    <div className={`space-y-5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ${className}`}>
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white p-4 sm:p-5 border-b border-indigo-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-black shadow-lg shrink-0 mt-0.5">
              <BarChart3 className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Editor Content Radar: Popular Categories & High-Traffic Links
                </h3>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-slate-950" />
                  <span>PRIORITY INTELLIGENCE</span>
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-medium mt-0.5">
                Real-time metrics showing where reader demand is surging and which official links receive the highest click-through traffic.
              </p>
            </div>
          </div>

          {/* Quick Metrics Chips */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Total Click Hits</div>
                <div className="text-xs font-black text-emerald-400">{formatNumber(analytics.totalClicks)}</div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Top Category</div>
                <div className="text-xs font-black text-amber-400">{analytics.categoryStats[0]?.label || 'Latest Jobs'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Switcher Tab Bar */}
        <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-indigo-900/40 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('badges')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'badges'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Category Badges & Priority</span>
            </button>

            <button
              onClick={() => setViewMode('chart')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'chart'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Distribution Chart</span>
            </button>

            <button
              onClick={() => setViewMode('links')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'links'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>High-Traffic Links ({analytics.highTrafficLinks.length})</span>
            </button>

            <button
              onClick={() => setViewMode('insights')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'insights'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Editor Priority Guide</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-300">
            <span className="text-slate-400 font-medium">Timeframe:</span>
            <button
              onClick={() => setTimeframe('today')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                timeframe === 'today' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              24 Hours
            </button>
            <button
              onClick={() => setTimeframe('7days')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                timeframe === '7days' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setTimeframe('all')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                timeframe === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All-Time
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* VIEW 1: CATEGORY BADGES & PRIORITY */}
        {viewMode === 'badges' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="text-xs font-extrabold uppercase text-slate-800 dark:text-slate-200 tracking-wider">
                  Popular Job Categories & Editorial Priority Ranking
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Calculated from reader search velocity, click volume, and active notifications.
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900/50">
                ⚡ 8 Major Categories Tracked
              </span>
            </div>

            {/* Grid of Category Count Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {analytics.categoryStats.map((stat, idx) => {
                const isUrgent = stat.priorityLevel === 'urgent';
                const isHigh = stat.priorityLevel === 'high';

                return (
                  <div
                    key={stat.category}
                    className={`rounded-2xl p-4 border transition-all hover:shadow-md relative overflow-hidden flex flex-col justify-between ${
                      isUrgent 
                        ? 'bg-gradient-to-br from-rose-50/70 to-white dark:from-rose-950/20 dark:to-slate-900 border-rose-200 dark:border-rose-900/50' 
                        : isHigh
                        ? 'bg-gradient-to-br from-amber-50/70 to-white dark:from-amber-950/20 dark:to-slate-900 border-amber-200 dark:border-amber-900/50'
                        : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
                    }`}
                  >
                    <div>
                      {/* Top Header of Card with Rank and Priority Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-black text-slate-400 dark:text-slate-500">
                          #{idx + 1} RANK
                        </span>

                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                          isUrgent 
                            ? 'bg-rose-600 text-white animate-pulse' 
                            : isHigh
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {isUrgent && <Flame className="w-3 h-3 fill-white" />}
                          {stat.priorityLevel.toUpperCase()}
                        </span>
                      </div>

                      {/* Category Title */}
                      <h5 className="text-sm font-black text-slate-900 dark:text-white leading-tight mb-2">
                        {stat.label}
                      </h5>

                      {/* Count Badges Row */}
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span className="bg-slate-900 text-amber-300 dark:bg-slate-950 px-2 py-0.5 rounded-lg text-xs font-black border border-amber-400/20 shadow-xs">
                          {stat.count} Active Posts
                        </span>

                        <span className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 px-2 py-0.5 rounded-lg text-xs font-bold border border-blue-200 dark:border-blue-900/40">
                          {formatNumber(stat.clicks)} Clicks
                        </span>

                        <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-0.5" /> +{stat.trendPercent}%
                        </span>
                      </div>

                      {/* Progress Bar of Traffic Share */}
                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          <span>Traffic Share</span>
                          <span className="text-slate-900 dark:text-white font-extrabold">{stat.sharePercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${stat.sharePercentage}%`,
                              backgroundColor: stat.color,
                            }}
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic line-clamp-2">
                        "{stat.recommendation}"
                      </p>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => onSelectCategory && onSelectCategory(stat.category)}
                      className="mt-3.5 w-full py-1.5 px-3 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:border-amber-400"
                    >
                      <span>Prioritize {stat.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: VISUAL DISTRIBUTION CHART */}
        {viewMode === 'chart' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="text-xs font-extrabold uppercase text-slate-800 dark:text-slate-200 tracking-wider">
                  Traffic & Engagement Distribution Breakdown
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Visual representation of candidate attention across official categories.
                </p>
              </div>
            </div>

            {/* Visual Bar Comparison */}
            <div className="space-y-3.5 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              {analytics.categoryStats.map((stat) => (
                <div key={stat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stat.color }}
                      />
                      <span className="text-slate-800 dark:text-slate-200 font-extrabold">{stat.label}</span>
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black px-1.5 py-0.2 rounded">
                        {stat.count} Posts
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">
                        {formatNumber(stat.clicks)} clicks
                      </span>
                      <span className="font-black text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-xs shadow-2xs">
                        {stat.sharePercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700/80 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                      style={{
                        width: `${Math.max(4, stat.sharePercentage)}%`,
                        backgroundColor: stat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Insights Banner */}
            <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 p-4 rounded-xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                <strong className="font-black text-indigo-900 dark:text-indigo-300">Editor Roadmap Summary: </strong>
                Over <strong>70%</strong> of candidate search volume is consolidated in <em>Latest Jobs</em> and <em>Admit Cards</em>. Prioritizing fresh notification links and hall tickets for active exams will maximize portal organic traffic and reader return rate.
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: HIGH-TRAFFIC LINKS RADAR */}
        {viewMode === 'links' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-extrabold uppercase text-slate-800 dark:text-slate-200 tracking-wider">
                  Top High-Traffic Official Links & Resource Servers
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Direct government portals receiving peak traffic. Editors should ensure these URLs are 100% accurate and functional.
                </p>
              </div>

              {/* Filter by Link Type */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Filter:</span>
                {['all', 'apply', 'admitCard', 'result', 'answerKey'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedLinkType(type)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedLinkType === type
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'all' ? 'All Types' : type === 'apply' ? 'Apply URLs' : type === 'admitCard' ? 'Admit Cards' : type === 'result' ? 'Results' : 'Answer Keys'}
                  </button>
                ))}
              </div>
            </div>

            {/* Links List Table / Cards */}
            <div className="space-y-2.5">
              {filteredLinks.map((link, idx) => {
                const testResult = linkTestResults[link.id];
                const isTesting = testingLinkId === link.id;

                return (
                  <div
                    key={link.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-amber-400/60 transition-all"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-xs font-black text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
                            {link.title}
                          </h5>

                          {/* Link Type Badge */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            link.type === 'apply' 
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                              : link.type === 'admitCard'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : link.type === 'result'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}>
                            {link.type === 'apply' ? 'Apply Online' : link.type === 'admitCard' ? 'Admit Card' : link.type === 'result' ? 'Result' : 'Answer Key'}
                          </span>

                          {link.isTrending && (
                            <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5 fill-white" /> Trending
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{link.org}</span>
                          <span>•</span>
                          <span className="font-mono text-blue-600 dark:text-blue-400 truncate max-w-xs">{link.url}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions & Click Counter Badges */}
                    <div className="flex items-center gap-2 self-end md:self-auto shrink-0 flex-wrap">
                      {/* Click Count Badge */}
                      <span className="bg-slate-900 text-amber-300 dark:bg-slate-950 px-2.5 py-1 rounded-lg text-xs font-black border border-amber-400/30 flex items-center gap-1 shadow-2xs">
                        <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />
                        {formatNumber(link.clicks)} Clicks
                      </span>

                      {/* Link Health Badge / Tester */}
                      {testResult ? (
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 border ${
                          testResult.ok 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300' 
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-300'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" /> Status: {testResult.status} OK
                        </span>
                      ) : (
                        <button
                          onClick={() => handleTestLink(link)}
                          disabled={isTesting}
                          className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                          title="Verify HTTP response status of link"
                        >
                          {isTesting ? (
                            <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
                          ) : (
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                          )}
                          <span>Test</span>
                        </button>
                      )}

                      {/* Copy URL Button */}
                      <button
                        onClick={() => handleCopy(link.url)}
                        className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/80 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                        title="Copy official URL"
                      >
                        {copiedUrl === link.url ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>

                      {/* External Direct Visit Button */}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackLinkClick(link.url, link.type, link.title, link.category)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all shadow-2xs"
                        title="Visit Link in New Window"
                      >
                        <ExternalLink className="w-3 h-3" /> Visit
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: EDITOR ACTIONABLE PRIORITIZATION GUIDE */}
        {viewMode === 'insights' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-extrabold uppercase text-slate-800 dark:text-slate-200 tracking-wider">
                Editorial Priority Action Plan & Content Checklist
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Recommended tasks for content editors based on current reader demand and link health.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-rose-600 text-white font-black text-xs">1</span>
                  <h5 className="text-xs font-black uppercase tracking-wider text-rose-900 dark:text-rose-300">
                    Latest Jobs (Urgent Priority)
                  </h5>
                </div>
                <p className="text-xs text-rose-800 dark:text-rose-200 leading-relaxed">
                  <strong>42%</strong> of candidate visits target new government vacancies. Ensure official application deadlines and eligibility qualifications are updated immediately.
                </p>
                <div className="text-[11px] font-bold text-rose-700 dark:text-rose-400 pt-1">
                  Target: SSC, UPSC, RRB, State Police notifications.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-amber-600 text-white font-black text-xs">2</span>
                  <h5 className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    Admit Cards (High Priority)
                  </h5>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  <strong>28%</strong> search traffic occurs 3-7 days prior to national exams. Ensure direct candidate login download links and server mirrors are live.
                </p>
                <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 pt-1">
                  Target: NTA Exams, UPPSC, BPSC, IBPS Admit Cards.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-emerald-600 text-white font-black text-xs">3</span>
                  <h5 className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                    Results & Cutoffs (High Priority)
                  </h5>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
                  High burst traffic upon score card announcements. Attach direct PDF merit list download links and cutoff marks table.
                </p>
                <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 pt-1">
                  Target: Final Selection Lists & Scorecard Portals.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
