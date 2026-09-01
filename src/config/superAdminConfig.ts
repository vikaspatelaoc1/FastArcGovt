import React from 'react';
import { 
  BarChart3, 
  Megaphone, 
  Share2, 
  DollarSign,
  Settings, 
  RefreshCw, 
  Database, 
  Users, 
  UserPlus, 
  Zap, 
  Package,
  Palette,
  Type,
  Globe,
  SlidersHorizontal,
  Mail,
  Bell,
  LucideIcon 
} from 'lucide-react';
import { SuperAdminTabType } from '../types';

export interface SuperAdminModuleConfig {
  id: SuperAdminTabType;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  category: 'core' | 'content' | 'users' | 'system' | 'tools';
  categoryLabel: string;
  color: string;
  hoverBg: string;
  badge?: (data: {
    jobsCount?: number;
    subscribersCount?: number;
    employeesCount?: number;
    socialCount?: number;
    syncActive?: boolean;
    earningsAmount?: string;
  }) => string | number | undefined;
  tag?: string;
}

export const SUPER_ADMIN_MODULES: SuperAdminModuleConfig[] = [
  {
    id: 'websiteControl',
    label: 'Website Control & Master Customizer',
    shortLabel: 'Website Control',
    description: 'Centralized control for Colors, Layout, Sections, Fonts, Header, Footer, Banners & Live Preview without editing code',
    icon: SlidersHorizontal,
    category: 'core',
    categoryLabel: 'Core Operations',
    color: 'text-indigo-400',
    hoverBg: 'hover:bg-indigo-950/40',
    tag: 'MASTER-CONTROL'
  },
  {
    id: 'analytics',
    label: 'Portal Analytics & Overview',
    shortLabel: 'Analytics',
    description: 'Real-time visitor trends, category counts & job metrics',
    icon: BarChart3,
    category: 'core',
    categoryLabel: 'Core Operations',
    color: 'text-amber-400',
    hoverBg: 'hover:bg-amber-950/40',
    badge: (data) => data.jobsCount ? `${data.jobsCount} Jobs` : undefined
  },
  {
    id: 'earnings',
    label: 'AdSense & Affiliate Earnings',
    shortLabel: 'Revenue & Earnings',
    description: 'Track daily Google AdSense, affiliate link clicks & sponsor payouts',
    icon: DollarSign,
    category: 'core',
    categoryLabel: 'Core Operations',
    color: 'text-emerald-400',
    hoverBg: 'hover:bg-emerald-950/40',
    tag: 'REVENUE',
    badge: () => '₹1.48L'
  },
  {
    id: 'marquee',
    label: 'Marquee Flash Ticker',
    shortLabel: 'Marquee Ticker',
    description: 'Edit live breaking news ticker flashing at the top of portal',
    icon: Megaphone,
    category: 'content',
    categoryLabel: 'Content & Updates',
    color: 'text-amber-400',
    hoverBg: 'hover:bg-amber-950/40'
  },
  {
    id: 'colors',
    label: 'Live Theme & Color Customizer',
    shortLabel: 'Theme & Colors',
    description: 'Customize any section color, header, marquee, buttons, category boxes & cards',
    icon: Palette,
    category: 'core',
    categoryLabel: 'Core Operations',
    color: 'text-pink-400',
    hoverBg: 'hover:bg-pink-950/40',
    tag: 'LIVE-EDIT'
  },
  {
    id: 'columns',
    label: 'Column Text & Title Editor',
    shortLabel: 'Column & Titles',
    description: 'Edit column heading titles, Hindi names, taglines, icons, and badges',
    icon: Type,
    category: 'content',
    categoryLabel: 'Content & Updates',
    color: 'text-blue-400',
    hoverBg: 'hover:bg-blue-950/40',
    tag: 'CUSTOMIZE'
  },
  {
    id: 'seo',
    label: 'Global Homepage SEO & Meta Tags',
    shortLabel: 'Homepage SEO',
    description: 'Edit homepage meta title, meta description, keywords & Google search preview',
    icon: Globe,
    category: 'core',
    categoryLabel: 'Core Operations',
    color: 'text-emerald-400',
    hoverBg: 'hover:bg-emerald-950/40',
    tag: 'GOOGLE-SEO'
  },
  {
    id: 'categorySeo',
    label: 'Category SEO & Meta Tags Manager',
    shortLabel: 'Category SEO',
    description: 'Bulk edit Meta Description, Keywords, Title & Open Graph social cards for each job category',
    icon: Globe,
    category: 'core',
    categoryLabel: 'Core Operations',
    color: 'text-teal-400',
    hoverBg: 'hover:bg-teal-950/40',
    tag: 'BULK-SEO'
  },
  {
    id: 'social',
    label: 'Social Media & Official Channels',
    shortLabel: 'Social Media Links',
    description: 'Manage Telegram, WhatsApp, YouTube, Instagram, X & Facebook links',
    icon: Share2,
    category: 'content',
    categoryLabel: 'Content & Updates',
    color: 'text-sky-400',
    hoverBg: 'hover:bg-sky-950/40',
    tag: 'DYNAMIC',
    badge: (data) => data.socialCount !== undefined ? `${data.socialCount} Channels` : undefined
  },
  {
    id: 'versions',
    label: 'Version Control & System Editor',
    shortLabel: 'Version Control',
    description: 'Code snapshots, version rollbacks & system restore points',
    icon: RefreshCw,
    category: 'system',
    categoryLabel: 'System & Security',
    color: 'text-emerald-400',
    hoverBg: 'hover:bg-emerald-950/40',
    tag: 'RESTORE'
  },
  {
    id: 'site',
    label: 'Site & Portal Configuration',
    shortLabel: 'Site Config',
    description: 'Portal branding, maintenance mode, SEO & global parameters',
    icon: Settings,
    category: 'core',
    categoryLabel: 'Core Operations',
    color: 'text-indigo-400',
    hoverBg: 'hover:bg-indigo-950/40'
  },
  {
    id: 'database',
    label: 'Database Operations & Backups',
    shortLabel: 'Database & Backup',
    description: 'Export JSON backups, import data & reset Firestore schemas',
    icon: Database,
    category: 'system',
    categoryLabel: 'System & Security',
    color: 'text-cyan-400',
    hoverBg: 'hover:bg-cyan-950/40'
  },
  {
    id: 'subscribers',
    label: 'Alert Subscribers & Broadcasts',
    shortLabel: 'Subscribers List',
    description: 'Manage email alert subscribers and trigger instant notifications',
    icon: Users,
    category: 'users',
    categoryLabel: 'Users & Community',
    color: 'text-amber-400',
    hoverBg: 'hover:bg-amber-950/40',
    badge: (data) => data.subscribersCount !== undefined ? `${data.subscribersCount}` : undefined
  },
  {
    id: 'emailNotifications',
    label: 'Automated Email Notifications & Alerts Dispatcher',
    shortLabel: 'Automated Notifications',
    description: 'Auto-dispatch email alerts on new job publish, custom SMTP/API configuration, live email preview & dispatch history',
    icon: Mail,
    category: 'tools',
    categoryLabel: 'Automation Tools',
    color: 'text-rose-400',
    hoverBg: 'hover:bg-rose-950/40',
    tag: 'AUTO-ALERTS',
    badge: (data) => data.subscribersCount !== undefined ? `${data.subscribersCount} Subs` : 'ACTIVE'
  },
  {
    id: 'employees',
    label: 'Staff IDs & Permissions Access',
    shortLabel: 'Staff Management',
    description: 'Create employee accounts, manage passwords & toggle access rules',
    icon: UserPlus,
    category: 'users',
    categoryLabel: 'Users & Community',
    color: 'text-purple-400',
    hoverBg: 'hover:bg-purple-950/40',
    badge: (data) => data.employeesCount !== undefined ? `${data.employeesCount} Staff` : undefined
  },
  {
    id: 'autofeed',
    label: 'Auto-Scraper & REST API Feed',
    shortLabel: 'Auto-Feed Scraper',
    description: 'Automated Python scrapers, RSS ingestion & live government feeds',
    icon: Zap,
    category: 'tools',
    categoryLabel: 'Automation Tools',
    color: 'text-amber-400',
    hoverBg: 'hover:bg-amber-950/40',
    tag: 'AUTO-SYNC',
    badge: (data) => data.syncActive ? 'LIVE' : undefined
  },
  {
    id: 'npm',
    label: 'NPM Registry & Developer Tools',
    shortLabel: 'NPM System',
    description: 'Search packages, inspect Node runtime APIs & calculate pensions',
    icon: Package,
    category: 'tools',
    categoryLabel: 'Automation Tools',
    color: 'text-rose-400',
    hoverBg: 'hover:bg-rose-950/40'
  },
  {
    id: 'pages',
    label: 'Dynamic Pages & CMS Manager',
    shortLabel: 'Pages Manager',
    description: 'Edit About Us, Privacy Policy, Terms, and Disclaimer pages directly',
    icon: Type,
    category: 'content',
    categoryLabel: 'Content & Updates',
    color: 'text-violet-400',
    hoverBg: 'hover:bg-violet-950/40',
    tag: 'NEW'
  },
  {
    id: 'apiIntegrations',
    label: 'API Keys & Analytics Integration',
    shortLabel: 'API Integrations',
    description: 'Configure Google Analytics GA4, Search Console, and Webhook APIs',
    icon: Settings,
    category: 'system',
    categoryLabel: 'System & Security',
    color: 'text-slate-400',
    hoverBg: 'hover:bg-slate-950/40'
  },
  {
    id: 'activityLogs',
    label: 'Audit & Staff Activity Logs',
    shortLabel: 'Activity Logs',
    description: 'Track which employee updated or deleted forms, including timestamps',
    icon: Database,
    category: 'system',
    categoryLabel: 'System & Security',
    color: 'text-teal-400',
    hoverBg: 'hover:bg-teal-950/40'
  },
  {
    id: 'helpdesk',
    label: 'User Queries & Helpdesk Support',
    shortLabel: 'Helpdesk Inbox',
    description: 'View and reply to broken link reports and user feedback messages',
    icon: Users,
    category: 'users',
    categoryLabel: 'Users & Community',
    color: 'text-indigo-400',
    hoverBg: 'hover:bg-indigo-950/40',
    tag: 'TICKETS'
  },
  {
    id: 'autoBroadcast',
    label: 'Social Auto-Broadcaster',
    shortLabel: 'Auto Broadcaster',
    description: 'Push new job alerts directly to Telegram channels & WhatsApp groups',
    icon: Megaphone,
    category: 'tools',
    categoryLabel: 'Automation Tools',
    color: 'text-blue-400',
    hoverBg: 'hover:bg-blue-950/40'
  },
  {
    id: 'adsManager',
    label: 'Advertisement Placement Manager',
    shortLabel: 'Ads Manager',
    description: 'Manage AdSense code snippets for Header, Sidebar, and Content ads',
    icon: DollarSign,
    category: 'core',
    categoryLabel: 'Core Operations',
    color: 'text-green-400',
    hoverBg: 'hover:bg-green-950/40'
  }
];

export const getSuperAdminModuleById = (id: SuperAdminTabType): SuperAdminModuleConfig | undefined => {
  return SUPER_ADMIN_MODULES.find(m => m.id === id);
};
