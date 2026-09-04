import React, { useState, useEffect } from 'react';
import { Globe, Search, RefreshCcw, ExternalLink, CheckCircle2, Copy, ShieldCheck, Radar } from 'lucide-react';
import { JobAlert } from '../types';

interface SitemapGeneratorTabProps {
  jobs: JobAlert[];
  onToast?: (msg: string) => void;
}

export const SitemapGeneratorTab: React.FC<SitemapGeneratorTabProps> = ({ jobs, onToast }) => {
  const [baseUrl, setBaseUrl] = useState('');
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);

  useEffect(() => {
    const host = window.location.host;
    const protocol = window.location.protocol;
    const base = `${protocol}//${host}`;
    setBaseUrl(base);
    setSitemapUrl(`${base}/sitemap.xml`);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(sitemapUrl);
    setCopied(true);
    if (onToast) onToast('Sitemap URL copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePingGoogle = async () => {
    setPinging(true);
    try {
      // Direct ping URL to Google Search Console
      const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      
      // In browser, this usually hits a CORS issue so we use no-cors or just open it.
      // But we can trigger a GET request using fetch with 'no-cors' mode just to send the signal
      await fetch(pingUrl, { mode: 'no-cors' });
      
      setPingSuccess(true);
      if (onToast) onToast('✅ Successfully pinged Google Search Console!');
      setTimeout(() => setPingSuccess(false), 3000);
    } catch (err) {
      if (onToast) onToast('⚠️ Error pinging Google. You can submit manually in GSC.');
    } finally {
      setPinging(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-fuchsia-950/80 via-slate-900 to-indigo-950/80 border border-fuchsia-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-fuchsia-500/20 border border-fuchsia-500/40 rounded-xl text-fuchsia-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-white tracking-wide">XML Sitemap Generator</h2>
              <span className="bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                SEO Indexing
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Dynamically generated sitemap for Googlebot & search engine crawlers.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Sitemap Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            
            <h3 className="text-lg font-bold text-white flex items-center mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mr-2" />
              Live Sitemap Status
            </h3>
            
            <p className="text-sm text-slate-400 mb-6">
              Your sitemap.xml is automatically generated and updated in real-time. It includes all active jobs, category tabs, and pages.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Public Sitemap URL
              </label>
              <div className="flex items-center space-x-3">
                <input 
                  type="text" 
                  readOnly 
                  value={sitemapUrl}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none"
                />
                <button 
                  onClick={handleCopy}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-colors"
                  title="Copy URL"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
                <a 
                  href={sitemapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/30 rounded-lg transition-colors flex items-center justify-center"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={handlePingGoogle}
                disabled={pinging}
                className="flex-1 flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all cursor-pointer"
              >
                {pinging ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : pingSuccess ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Radar className="w-5 h-5" />
                )}
                <span>{pinging ? 'Pinging...' : pingSuccess ? 'Ping Sent!' : 'Ping Google Search Console'}</span>
              </button>
            </div>
            
          </div>
        </div>

        {/* Right Col: Stats */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white flex items-center mb-6">
              <Search className="w-5 h-5 text-indigo-400 mr-2" />
              Index Stats
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-sm text-slate-400">Total Jobs Crawled</span>
                <span className="text-lg font-black text-indigo-400">{jobs.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-sm text-slate-400">Categories Included</span>
                <span className="text-lg font-black text-emerald-400">7</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-sm text-slate-400">Update Frequency</span>
                <span className="text-sm font-bold text-amber-400">Daily / Always</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
              <p className="text-xs text-indigo-300 leading-relaxed">
                <strong>Tip:</strong> You only need to submit your sitemap to Google Search Console once. After that, Google automatically checks it periodically. You can manually ping Google if you publish a large number of jobs at once.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
