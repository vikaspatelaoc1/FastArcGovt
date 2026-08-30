import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Trash2, CheckCircle2, AlertTriangle, Edit3, MonitorPlay } from 'lucide-react';
import { JobAlert, EmployeeUser } from '../types';
import { saveBackupToFirestore, getBackupFromFirestore } from '../services/firestoreService';

interface VersionControlTabProps {
  jobs: JobAlert[];
  setJobs: React.Dispatch<React.SetStateAction<JobAlert[]>>;
  employees: EmployeeUser[];
  marqueeText: string;
  setMarqueeText: (text: string) => void;
  onToast: (msg: string) => void;
}

export const VersionControlTab: React.FC<VersionControlTabProps> = ({
  jobs,
  setJobs,
  employees,
  marqueeText,
  setMarqueeText,
  onToast
}) => {
  const [editorMarquee, setEditorMarquee] = useState(marqueeText);
  const [hasBackup, setHasBackup] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Check local first, then firestore
    const localBackup = localStorage.getItem('fastarc_website_backup');
    if (localBackup) setHasBackup(true);
    
    getBackupFromFirestore().then(backup => {
      if (backup) {
        setHasBackup(true);
        localStorage.setItem('fastarc_website_backup', JSON.stringify(backup));
      }
    });
  }, []);

  const handleSaveConfig = () => {
    setMarqueeText(editorMarquee);
    onToast('Website configuration updated directly on server!');
  };

  const handleBackupWebsite = () => {
    const backupData = {
      jobs,
      marqueeText,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('fastarc_website_backup', JSON.stringify(backupData));
    saveBackupToFirestore(backupData).catch(console.error);
    setHasBackup(true);
    onToast('Old Website Version saved to backup folder successfully!');
  };

  const handleRestoreClick = () => {
    if (!hasBackup) {
      onToast('No old backup found!');
      return;
    }
    setShowConfirm(true);
  };

  const confirmRestore = () => {
    try {
      const backupStr = localStorage.getItem('fastarc_website_backup');
      if (backupStr) {
        const backupData = JSON.parse(backupStr);
        if (backupData.jobs) {
          setJobs(backupData.jobs);
        }
        if (backupData.marqueeText) {
          setMarqueeText(backupData.marqueeText);
          setEditorMarquee(backupData.marqueeText);
        }
        onToast('Old Website Version successfully restored!');
      }
    } catch (e) {
      onToast('Failed to restore backup.');
    }
    setShowConfirm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-amber-500" /> Website Editor & Version Control
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Edit global website configurations or manage old/new versions of your website.
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <MonitorPlay className="w-4 h-4 text-blue-500" /> Live Editor Settings
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Scrolling Marquee Text</label>
            <textarea
              value={editorMarquee}
              onChange={(e) => setEditorMarquee(e.target.value)}
              rows={3}
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg p-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-500"
              placeholder="Enter the scrolling text for the top header..."
            />
          </div>

          <button
            onClick={handleSaveConfig}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Save className="w-4 h-4" /> Save Settings to Server
          </button>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-emerald-500" /> Website Version Manager
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Save your current website state (code/database) to a secure folder, or switch back to an older version.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-emerald-500/30 bg-emerald-500/5 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200">Current (New) Website</h5>
              <p className="text-[10px] text-slate-500 mt-1">This is your live, actively running website code.</p>
            </div>
            <button
              onClick={handleBackupWebsite}
              className="w-full mt-2 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition-all"
            >
              Save as Old Version Backup
            </button>
          </div>

          <div className="border border-amber-500/30 bg-amber-500/5 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200">Old Website Version</h5>
              <p className="text-[10px] text-slate-500 mt-1">
                {hasBackup ? "An old backup is available to restore." : "No backup found in folder."}
              </p>
            </div>
            <button
              onClick={handleRestoreClick}
              disabled={!hasBackup}
              className={`w-full mt-2 py-2 rounded-lg text-xs font-bold transition-all ${
                hasBackup 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              Switch to Old Website
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 text-amber-600 dark:text-amber-500">
              <AlertTriangle className="w-8 h-8" />
              <h3 className="text-lg font-bold">Final Confirmation</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to switch to the Old Website version? This action will replace your current live website data and configurations with the saved old code/data from the backup folder.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRestore}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-red-500 hover:bg-red-600 text-white shadow-md transition-colors"
              >
                Yes, Switch Website
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
