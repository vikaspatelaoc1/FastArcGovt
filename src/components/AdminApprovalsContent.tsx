import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, ExternalLink, Trash2 } from 'lucide-react';
import { JobAlert } from '../types';

interface AdminApprovalsContentProps {
  jobs: JobAlert[];
  onUpdateJob: (job: JobAlert) => Promise<void>;
  onDeleteJob: (id: string) => Promise<void>;
}

export const AdminApprovalsContent: React.FC<AdminApprovalsContentProps> = ({ jobs, onUpdateJob, onDeleteJob }) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingJobs = jobs.filter(j => j.status === 'Pending Approval');

  const handleApprove = async (job: JobAlert) => {
    setProcessingId(job.id);
    try {
      await onUpdateJob({ ...job, status: 'Application Open', isNew: true });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if(!window.confirm('Are you sure you want to delete this scraped post?')) return;
    setProcessingId(id);
    try {
      await onDeleteJob(id);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="text-orange-400" size={24} />
            Pending Approvals
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Review and approve auto-fetched government jobs before they go live on the public portal.
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
          <p className="text-slate-400 text-sm mt-1">There are no jobs pending approval right now.</p>
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
  );
};
