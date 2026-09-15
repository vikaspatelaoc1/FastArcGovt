import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, ExternalLink, Trash2, ShieldCheck, ListOrdered } from 'lucide-react';
import { JobAlert } from '../types';
import { BackendStagingQueue } from './BackendStagingQueue';

interface AdminApprovalsContentProps {
  jobs: JobAlert[];
  onUpdateJob: (job: JobAlert) => Promise<void>;
  onDeleteJob: (id: string) => Promise<void>;
  onToast?: (msg: string) => void;
  onPushJob?: (job: JobAlert) => Promise<void>;
  onBulkPushJobs?: (jobs: JobAlert[]) => Promise<void>;
}

export const AdminApprovalsContent: React.FC<AdminApprovalsContentProps> = ({ 
  jobs, 
  onUpdateJob, 
  onDeleteJob,
  onToast = (_msg: string) => {},
  onPushJob,
  onBulkPushJobs
}) => {
  const [activeApprovalTab, setActiveApprovalTab] = useState<'staging' | 'internal'>('staging');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingJobs = jobs.filter(j => j.status === 'Pending Approval');

  const handleApprove = async (job: JobAlert) => {
    setProcessingId(job.id);
    try {
      await onUpdateJob({ ...job, status: 'Application Open', isNew: true });
      onToast(`✅ Approved & Published "${job.title.substring(0, 30)}..." to Live Portal!`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if(!window.confirm('Are you sure you want to delete this scraped post?')) return;
    setProcessingId(id);
    try {
      await onDeleteJob(id);
      onToast('🗑️ Rejected and deleted job alert.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setActiveApprovalTab('staging')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeApprovalTab === 'staging'
              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ShieldCheck size={16} />
          <span>Firestore Backend Staging Queue</span>
        </button>

        <button
          onClick={() => setActiveApprovalTab('internal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeApprovalTab === 'internal'
              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Clock size={16} />
          <span>Manual Jobs Pending Approval ({pendingJobs.length})</span>
        </button>
      </div>

      {activeApprovalTab === 'staging' ? (
        <BackendStagingQueue
          onToast={onToast}
          onPromoteLiveSuccess={onPushJob}
          onBulkPromoteSuccess={onBulkPushJobs}
        />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="text-orange-400" size={24} />
                Internal Pending Approvals
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Review and approve manual or internal draft government jobs before they go live on the public portal.
              </p>
            </div>
            <div className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              {pendingJobs.length} Pending
            </div>
          </div>

          {pendingJobs.length === 0 ? (
            <div className="text-center py-12 bg-slate-950 rounded-lg border border-slate-800 border-dashed">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500/50 mb-3" />
              <h3 className="text-lg font-medium text-white">All Caught Up!</h3>
              <p className="text-slate-400 text-sm mt-1">There are no internal jobs pending approval right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingJobs.map(job => (
                <div key={job.id} className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-colors hover:border-slate-700">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {job.category.replace('-', ' ')}
                      </span>
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {job.state}
                      </span>
                      <span className="text-xs text-slate-500">{job.postDate}</span>
                    </div>
                    <h3 className="text-white font-medium text-lg mb-2">{job.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{job.shortInfo || 'No short info available.'}</p>
                    
                    <div className="flex gap-4 mt-3">
                      {job.links?.official && (
                        <a href={job.links.official} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                          <ExternalLink size={14} /> Official Site
                        </a>
                      )}
                      {job.links?.apply && (
                        <a href={job.links.apply} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                          <ExternalLink size={14} /> Apply Link
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex w-full md:w-auto md:flex-col gap-2 shrink-0">
                    <button
                      disabled={processingId === job.id}
                      onClick={() => handleApprove(job)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 size={18} />
                      Approve
                    </button>
                    <button
                      disabled={processingId === job.id}
                      onClick={() => handleReject(job.id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
