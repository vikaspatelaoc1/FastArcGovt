import React, { useRef, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, Check, Zap, Sparkles, CheckCircle2, History, Trash2, RotateCcw } from 'lucide-react';
import { optimizeImageFile, OPTIMIZER_PRESETS, OptimizationResult } from '../utils/imageOptimizer';
import { subscribeToLogoHistory, saveLogoHistoryToFirestore, LogoBackup } from '../services/firestoreService';

interface LogoManagerProps {
  currentLogo: string;
  onUpdateLogo: (base64Image: string) => void;
  onToast: (msg: string) => void;
}

export const LogoManager: React.FC<LogoManagerProps> = ({ currentLogo, onUpdateLogo, onToast }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [optimizationStats, setOptimizationStats] = useState<OptimizationResult | null>(null);
  const [logoHistory, setLogoHistory] = useState<LogoBackup[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');

  useEffect(() => {
    const unsubscribe = subscribeToLogoHistory((history) => {
      setLogoHistory(history);
    });
    return () => unsubscribe();
  }, []);

  const processAndCompressLogo = async (file: File) => {
    setIsProcessing(true);
    try {
      const result = await optimizeImageFile(file, OPTIMIZER_PRESETS.logo);
      setPreview(result.dataUrl);
      setOptimizationStats(result);
      setIsProcessing(false);
      onToast(`⚡ Logo compressed by ${result.savedPercentage}% (${result.formattedOriginalSize} → ${result.formattedOptimizedSize})`);
    } catch (err: any) {
      onToast(`Failed to optimize image: ${err?.message || 'Unknown error'}`);
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        onToast('Please upload a valid image file (PNG, JPG, SVG, WebP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        onToast('Image is too large. Please select an image under 10MB.');
        return;
      }
      processAndCompressLogo(file);
    }
  };

  const handleSave = async () => {
    if (preview) {
      // Create backup of the current logo before updating (if it exists and is different)
      if (currentLogo && currentLogo !== preview && !currentLogo.startsWith('http')) {
        const isDuplicate = logoHistory.length > 0 && logoHistory[0].logoData === currentLogo;
        if (!isDuplicate) {
          const newBackup: LogoBackup = {
            id: Date.now().toString(),
            logoData: currentLogo,
            timestamp: Date.now(),
          };
          const updatedHistory = [newBackup, ...logoHistory].slice(0, 10); // Keep last 10
          await saveLogoHistoryToFirestore(updatedHistory);
        }
      }

      onUpdateLogo(preview);
      onToast('✅ High-performance optimized logo applied globally!');
      setPreview(null);
      setOptimizationStats(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setOptimizationStats(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRestoreBackup = (backupLogoData: string) => {
    // Before restoring, optionally backup the current active one
    if (currentLogo && currentLogo !== backupLogoData && !currentLogo.startsWith('http')) {
       const isDuplicate = logoHistory.length > 0 && logoHistory[0].logoData === currentLogo;
       if (!isDuplicate) {
         const newBackup: LogoBackup = {
           id: Date.now().toString(),
           logoData: currentLogo,
           timestamp: Date.now(),
         };
         const updatedHistory = [newBackup, ...logoHistory].slice(0, 10);
         saveLogoHistoryToFirestore(updatedHistory);
       }
    }
    onUpdateLogo(backupLogoData);
    onToast('✅ Logo restored from backup successfully!');
  };

  const handleDeleteBackup = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this backed-up logo?")) {
      const updatedHistory = logoHistory.filter(b => b.id !== id);
      await saveLogoHistoryToFirestore(updatedHistory);
      onToast('🗑️ Backup logo deleted.');
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2.5 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'upload' 
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload New Logo
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'history' 
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'
          }`}
        >
          <History className="w-3.5 h-3.5" /> Backup History ({logoHistory.length})
        </button>
      </div>

      {activeTab === 'upload' && (
        <div className="p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-500" /> Auto-Optimized Logo Manager
              </h4>
              <p className="text-[11px] text-slate-500 font-normal mt-1">
                Upload any custom image. It is automatically compressed to high-speed WebP/PNG, cropped to a 256x256 circle, and optimized for ultra-fast page loads.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0 ml-2">
              <Zap className="w-3 h-3 text-emerald-500" /> Auto-Compression
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Current / Preview Logo Display */}
            <div className="relative w-16 h-16 rounded-full bg-black border-2 border-amber-500 shadow-md flex items-center justify-center overflow-hidden shrink-0">
              <img 
                src={preview || currentLogo} 
                alt="Portal Logo Preview" 
                className="w-full h-full object-cover scale-125 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/d/1IE6MQ8EUwyKmGeXnpLTXx7d5HBLJiKb4";
                }}
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                </div>
              )}
            </div>

            {/* Upload Controls & Optimization Stats */}
            <div className="flex-1 space-y-2">
              {!preview ? (
                <div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    className="hidden" 
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm hover:shadow-blue-500/20"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload & Optimize Logo
                  </button>
                  <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Automatic WebP transcoding + Lossless compression to &lt;20KB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {optimizationStats && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {optimizationStats.savedPercentage}% Compressed
                      </span>
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                        {optimizationStats.formattedOriginalSize} → <strong className="text-blue-600 dark:text-blue-400">{optimizationStats.formattedOptimizedSize}</strong>
                      </span>
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                        {optimizationStats.width}×{optimizationStats.height}px
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={handleSave}
                      className="flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" /> Apply Optimized Logo
                    </button>
                    <button 
                      type="button"
                      onClick={handleCancel}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-blue-500" /> Previously Uploaded Logos
              </h4>
              <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                Your past logos are automatically backed up here (max 10). Restore or delete them anytime.
              </p>
            </div>
          </div>

          {logoHistory.length === 0 ? (
            <div className="text-center py-6 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 border-dashed">
              <History className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-500">No logo backups found.</p>
              <p className="text-[10px] text-slate-400 mt-1">Upload a new logo to create a backup of the current one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {logoHistory.map((backup) => (
                <div key={backup.id} className="relative group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-black border border-amber-500/60 flex items-center justify-center overflow-hidden">
                    <img 
                      src={backup.logoData} 
                      alt="Backup Logo" 
                      className="w-full h-full object-cover scale-125 rounded-full" 
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 text-center font-medium">
                    {new Date(backup.timestamp).toLocaleDateString()}
                  </span>
                  
                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-slate-900/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleRestoreBackup(backup.logoData)}
                      className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer"
                      title="Restore this logo"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBackup(backup.id)}
                      className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors cursor-pointer"
                      title="Delete this backup"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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


