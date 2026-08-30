import React, { useState, useEffect, useRef } from 'react';
import { 
  Type, 
  RotateCcw, 
  Save, 
  Check, 
  Sparkles, 
  Layers, 
  Edit3, 
  Eye, 
  EyeOff,
  FileText,
  Sliders,
  CheckCheck,
  Zap,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { 
  ColumnConfigsMap, 
  DEFAULT_COLUMN_CONFIGS, 
  SingleColumnConfig, 
  loadColumnConfigs, 
  saveColumnConfigs 
} from '../utils/columnConfig';
import { optimizeImageFile, OPTIMIZER_PRESETS, OptimizationResult } from '../utils/imageOptimizer';
import { CategoryIcon, isImageIconUrl } from './CategoryIcon';

interface ColumnEditorTabProps {
  onToast: (msg: string) => void;
  initialColumnId?: string;
}

const COMMON_EMOJIS = ['⭐', '🏆', '📄', '💼', '🔑', '📚', '🎓', '📜', '⚡', '🔔', '📌', '🎯', '🔥', '📢', '🏛️'];

const TITLE_PRESETS: Record<string, string[]> = {
  'results': ['RESULTS 2026', 'SARKARI RESULT', 'EXAM RESULTS', 'MERIT LIST & CUT OFF', 'RESULTS & MARKS'],
  'admit-cards': ['ADMIT CARD', 'HALL TICKET 2026', 'CALL LETTER', 'EXAM ADMIT CARDS', 'E-ADMIT CARD'],
  'latest-jobs': ['LATEST JOBS', 'SARKARI NAUKRI', 'ONLINE FORM 2026', 'NEW VACANCIES', 'GOVT JOBS 2026'],
  'answer-key': ['ANSWER KEY', 'OFFICIAL KEYS', 'ANSWER SHEET & OBJECTION', 'SOLVED PAPERS', 'MODEL ANSWER KEY'],
  'syllabus': ['SYLLABUS & PATTERN', 'EXAM SYLLABUS PDF', 'PREVIOUS PAPERS', 'EXAM PATTERN', 'Syllabus 2026'],
  'admission': ['ADMISSION 2026', 'COLLEGE ADMISSION', 'UNIVERSITY FORMS', 'ENTRANCE ADMISSION', 'COUNSELLING FORMS'],
  'documents': ['CERTIFICATE & SERVICES', 'DOCUMENT CORRECTION', 'ONLINE SERVICES', 'VERIFICATION DESK', 'DOCUMENTS HUB'],
  'important': ['IMPORTANT LINKS', 'OFFICIAL NOTICES', 'ADMIT CARD CORRECTION', 'DIRECT RECRUITMENT', 'GENERAL ALERTS']
};

export const ColumnEditorTab: React.FC<ColumnEditorTabProps> = ({ onToast, initialColumnId }) => {
  const [columns, setColumns] = useState<ColumnConfigsMap>(loadColumnConfigs());
  const [selectedColumnId, setSelectedColumnId] = useState<string>(initialColumnId || 'latest-jobs');
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [isLiveSaved, setIsLiveSaved] = useState<boolean>(false);
  const [isOptimizingIcon, setIsOptimizingIcon] = useState<boolean>(false);
  const [iconOptStats, setIconOptStats] = useState<OptimizationResult | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setColumns(loadColumnConfigs());
    if (initialColumnId) {
      setSelectedColumnId(initialColumnId);
    }
  }, [initialColumnId]);

  const handleSelectColumn = (colKey: string) => {
    setSelectedColumnId(colKey);
    setIconOptStats(null);
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.select();
      }
    }, 100);
  };

  const handleToggleColumnVisibility = (columnId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setColumns(prev => {
      const current = prev[columnId] || { ...DEFAULT_COLUMN_CONFIGS[columnId] };
      const currentEnabled = current.enabled !== false;
      const updated = {
        ...prev,
        [columnId]: {
          ...current,
          enabled: !currentEnabled
        }
      };
      
      saveColumnConfigs(updated);
      onToast(`Column "${current.title}" is now ${!currentEnabled ? 'VISIBLE on Homepage' : 'HIDDEN from Homepage'} (Synced to DB)!`);
      return updated;
    });

    setIsLiveSaved(true);
    setTimeout(() => setIsLiveSaved(false), 1500);
  };

  const handleSetAllVisibility = (visible: boolean) => {
    setColumns(prev => {
      const updated: ColumnConfigsMap = {};
      Object.keys(DEFAULT_COLUMN_CONFIGS).forEach(key => {
        const cur = prev[key] || { ...DEFAULT_COLUMN_CONFIGS[key] };
        updated[key] = {
          ...cur,
          enabled: visible
        };
      });
      saveColumnConfigs(updated);
      onToast(`All columns are now ${visible ? 'VISIBLE on homepage' : 'HIDDEN from homepage'}!`);
      return updated;
    });
  };

  const handleFieldChange = (columnId: string, field: keyof SingleColumnConfig, value: any) => {
    setColumns(prev => {
      const current = prev[columnId] || { ...DEFAULT_COLUMN_CONFIGS[columnId] };
      const updated = {
        ...prev,
        [columnId]: {
          ...current,
          [field]: value
        }
      };
      
      // Auto-save on every single keystroke so changes apply live instantly
      saveColumnConfigs(updated);
      
      return updated;
    });

    setIsLiveSaved(true);
    setTimeout(() => setIsLiveSaved(false), 1200);
  };

  const handleCustomIconUpload = async (e: React.ChangeEvent<HTMLInputElement>, colKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onToast('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    setIsOptimizingIcon(true);
    try {
      const result = await optimizeImageFile(file, OPTIMIZER_PRESETS.categoryIcon);
      setIconOptStats(result);
      handleFieldChange(colKey, 'icon', result.dataUrl);
      onToast(`⚡ Category icon compressed by ${result.savedPercentage}% (${result.formattedOriginalSize} → ${result.formattedOptimizedSize})`);
    } catch (err: any) {
      onToast(`Failed to optimize icon: ${err?.message || 'Error processing image'}`);
    } finally {
      setIsOptimizingIcon(false);
      if (iconInputRef.current) iconInputRef.current.value = '';
    }
  };

  const handleResetToDefaultEmoji = (colKey: string) => {
    const defaultIcon = DEFAULT_COLUMN_CONFIGS[colKey]?.icon || '⭐';
    handleFieldChange(colKey, 'icon', defaultIcon);
    setIconOptStats(null);
    onToast(`Reset category icon to ${defaultIcon}`);
  };

  const handleSaveAll = () => {
    saveColumnConfigs(columns);
    onToast('✅ All portal column titles & visibility states saved to Database!');
  };

  const handleSaveSingle = (colId: string) => {
    saveColumnConfigs(columns);
    setSavedKey(colId);
    setTimeout(() => setSavedKey(null), 1500);
    onToast(`✅ Saved changes & visibility for "${columns[colId]?.title || colId}"!`);
  };

  const handleResetSingle = (colId: string) => {
    const def = DEFAULT_COLUMN_CONFIGS[colId];
    if (def) {
      const updated = { ...columns, [colId]: { ...def } };
      setColumns(updated);
      saveColumnConfigs(updated);
      onToast(`🔄 Reset column "${def.title}" to default settings.`);
    }
  };

  const handleResetAll = () => {
    if (window.confirm('Reset all portal column titles, text, and visibility back to system defaults?')) {
      setColumns(DEFAULT_COLUMN_CONFIGS);
      saveColumnConfigs(DEFAULT_COLUMN_CONFIGS);
      onToast('🔄 All columns reset to original defaults in database.');
    }
  };

  const activeCol = columns[selectedColumnId] || DEFAULT_COLUMN_CONFIGS[selectedColumnId] || {
    id: selectedColumnId,
    title: selectedColumnId.toUpperCase(),
    icon: '📌',
    enabled: true
  };

  const isCurrentColEnabled = activeCol.enabled !== false;
  const presets = TITLE_PRESETS[selectedColumnId] || ['LATEST NOTIFICATIONS', 'IMPORTANT ALERTS', 'OFFICIAL UPDATES'];

  // Count visible vs hidden
  const allKeys = Object.keys(DEFAULT_COLUMN_CONFIGS);
  const visibleCount = allKeys.filter(k => (columns[k]?.enabled !== false)).length;
  const hiddenCount = allKeys.length - visibleCount;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="p-4 bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-900 border border-blue-500/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-lg shrink-0">
            <Type className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-white">Homepage Sections & Column Visibility Controller</h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/40 uppercase tracking-wide flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" /> Database Live Sync
              </span>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                {visibleCount} Visible / {hiddenCount} Hidden
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Toggle visibility (Show/Hide) of individual sections like 'Latest Jobs', 'Admit Cards', or 'Results' on the homepage directly from the database.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => handleSetAllVisibility(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
            title="Make all 8 sections visible on homepage"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Show All</span>
          </button>

          <button
            type="button"
            onClick={handleResetAll}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-lg hover:shadow-blue-500/25"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save to Database</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Column Selector List & Live Editor Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column Selector */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between pb-1">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Homepage Sections ({Object.keys(DEFAULT_COLUMN_CONFIGS).length})</span>
            </label>
            <span className="text-[10px] text-amber-400 font-medium">Click card to edit / Toggle eye to show/hide</span>
          </div>

          <div className="space-y-2">
            {Object.keys(DEFAULT_COLUMN_CONFIGS).map((colKey) => {
              const col = columns[colKey] || DEFAULT_COLUMN_CONFIGS[colKey];
              const isSelected = selectedColumnId === colKey;
              const isEnabled = col.enabled !== false;

              return (
                <div
                  key={colKey}
                  onClick={() => handleSelectColumn(colKey)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-950/80 via-indigo-950/60 to-slate-900 border-blue-500 shadow-lg ring-2 ring-blue-500/40'
                      : isEnabled 
                        ? 'bg-slate-900/70 border-slate-800 hover:border-blue-500/50 hover:bg-slate-850'
                        : 'bg-slate-950/60 border-slate-800/60 opacity-60 hover:opacity-90 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-10 h-10 rounded-xl border flex items-center justify-center text-xl shrink-0 overflow-hidden ${
                      isEnabled ? 'bg-slate-800/80 border-slate-700/80' : 'bg-slate-900 border-slate-800 grayscale'
                    }`}>
                      <CategoryIcon icon={col.icon} className="w-6 h-6 object-contain" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className={`text-xs font-extrabold truncate group-hover:text-blue-300 transition-colors ${
                          isEnabled ? 'text-white' : 'text-slate-400 line-through'
                        }`}>
                          {col.title}
                        </h4>
                        {isEnabled ? (
                          <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded shrink-0 uppercase flex items-center gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> LIVE
                          </span>
                        ) : (
                          <span className="text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded shrink-0 uppercase flex items-center gap-0.5">
                            <EyeOff className="w-2.5 h-2.5" /> HIDDEN
                          </span>
                        )}
                        {col.badgeText && (
                          <span className="text-[9px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded shrink-0 uppercase">
                            {col.badgeText}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {col.tagline || col.hindiTitle || 'Click to edit heading text'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Quick Show/Hide Toggle Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleColumnVisibility(colKey, e)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isEnabled
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700/60 hover:bg-emerald-900/80 hover:text-white'
                          : 'bg-amber-950/60 text-amber-400 border-amber-700/60 hover:bg-amber-900/80 hover:text-white'
                      }`}
                      title={isEnabled ? 'Click to HIDE section from homepage' : 'Click to SHOW section on homepage'}
                    >
                      {isEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {savedKey === colKey && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800">
                        <CheckCheck className="w-3 h-3" /> Saved
                      </span>
                    )}
                    <span className={`p-1.5 rounded-lg border transition-all ${
                      isSelected ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800 text-slate-400 border-slate-700 group-hover:text-white group-hover:bg-blue-600/30'
                    }`}>
                      <Edit3 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Column Editor Panel */}
        <div className="lg:col-span-7 space-y-4" ref={editorRef}>
          <div className="bg-slate-900/90 border-2 border-blue-500/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                  <CategoryIcon icon={activeCol.icon} className="w-6 h-6 object-contain" />
                </span>
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    Section: <span className="text-blue-400">{activeCol.title}</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>ID: <code className="text-amber-400 font-mono">{activeCol.id}</code></span>
                    {isLiveSaved && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                        <CheckCircle2 className="w-3 h-3" /> Live Auto-Saved to Database
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleResetSingle(activeCol.id)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer transition-colors"
                title="Reset this column to default"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* HOMEPAGE VISIBILITY MASTER TOGGLE (SHOW / HIDE) */}
            <div className={`p-4 rounded-xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isCurrentColEnabled 
                ? 'bg-emerald-950/30 border-emerald-500/50 shadow-inner' 
                : 'bg-amber-950/30 border-amber-500/50 shadow-inner'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  isCurrentColEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {isCurrentColEnabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">
                      Homepage Visibility Status:
                    </span>
                    {isCurrentColEnabled ? (
                      <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        VISIBLE ON HOMEPAGE
                      </span>
                    ) : (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        HIDDEN FROM HOMEPAGE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {isCurrentColEnabled 
                      ? `Candidate visitors can view and interact with the "${activeCol.title}" section on the homepage.` 
                      : `The "${activeCol.title}" section is completely hidden from candidates on the homepage.`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleColumnVisibility(activeCol.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shadow-md shrink-0 ${
                  isCurrentColEnabled
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-amber-500/30'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:shadow-emerald-500/30'
                }`}
              >
                {isCurrentColEnabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{isCurrentColEnabled ? 'Hide Section' : 'Show Section'}</span>
              </button>
            </div>

            {/* Column Title Main Input */}
            <div className="space-y-2 bg-blue-950/30 p-3.5 border border-blue-500/30 rounded-xl">
              <label className="text-xs font-black text-blue-300 block flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-blue-400" />
                  Section Display Title (कॉलम का मुख्य नाम) *
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">Auto-saves live as you type</span>
              </label>

              <input
                ref={titleInputRef}
                type="text"
                required
                value={activeCol.title}
                onChange={(e) => handleFieldChange(activeCol.id, 'title', e.target.value)}
                placeholder="e.g. LATEST JOBS 2026"
                className="w-full bg-slate-950 border-2 border-blue-500 rounded-xl px-3.5 py-3 text-white font-extrabold text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-inner"
              />

              {/* Quick Title Presets */}
              <div className="pt-1">
                <span className="text-[10px] text-slate-400 block mb-1.5 font-bold">
                  ⚡ One-Click Title Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleFieldChange(activeCol.id, 'title', preset)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-[11px] font-bold border border-slate-700 hover:border-blue-400 cursor-pointer transition-all"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Subtitle / Tagline Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 block">
                Tagline / Subtitle Text (छोटा विवरण)
              </label>
              <input
                type="text"
                value={activeCol.tagline || ''}
                onChange={(e) => handleFieldChange(activeCol.id, 'tagline', e.target.value)}
                placeholder="e.g. Online Application Forms & Vacancy Alerts 2026"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Icon & Badge Row with Image Upload & Real-time Compression */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Category Icon / Custom Image Optimizer */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>Category Icon / Custom Image</span>
                  </label>
                  {isImageIconUrl(activeCol.icon) && (
                    <button
                      type="button"
                      onClick={() => handleResetToDefaultEmoji(activeCol.id)}
                      className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Reset Emoji
                    </button>
                  )}
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    {/* Active Icon Display */}
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                      <CategoryIcon icon={activeCol.icon} className="w-6 h-6 object-contain" />
                    </div>

                    {/* Upload Custom Icon Button */}
                    <div className="flex-1 space-y-1">
                      <input
                        type="file"
                        ref={iconInputRef}
                        onChange={(e) => handleCustomIconUpload(e, activeCol.id)}
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        className="hidden"
                      />
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => iconInputRef.current?.click()}
                          disabled={isOptimizingIcon}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Upload className="w-3 h-3" />
                          {isOptimizingIcon ? 'Optimizing...' : 'Upload & Compress'}
                        </button>
                        
                        {!isImageIconUrl(activeCol.icon) && (
                          <input
                            type="text"
                            value={activeCol.icon}
                            onChange={(e) => handleFieldChange(activeCol.id, 'icon', e.target.value)}
                            placeholder="⭐"
                            className="w-12 text-center text-xs bg-slate-900 border border-slate-700 rounded-lg py-1 text-white focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Common Emoji Quick Selector */}
                  <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-slate-900">
                    <span className="text-[9px] text-slate-500 font-bold mr-1">Quick:</span>
                    {COMMON_EMOJIS.slice(0, 8).map((emoji, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleFieldChange(activeCol.id, 'icon', emoji)}
                        className="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-xs cursor-pointer transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Icon Compression Metrics if Uploaded */}
                  {iconOptStats && (
                    <div className="flex items-center gap-1.5 text-[10px] bg-emerald-950/40 border border-emerald-800/60 rounded-lg px-2 py-1 text-emerald-300">
                      <Zap className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Optimized: <strong>{iconOptStats.formattedOriginalSize} → {iconOptStats.formattedOptimizedSize}</strong> ({iconOptStats.savedPercentage}% saved)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tag / Badge Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 block">
                  Badge Tag (e.g. HOT, LIVE, NEW, ACTIVE)
                </label>
                <input
                  type="text"
                  value={activeCol.badgeText || ''}
                  onChange={(e) => handleFieldChange(activeCol.id, 'badgeText', e.target.value.toUpperCase())}
                  placeholder="e.g. HOT"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-black font-mono text-xs focus:outline-none focus:border-amber-400 uppercase"
                />
              </div>
            </div>

            {/* LIVE PREVIEW BOX WITH DIRECT EDIT & VISIBILITY BADGE */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span className="flex items-center gap-1 text-blue-400">
                  <Eye className="w-3.5 h-3.5" /> Live Card Preview
                </span>
                {isCurrentColEnabled ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    ● Visible on Homepage
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    ● Hidden from Homepage
                  </span>
                )}
              </div>

              <div className={`rounded-xl overflow-hidden border shadow-lg relative ${
                isCurrentColEnabled ? 'border-slate-800 bg-slate-900' : 'border-amber-800/60 bg-slate-950 opacity-70'
              }`}>
                {!isCurrentColEnabled && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-center p-4">
                    <EyeOff className="w-8 h-8 text-amber-400 mb-1" />
                    <span className="text-sm font-black text-amber-300">SECTION CURRENTLY HIDDEN</span>
                    <p className="text-[11px] text-slate-300 max-w-xs mt-1">This column will not appear on the visitor homepage.</p>
                    <button
                      type="button"
                      onClick={() => handleToggleColumnVisibility(activeCol.id)}
                      className="mt-2 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-black cursor-pointer shadow-md"
                    >
                      Make Visible Now
                    </button>
                  </div>
                )}

                <div className="p-3.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                      <CategoryIcon icon={activeCol.icon} className="w-5 h-5 object-contain" />
                    </span>
                    <div className="min-w-0">
                      <h5 className="font-extrabold text-sm tracking-wide truncate">{activeCol.title || 'COLUMN TITLE'}</h5>
                      {activeCol.tagline && (
                        <p className="text-[11px] text-blue-100/90 leading-none mt-0.5 truncate">{activeCol.tagline}</p>
                      )}
                    </div>
                  </div>
                  {activeCol.badgeText && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow uppercase shrink-0">
                      {activeCol.badgeText}
                    </span>
                  )}
                </div>

                <div className="p-3 text-center text-slate-400 text-xs bg-slate-950/60 font-mono">
                  <span>Job alerts will be displayed under "{activeCol.title}" on the homepage.</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 flex-wrap gap-2">
              <span className="text-[11px] text-slate-400">
                All title & visibility updates persist to Firestore database instantly.
              </span>
              <button
                type="button"
                onClick={() => handleSaveSingle(activeCol.id)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center gap-2 cursor-pointer transition-all shadow-lg hover:shadow-blue-500/30"
              >
                <Save className="w-4 h-4" />
                <span>Confirm & Save "{activeCol.title}"</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

