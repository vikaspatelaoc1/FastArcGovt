import React, { useState } from 'react';
import { JobAlert } from '../types';
import { Activity, RefreshCw, CheckCircle2, XCircle, AlertTriangle, ExternalLink, Search, Edit2, Save, X, Database, ShieldAlert, Check } from 'lucide-react';
import { normalizeExternalUrl } from '../utils/urlUtils';

interface LinkHealthCheckerTabProps {
  jobs: JobAlert[];
  setJobs: React.Dispatch<React.SetStateAction<JobAlert[]>>;
  onSaveJob?: (job: JobAlert) => Promise<void> | void;
  onToast: (msg: string) => void;
}

interface LinkStatus {
  url: string;
  normalizedUrl: string;
  status: 'pending' | 'checking' | 'ok' | 'error' | 'timeout';
  statusCode?: number;
  error?: string;
}

export const LinkHealthCheckerTab: React.FC<LinkHealthCheckerTabProps> = ({ jobs, setJobs, onSaveJob, onToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'needs_review' | 'has_links'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [linkStatuses, setLinkStatuses] = useState<Record<string, Record<string, LinkStatus>>>({});
  const [editingLink, setEditingLink] = useState<{ jobId: string, linkKey: string, value: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const jobsPerPage = 20;

  // Calculate needs review count
  const needsReviewCount = jobs.filter(j => 
    j.needsReview || 
    j.linkHealthStatus === 'Needs Review' || 
    (j.links && Object.values(j.links).some(v => typeof v === 'string' && (v.includes('Needs Review') || (j.linkReviewStatus && Object.values(j.linkReviewStatus).some(s => typeof s === 'string' && s.includes('Needs Review'))))))
  ).length;

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || job.id.includes(searchTerm);
    if (!matchesSearch) return false;

    if (filterType === 'needs_review') {
      const hasNeedsReview = job.needsReview || 
        job.linkHealthStatus === 'Needs Review' || 
        (job.links && Object.values(job.links).some(v => typeof v === 'string' && (v.includes('Needs Review') || (job.linkReviewStatus && Object.values(job.linkReviewStatus).some(s => typeof s === 'string' && s.includes('Needs Review'))))));
      return hasNeedsReview;
    }

    if (filterType === 'has_links') {
      return job.links && Object.keys(job.links).length > 0;
    }

    return true;
  });
  
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage));
  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const checkLink = async (jobId: string, linkKey: string, url: string) => {
    if (!url || url === 'Needs Review') return;
    const normalizedUrl = normalizeExternalUrl(url);
    
    setLinkStatuses(prev => ({
      ...prev,
      [jobId]: {
        ...(prev[jobId] || {}),
        [linkKey]: { url, normalizedUrl, status: 'checking' }
      }
    }));

    try {
      const res = await fetch('/api/check-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalizedUrl })
      });
      
      const data = await res.json();
      
      if (data.status === 'ok' && data.statusCode < 400) {
        setLinkStatuses(prev => ({
          ...prev,
          [jobId]: {
            ...prev[jobId],
            [linkKey]: { url, normalizedUrl, status: 'ok', statusCode: data.statusCode }
          }
        }));
      } else {
        setLinkStatuses(prev => ({
          ...prev,
          [jobId]: {
            ...prev[jobId],
            [linkKey]: { url, normalizedUrl, status: 'error', statusCode: data.statusCode || 500, error: data.error || 'Broken link' }
          }
        }));
      }
    } catch (err: any) {
      setLinkStatuses(prev => ({
        ...prev,
        [jobId]: {
          ...prev[jobId],
          [linkKey]: { url, normalizedUrl, status: 'error', error: err.message }
        }
      }));
    }
  };

  const handleSaveLink = async (jobId: string, linkKey: string) => {
    if (!editingLink || !onSaveJob) return;
    setIsSaving(true);
    
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const normalizedValue = normalizeExternalUrl(editingLink.value);
      const isStillNeedsReview = editingLink.value.trim().toLowerCase() === 'needs review' || !normalizedValue;
      
      const updatedLinks = {
        ...job.links,
        [linkKey]: isStillNeedsReview ? 'Needs Review' : normalizedValue
      };

      const updatedReviewStatus = {
        ...(job.linkReviewStatus || {}),
        [linkKey]: isStillNeedsReview ? 'Needs Review: Manual flag' : 'Healthy (Manually Fixed)'
      };

      const hasOtherNeedsReview = Object.values(updatedLinks).some(v => v === 'Needs Review');

      const updatedJob: JobAlert = {
        ...job,
        links: updatedLinks,
        linkReviewStatus: updatedReviewStatus,
        needsReview: hasOtherNeedsReview,
        linkHealthStatus: hasOtherNeedsReview ? 'Needs Review' : 'Healthy',
        lastLinkAuditAt: new Date().toISOString()
      };
      
      try {
        await onSaveJob(updatedJob);
        setJobs(jobs.map(j => j.id === jobId ? updatedJob : j));
        onToast(`Saved and normalized ${linkKey} link successfully`);
        setEditingLink(null);
        setLinkStatuses(prev => {
          const newStatuses = { ...prev };
          if (newStatuses[jobId]) {
            delete newStatuses[jobId][linkKey];
          }
          return newStatuses;
        });
      } catch (err: any) {
        onToast(`Failed to save: ${err.message}`);
      }
    }
    
    setIsSaving(false);
  };

  const scanAllOnPage = async () => {
    for (const job of currentJobs) {
      if (!job.links) continue;
      for (const [key, url] of Object.entries(job.links)) {
        if (url && typeof url === 'string' && url.startsWith('http')) {
          checkLink(job.id, key, url);
          await new Promise(r => setTimeout(r, 150));
        }
      }
    }
    onToast('Scan completed for current page');
  };

  const triggerLinkMigration = async () => {
    if (!confirm('Run URL normalization migration across all Firestore jobs and mark broken links as "Needs Review"?')) return;
    setIsMigrating(true);
    try {
      const res = await fetch('/api/admin/run-link-migration', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        onToast(`Migration completed! Scanned ${data.stats?.localJobsProcessed || 0} jobs. Broken links marked for review: ${data.stats?.localBrokenLinksFlagged || 0}`);
        // Refresh local state if jobs need reload
        window.location.reload();
      } else {
        onToast(`Migration notice: ${data.message || 'Complete'}`);
      }
    } catch (err: any) {
      onToast(`Migration error: ${err.message}`);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-100">Link Health & Review Center</h3>
              {needsReviewCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {needsReviewCount} Need Review
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">Validate external URLs, auto-normalize Indian govt links, and resolve flagged issues</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Filter toggle */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-medium">
            <button
              onClick={() => { setFilterType('all'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${filterType === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All ({jobs.length})
            </button>
            <button
              onClick={() => { setFilterType('needs_review'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${filterType === 'needs_review' ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30' : 'text-rose-400 hover:text-rose-300'}`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Needs Review ({needsReviewCount})
            </button>
            <button
              onClick={() => { setFilterType('has_links'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${filterType === 'has_links' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Has Links
            </button>
          </div>

          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          <button
            onClick={triggerLinkMigration}
            disabled={isMigrating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap"
            title="Normalize all database URLs and flag broken links as Needs Review"
          >
            <Database className={`w-3.5 h-3.5 ${isMigrating ? 'animate-spin' : ''}`} />
            {isMigrating ? 'Normalizing...' : 'Run DB Migration'}
          </button>

          <button
            onClick={scanAllOnPage}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-orange-500/20 whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Scan Page
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 rounded-tl-2xl w-1/3">Job Details</th>
                <th className="px-6 py-4">Links & Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {currentJobs.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Check className="w-8 h-8 text-emerald-500/50" />
                      <p className="text-slate-400 font-medium">No jobs matching current filter ({filterType})</p>
                      {filterType === 'needs_review' && (
                        <p className="text-xs text-slate-500">All links in the current view are normalized and healthy!</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentJobs.map((job) => {
                  const jobNeedsReview = job.needsReview || job.linkHealthStatus === 'Needs Review';

                  return (
                    <tr key={job.id} className={`hover:bg-slate-800/20 transition-colors ${jobNeedsReview ? 'bg-rose-950/10' : ''}`}>
                      <td className="px-6 py-4 align-top w-1/3">
                        <div className="flex items-start gap-2 mb-1">
                          {jobNeedsReview && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 whitespace-nowrap">
                              Needs Review
                            </span>
                          )}
                          <div className="font-medium text-slate-200">{job.title}</div>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                          <span>ID: {job.id}</span>
                          {job.state && <span className="text-slate-400">({job.state})</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {job.links ? (
                          <div className="space-y-3">
                            {Object.entries(job.links).map(([key, url]) => {
                              if (!url || typeof url !== 'string' || key === 'otherLinks') return null;
                              const isNeedsReview = url === 'Needs Review' || (job.linkReviewStatus && job.linkReviewStatus[key]?.includes('Needs Review'));
                              const status = linkStatuses[job.id]?.[key];
                              const isEditing = editingLink?.jobId === job.id && editingLink?.linkKey === key;
                              const normalized = normalizeExternalUrl(url);
                              const needsNormalization = url !== 'Needs Review' && url !== normalized;
                              const reviewNote = job.linkReviewStatus?.[key];
                              
                              return (
                                <div key={key} className={`flex flex-col gap-2 p-3 rounded-xl border transition-all ${
                                  isNeedsReview 
                                    ? 'bg-rose-950/20 border-rose-500/40' 
                                    : 'bg-slate-800/30 border-slate-800/50'
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-xs font-medium text-slate-300 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                      </span>

                                      {isNeedsReview && (
                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1">
                                          <AlertTriangle className="w-3 h-3" />
                                          Needs Review
                                        </span>
                                      )}

                                      {status?.status === 'checking' && (
                                        <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                                      )}
                                      {status?.status === 'ok' && (
                                        <div className="flex items-center gap-1 text-emerald-400" title={`Status: ${status.statusCode}`}>
                                          <CheckCircle2 className="w-4 h-4" />
                                          <span className="text-[11px] font-medium text-emerald-400/90">{status.statusCode}</span>
                                        </div>
                                      )}
                                      {status?.status === 'error' && (
                                        <div className="flex items-center gap-1 text-rose-400" title={status.error}>
                                          <XCircle className="w-4 h-4" />
                                        </div>
                                      )}
                                      {!status && !isNeedsReview && needsNormalization && (
                                        <div className="flex items-center gap-1 text-amber-400" title="URL can be auto-normalized with www. / protocol fix">
                                          <AlertTriangle className="w-4 h-4" />
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      {!isNeedsReview && (
                                        <button
                                          onClick={() => checkLink(job.id, key, url)}
                                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                          title="Test Link Response"
                                        >
                                          <RefreshCw className="w-4 h-4" />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => setEditingLink(isEditing ? null : { jobId: job.id, linkKey: key, value: url === 'Needs Review' ? '' : url })}
                                        className={`p-1.5 rounded-lg transition-colors ${
                                          isEditing ? 'text-orange-400 bg-orange-400/10' : 'text-slate-400 hover:text-orange-400 hover:bg-orange-400/10'
                                        }`}
                                        title="Edit & Repair Link"
                                      >
                                        {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                                      </button>
                                      {url !== 'Needs Review' && (
                                        <a
                                          href={normalized || url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                                          title="Open Link in New Tab"
                                        >
                                          <ExternalLink className="w-4 h-4" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {isEditing ? (
                                    <div className="flex items-center gap-2 mt-2">
                                      <input
                                        type="text"
                                        value={editingLink.value}
                                        placeholder="Enter valid URL (e.g. https://www.upsc.gov.in)..."
                                        onChange={(e) => setEditingLink({ ...editingLink, value: e.target.value })}
                                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                      />
                                      <button
                                        onClick={() => handleSaveLink(job.id, key)}
                                        disabled={isSaving}
                                        className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                                      >
                                        <Save className="w-3.5 h-3.5" />
                                        Save Fix
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-slate-400 mt-1">
                                      {isNeedsReview ? (
                                        <div className="text-rose-400/90 flex flex-col gap-1">
                                          <div className="font-semibold text-rose-300">⚠️ Flagged: {reviewNote || 'Invalid or malformed URL'}</div>
                                          <div className="text-[11px] text-slate-400">Click the Edit icon to provide a valid official link.</div>
                                        </div>
                                      ) : (
                                        <>
                                          <div className="truncate text-slate-300">{url}</div>
                                          {needsNormalization && (
                                            <div className="text-amber-400/90 mt-1 flex items-center gap-1 text-[11px]">
                                              <AlertTriangle className="w-3 h-3" />
                                              Auto-normalizes to: <span className="underline font-mono">{normalized}</span>
                                            </div>
                                          )}
                                          {status?.status === 'error' && (
                                            <div className="text-rose-400/90 mt-1 text-[11px]">
                                              Error: {status.error} (Status: {status.statusCode})
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">No links available</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800/50 pt-4 gap-3">
          <div className="text-sm text-slate-400">
            Showing <span className="text-slate-200 font-medium">{(currentPage - 1) * jobsPerPage + 1}</span> to <span className="text-slate-200 font-medium">{Math.min(currentPage * jobsPerPage, filteredJobs.length)}</span> of <span className="text-slate-200 font-medium">{filteredJobs.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 transition-colors text-sm"
            >
              Previous
            </button>
            <span className="text-slate-400 text-sm px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 transition-colors text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
