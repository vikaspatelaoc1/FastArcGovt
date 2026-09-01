import React, { useState, useEffect } from 'react';
import { RefreshCw, X, Zap } from 'lucide-react';

export function UpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [newVersion, setNewVersion] = useState('');

  useEffect(() => {
    // Check for version updates
    const checkUpdate = async () => {
      try {
        const res = await fetch('/api/v1/site-config');
        const data = await res.json();
        if (data.success && data.siteConfig?.appVersion) {
          const currentVersion = localStorage.getItem('fastarc_app_version');
          const serverVersion = data.siteConfig.appVersion;
          
          if (!currentVersion) {
            // First time, just save it
            localStorage.setItem('fastarc_app_version', serverVersion);
          } else if (currentVersion !== serverVersion) {
            // Version mismatch! New update available
            setNewVersion(serverVersion);
            setShowUpdate(true);
          }
        }
      } catch (err) {
        console.warn('Failed to check app version', err);
      }
    };
    
    // Check on initial load
    checkUpdate();
    
    // Periodically check every 5 minutes in background
    const interval = setInterval(checkUpdate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdate = () => {
    // Save new version and hard reload
    localStorage.setItem('fastarc_app_version', newVersion);
    setShowUpdate(false);
    
    // Clear caches if service worker is present
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (let name of names) {
          caches.delete(name);
        }
      });
    }
    
    // Force a hard reload
    window.location.reload();
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[9999] bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl shadow-2xl p-5 border border-blue-400/30 animate-in slide-in-from-top-10 fade-in duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <Zap className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight text-white">App Update Available</h3>
            <p className="text-sm text-blue-200 mt-0.5">Version {newVersion} is ready with new features.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowUpdate(false)}
          className="p-1 text-blue-300 hover:text-white bg-blue-950/50 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="mt-5">
        <button 
          onClick={handleUpdate}
          className="w-full py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/30"
        >
          <RefreshCw className="w-4 h-4 animate-spin-slow" /> Update Now
        </button>
      </div>
    </div>
  );
}
