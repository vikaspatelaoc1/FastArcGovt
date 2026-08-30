import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, ChevronDown, Sun, Moon, ShieldCheck, Menu, X, Briefcase, FileText, 
  Award, BookOpen, GraduationCap, CheckSquare, HelpCircle, Phone, 
  Info, Shield, AlertCircle, Send, Sparkles, MoreVertical, BarChart3, Megaphone, 
  Settings, Database, Users, UserPlus, ChevronRight, Package, LogOut, Monitor, History, Palette, Type, SlidersHorizontal
} from 'lucide-react';
import { SocialLinkItem, SuperAdminTabType } from '../types';
import { SUPER_ADMIN_MODULES } from '../config/superAdminConfig';
import { OfficialSocialLogo } from './SocialIcons';

interface HeaderProps {
  themeMode?: 'light' | 'dark' | 'system';
  onSetThemeMode?: (mode: 'light' | 'dark' | 'system') => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  onAdminLoginClick: () => void;
  isLoggedIn: boolean;
  isSuperAdmin?: boolean;
  employeeName?: string;
  onOpenSuperAdminModal?: (tab?: SuperAdminTabType) => void;
  onOpenNpmSystem?: () => void;
  onLogout: () => void;
  onInfoClick: (pageId: string) => void;
  activeTab: string;
  onTabChange: (id: string) => void;
  onSelectState?: (stateName: string) => void;
  socialLinks?: SocialLinkItem[];
  siteLogo?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  themeMode = 'system',
  onSetThemeMode,
  onToggleDarkMode, 
  isDarkMode, 
  onAdminLoginClick, 
  isLoggedIn, 
  isSuperAdmin,
  employeeName,
  onOpenSuperAdminModal,
  onOpenNpmSystem,
  onLogout, 
  onInfoClick, 
  activeTab, 
  onTabChange,
  onSelectState,
  socialLinks,
  siteLogo = "/logo.png"
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSuperAdminMenuExpanded, setIsSuperAdminMenuExpanded] = useState(false);
  const [expandedSidebarSections, setExpandedSidebarSections] = useState<Record<string, boolean>>({
    portal: true,
    connect: true,
    pages: true
  });
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    core: true,
    content: true,
    system: false,
    users: false,
    tools: false
  });
  const [isDesktopAdminOpen, setIsDesktopAdminOpen] = useState(false);
  const [isHeader3DotOpen, setIsHeader3DotOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);
  const header3DotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
      if (adminRef.current && !adminRef.current.contains(event.target as Node)) {
        setIsDesktopAdminOpen(false);
      }
      if (header3DotRef.current && !header3DotRef.current.contains(event.target as Node)) {
        setIsHeader3DotOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    onTabChange(id);
    setIsDrawerOpen(false);
  };

  const navLinks = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: Sparkles,
      iconColor: 'text-amber-500 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200/80 dark:border-amber-800/60',
      activeCard: 'bg-amber-50/90 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 shadow-sm shadow-amber-500/10'
    },
    { 
      id: 'latest-jobs', 
      label: 'Latest Jobs', 
      icon: Briefcase,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200/80 dark:border-blue-800/60',
      activeCard: 'bg-blue-50/90 dark:bg-blue-500/15 border-blue-300 dark:border-blue-500/40 text-blue-900 dark:text-blue-300 shadow-sm shadow-blue-500/10'
    },
    { 
      id: 'admit-card', 
      label: 'Admit Card', 
      icon: FileText,
      iconColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200/80 dark:border-rose-800/60',
      activeCard: 'bg-rose-50/90 dark:bg-rose-500/15 border-rose-300 dark:border-rose-500/40 text-rose-900 dark:text-rose-300 shadow-sm shadow-rose-500/10'
    },
    { 
      id: 'results', 
      label: 'Results', 
      icon: Award,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200/80 dark:border-emerald-800/60',
      activeCard: 'bg-emerald-50/90 dark:bg-emerald-500/15 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300 shadow-sm shadow-emerald-500/10'
    },
    { 
      id: 'answer-key', 
      label: 'Answer Key', 
      icon: CheckSquare,
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200/80 dark:border-purple-800/60',
      activeCard: 'bg-purple-50/90 dark:bg-purple-500/15 border-purple-300 dark:border-purple-500/40 text-purple-900 dark:text-purple-300 shadow-sm shadow-purple-500/10'
    },
    { 
      id: 'syllabus', 
      label: 'Syllabus', 
      icon: BookOpen,
      iconColor: 'text-sky-600 dark:text-sky-400',
      iconBg: 'bg-sky-50 dark:bg-sky-950/50 border-sky-200/80 dark:border-sky-800/60',
      activeCard: 'bg-sky-50/90 dark:bg-sky-500/15 border-sky-300 dark:border-sky-500/40 text-sky-900 dark:text-sky-300 shadow-sm shadow-sky-500/10'
    },
    { 
      id: 'admission', 
      label: 'Admission', 
      icon: GraduationCap,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200/80 dark:border-indigo-800/60',
      activeCard: 'bg-indigo-50/90 dark:bg-indigo-500/15 border-indigo-300 dark:border-indigo-500/40 text-indigo-900 dark:text-indigo-300 shadow-sm shadow-indigo-500/10'
    },
    { 
      id: 'history', 
      label: 'Recent', 
      icon: History,
      iconColor: 'text-orange-600 dark:text-orange-400',
      iconBg: 'bg-orange-50 dark:bg-orange-950/50 border-orange-200/80 dark:border-orange-800/60',
      activeCard: 'bg-orange-50/90 dark:bg-orange-500/15 border-orange-300 dark:border-orange-500/40 text-orange-900 dark:text-orange-300 shadow-sm shadow-orange-500/10'
    },
  ];

  return (
    <>
      <header className="bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 w-full shadow-sm transition-colors duration-300">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12 items-center">
          
          {/* Left Side: All Options Hamburger Button + FastArc Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.90, rotate: -6 }}
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400 transition-all focus:outline-none cursor-pointer flex flex-col justify-center items-center gap-[3.5px] border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-amber-400/50 group overflow-hidden active:shadow-inner"
              title="All Options & Categories Menu"
              aria-label="Open Navigation Drawer"
            >
              {/* 3-bar animated Hamburger Lines */}
              <motion.span 
                className="w-4 sm:w-5 h-[2px] bg-slate-700 dark:bg-slate-200 group-hover:bg-amber-600 dark:group-hover:bg-amber-400 rounded-full transition-all duration-200 group-hover:w-5" 
              />
              <motion.span 
                className="w-3 sm:w-3.5 h-[2px] bg-slate-700 dark:bg-slate-200 group-hover:bg-amber-600 dark:group-hover:bg-amber-400 rounded-full transition-all duration-200 self-start ml-0.5 group-hover:w-5 group-hover:ml-0" 
              />
              <motion.span 
                className="w-4 sm:w-5 h-[2px] bg-slate-700 dark:bg-slate-200 group-hover:bg-amber-600 dark:group-hover:bg-amber-400 rounded-full transition-all duration-200 group-hover:w-5" 
              />
            </motion.button>

            <a href="#" className="flex items-center space-x-2 group" onClick={(e) => handleNavClick(e, 'home')}>
              <div className="w-9 h-9 rounded-full p-0.5 bg-black border-2 border-amber-500/80 shadow-md flex items-center justify-center overflow-hidden shrink-0 transform group-hover:scale-105 transition-transform duration-200">
                <img 
                  src={siteLogo} 
                  alt="FastArc Logo" 
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/d/1IE6MQ8EUwyKmGeXnpLTXx7d5HBLJiKb4";
                  }}
                />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Fast<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-400 dark:via-yellow-400 dark:to-amber-300">Arc</span>
                </h1>
                <p className="text-[9px] text-amber-700 dark:text-amber-400/80 font-extrabold tracking-widest uppercase mt-0.5">Govt Jobs Portal</p>
              </div>
            </a>
          </div>
          
          <nav className="hidden md:flex space-x-6 text-sm font-semibold items-center">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href="#"
                onClick={(e) => handleNavClick(e, link.id)}
                className={`transition-colors font-bold ${
                  activeTab === link.id
                    ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 pb-0.5'
                    : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
              >
                {link.label}
              </a>
            ))}
            
            <div className="relative flex items-center group" ref={moreRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="flex items-center text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors focus:outline-none outline-none font-bold"
              >
                More <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-2xl py-2 z-50 flex-col transition-all duration-200 origin-top-left ${isMoreOpen ? 'opacity-100 scale-100 flex' : 'opacity-0 scale-95 hidden pointer-events-none'}`}
              >
                <button onClick={() => { setIsMoreOpen(false); onInfoClick('about'); }} className="text-left w-full px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-white font-bold text-xs">About Us</button>
                <button onClick={() => { setIsMoreOpen(false); onInfoClick('privacy'); }} className="text-left w-full px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-white font-bold text-xs flex items-center justify-between">
                  <span>Privacy Policy</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-500 font-black px-1.5 py-0.5 rounded">AdSense</span>
                </button>
                <button onClick={() => { setIsMoreOpen(false); onInfoClick('disclaimer'); }} className="text-left w-full px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-white font-bold text-xs">Disclaimer</button>
                <button onClick={() => { setIsMoreOpen(false); onInfoClick('terms'); }} className="text-left w-full px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-white font-bold text-xs">Terms & Conditions</button>
                <button onClick={() => { setIsMoreOpen(false); onInfoClick('contact'); }} className="text-left w-full px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-white font-bold text-xs">Contact & Grievance</button>
                {isSuperAdmin && onOpenSuperAdminModal && (
                  <button 
                    onClick={() => { setIsMoreOpen(false); onOpenSuperAdminModal('websiteControl'); }} 
                    className="text-left w-full px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-2 border-t border-slate-100 dark:border-slate-800"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Website Control & Settings</span>
                  </button>
                )}
              </div>
            </div>

            {isSuperAdmin && (
              <div className="relative flex items-center ml-2" ref={adminRef}>
                <button
                  onClick={() => setIsDesktopAdminOpen(!isDesktopAdminOpen)}
                  className="flex items-center px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all font-bold text-xs focus:outline-none"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                  Admin
                  <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${isDesktopAdminOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Desktop Super Admin Dropdown Mega-Menu */}
                <div 
                  className={`absolute top-full right-0 mt-2 w-72 bg-[#070d18] border border-amber-500/30 rounded-xl shadow-2xl z-50 flex-col transition-all duration-200 origin-top-right ${isDesktopAdminOpen ? 'opacity-100 scale-100 flex' : 'opacity-0 scale-95 hidden pointer-events-none'}`}
                >
                  <div className="px-4 py-2 border-b border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Super Admin</span>
                    <span className="text-[8px] bg-amber-400/20 text-amber-400 font-bold px-1.5 py-0.5 rounded uppercase">{SUPER_ADMIN_MODULES.length} PANELS</span>
                  </div>
                  <div className="p-1.5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {Object.entries(
                      SUPER_ADMIN_MODULES.reduce((acc, mod) => {
                        if (!acc[mod.category]) acc[mod.category] = { label: mod.categoryLabel, items: [] };
                        acc[mod.category].items.push(mod);
                        return acc;
                      }, {} as Record<string, { label: string, items: typeof SUPER_ADMIN_MODULES }>)
                    ).map(([category, { label, items }]) => {
                      const isOpen = expandedCategories[category];
                      return (
                      <div key={category} className="mb-2 last:mb-0">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
                          }}
                          className="w-full px-2.5 py-1 flex items-center justify-between text-[9px] font-black text-slate-500 hover:text-slate-400 uppercase tracking-widest cursor-pointer group"
                        >
                          <span>{label}</span>
                          <div className="p-0.5 rounded bg-slate-800/50 group-hover:bg-slate-700 transition-colors">
                            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                        {isOpen && (
                          <div className="mt-1 animate-in slide-in-from-top-1 fade-in duration-200">
                            {items.map((mod) => {
                              const IconComp = mod.icon;
                              return (
                                <button
                                  key={mod.id}
                                  onClick={() => { onOpenSuperAdminModal?.(mod.id); setIsDesktopAdminOpen(false); }}
                                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-amber-300 hover:bg-white/5 transition-all flex items-center group/item"
                                >
                                  <IconComp className="w-3.5 h-3.5 mr-2 text-amber-400/70 group-hover/item:text-amber-400 transition-colors" />
                                  <span className="truncate flex-1">{mod.label}</span>
                                  {mod.tag && (
                                    <span className="text-[8px] bg-amber-500/10 text-amber-300/80 font-bold px-1 rounded ml-1 shrink-0">{mod.tag}</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )})}
                  </div>
                </div>
              </div>
            )}
          </nav>

          <div className="flex items-center space-x-2">
            <button 
              onClick={onToggleDarkMode} 
              className="p-2 text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all focus:outline-none cursor-pointer" 
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              )}
            </button>
            
            {/* Official Social Media Channels with Original Logos (Telegram & WhatsApp) */}
            {(() => {
              const activeSocials = (socialLinks?.filter(l => l.enabled && l.platform !== 'youtube')) || [
                { id: 'tg', platform: 'telegram' as const, title: 'Telegram Channel', url: 'https://t.me/fastarcgovtofficial' },
                { id: 'wa', platform: 'whatsapp' as const, title: 'WhatsApp Channel', url: 'https://whatsapp.com/channel/fastarcgovtofficial' }
              ];
              return (
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  {activeSocials.slice(0, 2).map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 active:scale-95 transition-transform flex items-center justify-center p-0.5 rounded-full"
                      title={`${item.title} - Official Channel`}
                    >
                      <OfficialSocialLogo platform={item.platform} className="w-[26px] h-[26px] drop-shadow-sm" />
                    </a>
                  ))}
                </div>
              );
            })()}
            
            {/* The right-most flush Admin Login/Status Button */}
            <div className="flex items-center space-x-0 ml-2 sm:ml-4 -mr-4 sm:-mr-6 lg:-mr-8 h-12">
              {isLoggedIn ? (
                <>
                  {isSuperAdmin && onOpenSuperAdminModal && (
                    <>
                      {/* 3-Dot (⋮) More Options Menu Button */}
                      <div className="relative h-full" ref={header3DotRef}>
                        <button
                          onClick={() => setIsHeader3DotOpen(!isHeader3DotOpen)}
                          className={`bg-[#1e1e48] hover:bg-blue-950 text-amber-400 h-full px-2.5 sm:px-3.5 flex items-center justify-center transition-colors border-l border-white/10 cursor-pointer ${
                            isHeader3DotOpen ? 'bg-blue-950 text-amber-300 ring-1 ring-amber-400/50' : ''
                          }`}
                          title="Super Admin 3-Dot Menu (Website Control, Colors, Columns)"
                          aria-label="3-Dot Menu"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* 3-Dot Dropdown Menu */}
                        {isHeader3DotOpen && (
                          <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-slate-900 border-2 border-amber-500/60 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
                            {/* Header */}
                            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-1 rounded-lg bg-amber-500 text-slate-950 font-black">
                                  <MoreVertical className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-xs font-black text-white uppercase tracking-wider">3-Dot Menu Options</div>
                                  <div className="text-[10px] text-amber-400 font-medium">Quick Access & Customizers</div>
                                </div>
                              </div>
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                                3-DOTS
                              </span>
                            </div>

                            {/* Dropdown Options List */}
                            <div className="p-2 space-y-1.5">
                              {/* 1. Website Control & Settings (Moved here) */}
                              <button
                                onClick={() => {
                                  setIsHeader3DotOpen(false);
                                  onOpenSuperAdminModal('websiteControl');
                                }}
                                className="w-full flex items-center space-x-3 p-2.5 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/70 border border-indigo-500/40 text-left transition-all group cursor-pointer"
                              >
                                <div className="p-2 rounded-lg bg-indigo-600 text-white group-hover:scale-105 transition-transform shadow-md shrink-0">
                                  <SlidersHorizontal className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-black text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                                    <span>Website Control</span>
                                    <span className="text-[8px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.2 rounded font-bold uppercase">Moved here</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">Logo, Layout, Sections, Header & Footer</div>
                                </div>
                              </button>

                              {/* 2. Theme & Colors Customizer */}
                              <button
                                onClick={() => {
                                  setIsHeader3DotOpen(false);
                                  onOpenSuperAdminModal('colors');
                                }}
                                className="w-full flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800/80 text-left transition-all group cursor-pointer"
                              >
                                <div className="p-2 rounded-lg bg-pink-600/20 text-pink-400 group-hover:bg-pink-600 group-hover:text-white transition-all shrink-0">
                                  <Palette className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                                    Theme & Colors Customizer
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">Accent colors, header & cards styling</div>
                                </div>
                              </button>

                              {/* 3. Column Titles & Visibility Editor */}
                              <button
                                onClick={() => {
                                  setIsHeader3DotOpen(false);
                                  onOpenSuperAdminModal('columns');
                                }}
                                className="w-full flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800/80 text-left transition-all group cursor-pointer"
                              >
                                <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                                  <Type className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                                    Column Titles & Visibility
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">Rename columns, rearrange & show/hide</div>
                                </div>
                              </button>

                              {/* 4. Super Admin Control Center */}
                              <button
                                onClick={() => {
                                  setIsHeader3DotOpen(false);
                                  onOpenSuperAdminModal('analytics');
                                }}
                                className="w-full flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800/80 text-left transition-all group cursor-pointer"
                              >
                                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shrink-0">
                                  <ShieldCheck className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                                    Super Admin Control Center
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">Full dashboard with all 30+ panels</div>
                                </div>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onOpenSuperAdminModal('analytics')}
                        className="bg-[#1e1e48] hover:bg-blue-950 text-amber-400 h-full px-3 sm:px-4 flex items-center justify-center transition-colors border-l border-white/10"
                        title="Super Admin Control Center"
                      >
                        <ShieldCheck className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {employeeName && !isSuperAdmin && (
                    <div className="bg-[#1e1e48] text-amber-400 h-full px-3 sm:px-4 flex items-center justify-center transition-colors border-l border-white/10 text-xs font-bold">
                      <span className="max-w-[80px] truncate">{employeeName}</span>
                    </div>
                  )}
                  <button 
                    onClick={onAdminLoginClick} 
                    className="bg-[#1e1e48] hover:bg-blue-950 text-amber-400 h-full px-3 flex items-center justify-center transition-colors border-l border-white/10"
                    title="Add Job"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  </button>
                  <button 
                    onClick={onLogout} 
                    className="bg-rose-950 hover:bg-rose-900 text-rose-400 h-full px-3 sm:px-4 rounded-l-2xl flex items-center justify-center transition-colors border-l border-white/10"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={onAdminLoginClick}
                  className="bg-[#1e1e48] dark:bg-slate-800 hover:bg-[#2a2a5c] dark:hover:bg-slate-700 text-amber-400 h-full px-4 sm:px-5 lg:px-6 rounded-l-2xl flex items-center justify-center transition-colors"
                  title="Admin Login"
                >
                  <ShieldCheck className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>

      {/* Slide-out Navigation Drawer Menu (All Options Panel) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsDrawerOpen(false)} 
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" 
            />

            {/* Drawer Sidebar Panel */}
            <motion.div 
              initial={{ x: '-100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-64 sm:w-72 max-w-[75vw] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 h-full shadow-2xl border-r border-slate-200 dark:border-slate-800 flex flex-col z-10 overflow-y-auto"
            >
              
              {/* Top Official India Tricolor Line */}
              <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-white to-emerald-600 shrink-0 sticky top-0 z-20" />

              {/* Drawer Header */}
              <div className="px-3.5 py-2.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-between shadow-sm dark:shadow-md sticky top-1 z-10 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full p-0.5 bg-black border-2 border-amber-500/80 shadow-md flex items-center justify-center overflow-hidden shrink-0">
                    <img 
                      src={siteLogo} 
                      alt="FastArc Logo" 
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/d/1IE6MQ8EUwyKmGeXnpLTXx7d5HBLJiKb4";
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
                      Fast<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-400 dark:via-yellow-400 dark:to-amber-300">Arc</span>
                    </h2>
                    <p className="text-[9px] text-amber-700 dark:text-amber-400/80 font-extrabold tracking-widest uppercase mt-0.5">Govt Jobs Portal</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer hover:scale-110 active:scale-95"
                  title="Close Drawer"
                  aria-label="Close Drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            {/* Drawer Navigation Content */}
            <div className="p-3 space-y-5 flex-1 custom-scrollbar">

              {/* SECTION 1: Super Admin Control Options (for Super Admin) */}
              {isSuperAdmin && (
                <div className="bg-gradient-to-br from-slate-900 to-[#070d18] p-2.5 rounded-xl text-white shadow-lg border border-amber-500/30 flex flex-col gap-2">
                  <button 
                    onClick={() => setIsSuperAdminMenuExpanded(!isSuperAdminMenuExpanded)}
                    className="w-full flex items-center justify-between pb-1.5 border-b border-slate-800/60 cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Super Admin
                      </h3>
                      <span className="text-[8px] bg-amber-400/20 text-amber-400 font-bold px-1.5 py-0.5 rounded uppercase">
                        {SUPER_ADMIN_MODULES.length} PANELS
                      </span>
                    </div>
                    <div className={`p-1 rounded-md bg-slate-800 transition-colors group-hover:bg-slate-700 ${isSuperAdminMenuExpanded ? 'text-amber-400' : 'text-slate-400'}`}>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSuperAdminMenuExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  
                  {isSuperAdminMenuExpanded && (
                    <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      {Object.entries(
                        SUPER_ADMIN_MODULES.reduce((acc, mod) => {
                          if (!acc[mod.category]) acc[mod.category] = { label: mod.categoryLabel, items: [] };
                          acc[mod.category].items.push(mod);
                          return acc;
                        }, {} as Record<string, { label: string, items: typeof SUPER_ADMIN_MODULES }>)
                      ).map(([category, { label, items }]) => {
                        const isOpen = expandedCategories[category];
                        return (
                        <div key={category} className="bg-slate-900/60 rounded-lg p-1">
                          <button 
                            onClick={() => setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))}
                            className="w-full px-2 py-1 flex items-center justify-between text-[9px] font-black text-slate-500 hover:text-slate-300 uppercase tracking-widest cursor-pointer group"
                          >
                            <span>{label}</span>
                            <div className="p-0.5 rounded bg-slate-800 group-hover:bg-slate-700 transition-colors">
                              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </div>
                          </button>
                          {isOpen && (
                            <div className="flex flex-col gap-0.5 mt-1 animate-in slide-in-from-top-1 fade-in duration-200">
                              {items.map((mod) => {
                                const IconComp = mod.icon;
                                return (
                                  <button
                                    key={mod.id}
                                    onClick={() => { setIsDrawerOpen(false); onOpenSuperAdminModal?.(mod.id); }}
                                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[11px] font-bold hover:bg-slate-800/80 text-slate-300 hover:text-amber-300 transition-all cursor-pointer group"
                                  >
                                    <span className="flex items-center gap-2 truncate">
                                      <IconComp className="w-3 h-3 text-amber-500/70 group-hover:text-amber-400 group-hover:scale-110 transition-all shrink-0" />
                                      <span className="truncate">{mod.shortLabel}</span>
                                    </span>
                                    {mod.tag && (
                                      <span className="text-[7px] bg-amber-500/10 text-amber-300/80 font-bold px-1 rounded ml-1 shrink-0">
                                        {mod.tag}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )})}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 2: Core Portal Sections (2-Column Grid) */}
              <div>
                <button 
                  onClick={() => setExpandedSidebarSections(prev => ({ ...prev, portal: !prev.portal }))}
                  className="w-full text-left flex items-center justify-between mb-2 px-1 cursor-pointer group"
                >
                  <h3 className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Portal Sections
                  </h3>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${expandedSidebarSections.portal ? 'rotate-180' : ''}`} />
                </button>
                {expandedSidebarSections.portal && (
                  <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-top-1 fade-in duration-200">
                    {navLinks.map((link) => {
                      const IconComp = link.icon;
                      const isActive = activeTab === link.id;
                      return (
                        <button
                          key={link.id}
                          onClick={(e) => handleNavClick(e as any, link.id)}
                          className={`flex flex-col items-start justify-center p-2.5 rounded-xl transition-all cursor-pointer border group ${
                            isActive 
                              ? `${link.activeCard}`
                              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-xs'
                          }`}
                        >
                          <div className={`p-2 rounded-xl mb-1.5 transition-transform group-hover:scale-105 border ${link.iconBg}`}>
                            <IconComp className={`w-4 h-4 ${link.iconColor}`} />
                          </div>
                          <span className={`text-[11px] tracking-tight truncate w-full text-left ${isActive ? 'font-black' : 'font-bold text-slate-700 dark:text-slate-200'}`}>
                            {link.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION 3: Community & Social Links (Compact Pills) */}
              <div>
                <button 
                  onClick={() => setExpandedSidebarSections(prev => ({ ...prev, connect: !prev.connect }))}
                  className="w-full text-left flex items-center justify-between mb-2 px-1 cursor-pointer group"
                >
                  <h3 className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    <Send className="w-3 h-3 text-sky-500" /> Connect
                  </h3>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${expandedSidebarSections.connect ? 'rotate-180' : ''}`} />
                </button>
                {expandedSidebarSections.connect && (
                  <div className="grid grid-cols-2 gap-1.5 animate-in slide-in-from-top-1 fade-in duration-200">
                    {(socialLinks?.filter(l => l.enabled) || [
                      { id: 'tg', platform: 'telegram' as const, title: 'Telegram Channel', url: 'https://t.me/fastarcgovtofficial' },
                      { id: 'wa', platform: 'whatsapp' as const, title: 'WhatsApp Alerts', url: 'https://whatsapp.com/channel/fastarcgovtofficial' }
                    ]).map((item) => (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 font-bold text-[10px] transition-all shadow-sm hover:shadow-md"
                      >
                        <OfficialSocialLogo platform={item.platform} className="w-4 h-4 shrink-0 drop-shadow-sm" />
                        <span className="truncate leading-tight">{item.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 4: Information & Help Pages (Compact List) */}
              <div>
                <button 
                  onClick={() => setExpandedSidebarSections(prev => ({ ...prev, pages: !prev.pages }))}
                  className="w-full text-left flex items-center justify-between mb-2 px-1 cursor-pointer group"
                >
                  <h3 className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    <Info className="w-3 h-3 text-indigo-500" /> Pages & Info
                  </h3>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${expandedSidebarSections.pages ? 'rotate-180' : ''}`} />
                </button>
                {expandedSidebarSections.pages && (
                  <div className="grid grid-cols-2 gap-1 bg-slate-50 dark:bg-slate-800/30 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800/50 animate-in slide-in-from-top-1 fade-in duration-200">
                  <button 
                    onClick={() => { setIsDrawerOpen(false); onInfoClick('about'); }}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors text-[10px] font-bold cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" /> <span className="truncate">About Us</span>
                  </button>
                  <button 
                    onClick={() => { setIsDrawerOpen(false); onInfoClick('privacy'); }}
                    className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors text-[10px] font-bold cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Shield className="w-3 h-3" /> <span className="truncate">Privacy</span>
                    </span>
                    <span className="text-[7px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1 py-0.5 rounded font-black uppercase ml-1 shrink-0">AdSense</span>
                  </button>
                  <button 
                    onClick={() => { setIsDrawerOpen(false); onInfoClick('disclaimer'); }}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors text-[10px] font-bold cursor-pointer"
                  >
                    <AlertCircle className="w-3 h-3" /> <span className="truncate">Disclaimer</span>
                  </button>
                  <button 
                    onClick={() => { setIsDrawerOpen(false); onInfoClick('terms'); }}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors text-[10px] font-bold cursor-pointer"
                  >
                    <FileText className="w-3 h-3" /> <span className="truncate">Terms</span>
                  </button>
                  <button 
                    onClick={() => { setIsDrawerOpen(false); onInfoClick('contact'); }}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors text-[10px] font-bold cursor-pointer col-span-2"
                  >
                    <Phone className="w-3 h-3" /> <span className="truncate">Contact Support & Grievance</span>
                  </button>
                </div>
                )}
              </div>

              {/* SECTION: Theme Mode Selection (Light, Dark, System) */}
              <div className="pt-2 flex justify-center pb-4">
                <div className="w-full bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSetThemeMode) onSetThemeMode('light');
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        themeMode === 'light'
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <Sun className={`w-3.5 h-3.5 ${themeMode === 'light' ? 'text-amber-500' : ''}`} />
                      <span>Light</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (onSetThemeMode) onSetThemeMode('dark');
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        themeMode === 'dark'
                          ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700'
                          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <Moon className={`w-3.5 h-3.5 ${themeMode === 'dark' ? 'text-indigo-400' : ''}`} />
                      <span>Dark</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (onSetThemeMode) onSetThemeMode('system');
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        themeMode === 'system'
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-400 shadow-sm border border-amber-200 dark:border-amber-800/50'
                          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>System</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Drawer Footer Admin Quick Portal Access */}
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 sticky bottom-0 flex justify-center">
              {isLoggedIn ? (
                <button
                  onClick={() => { setIsDrawerOpen(false); onLogout(); }}
                  className="group relative flex items-center bg-rose-950/80 hover:bg-rose-900/90 text-rose-400 border border-rose-800/80 hover:border-rose-500/80 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer hover:shadow-rose-500/20 active:scale-95"
                  title="Click to Logout"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                  <span className="max-w-0 group-hover:max-w-[80px] opacity-0 group-hover:opacity-100 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out text-rose-400 font-extrabold text-xs group-hover:ml-1.5">
                    Logout
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => { setIsDrawerOpen(false); onAdminLoginClick(); }}
                  className="p-2 text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 bg-transparent transition-all cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95"
                  title="Staff / Admin Login"
                >
                  <ShieldCheck className="w-6 h-6" />
                </button>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </>
);
};
