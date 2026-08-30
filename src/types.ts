export type JobCategory = 'latest-jobs' | 'admit-cards' | 'results' | 'answer-key' | 'syllabus' | 'admission' | 'documents' | 'important';

export interface EmployeePermissions {
  canAddJob: boolean;
  canEditJob: boolean;
  canDeleteJob: boolean;
  canEditTicker: boolean;
  canExportDatabase: boolean;
  canSendBroadcast: boolean;
  canViewAnalytics: boolean;
}

export interface EmployeeUser {
  id: string;
  name: string;
  username: string;
  password: string;
  role: 'employee';
  createdAt: string;
  status: 'active' | 'suspended';
  permissions: EmployeePermissions;
}

export interface DeletedEmployeeLog {
  id: string;
  name: string;
  username: string;
  deletedAt: string;
  deletedBy: string;
}

export interface JobAlert {
  id: string;
  title: string;
  category: JobCategory;
  postDate: string; // e.g. "20-05-2026"
  isNew: boolean;
  isExpired?: boolean;
  state: string;
  shortInfo?: string;
  ageLimit?: string;
  eligibility?: string;
  fees?: {
    general?: string;
    scSt?: string;
  };
  dates?: {
    start?: string;
    last?: string;
  };
  links?: {
    apply?: string;
    official?: string;
    notification?: string;
  };
}

export interface ScraperSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'html_scraper' | 'api';
  defaultCategory: JobCategory;
  state: string;
  enabled: boolean;
  lastScraped?: string;
  itemCount?: number;
  status: 'idle' | 'success' | 'scraping' | 'error';
  errorMessage?: string;
}

export interface ScrapedPost {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  category: JobCategory;
  postDate: string;
  state: string;
  shortInfo?: string;
  dates?: { start?: string; last?: string };
  fees?: { general?: string; scSt?: string };
  links?: { apply?: string; official?: string; notification?: string };
  scrapedAt: string;
  confidenceScore: number;
  status: 'pending' | 'approved' | 'rejected';
}

export type SocialPlatform = 'telegram' | 'whatsapp' | 'youtube' | 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'discord' | 'threads' | 'other';

export type SuperAdminTabType = 
  | 'websiteControl'
  | 'analytics' 
  | 'marquee' 
  | 'colors'
  | 'columns'
  | 'seo'
  | 'social' 
  | 'earnings'
  | 'site' 
  | 'versions' 
  | 'database' 
  | 'subscribers' 
  | 'employees' 
  | 'autofeed' 
  | 'npm'
  | 'pages'
  | 'apiIntegrations'
  | 'activityLogs'
  | 'helpdesk'
  | 'autoBroadcast'
  | 'adsManager';

export interface SocialLinkItem {
  id: string;
  platform: SocialPlatform;
  title: string;
  url: string;
  handle?: string;
  icon?: string;
  isCustom?: boolean;
  badgeText?: string;
  enabled?: boolean;
  order?: number;
  color?: string;
  updatedAt?: string;
}

export interface DynamicPageItem {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  lastUpdated?: string;
  isPublished?: boolean;
  metaDescription?: string;
}

export interface ApiAnalyticsConfig {
  ga4Id?: string;
  telegramBotToken?: string;
  telegramChannelId?: string;
  facebookPixelId?: string;
  whatsappApiKey?: string;
  updatedAt?: string;
}

export interface TicketReply {
  id: string;
  sender: 'user' | 'admin' | 'system';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface HelpdeskTicket {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category?: string;
  issue: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'high' | 'medium' | 'low';
  unread?: boolean;
  time?: string;
  createdAt: string;
  updatedAt?: string;
  replies?: TicketReply[];
}
