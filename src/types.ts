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

export interface PostWiseVacancy {
  postName: string;
  total?: string | number;
  eligibility?: string;
  general?: string | number;
  obc?: string | number;
  ews?: string | number;
  sc?: string | number;
  st?: string | number;
}

export interface SubjectItem {
  sno: number | string;
  name: string;
  code?: string;
  eligibility?: string;
}

export interface JobAlert {
  id: string;
  title: string;
  slug?: string;
  category: JobCategory;
  postDate: string; // e.g. "20-05-2026"
  isNew: boolean;
  isExpired?: boolean;
  state: string;
  orgName?: string;
  advtNo?: string;
  postName?: string;
  totalVacancies?: string | number;
  shortInfo?: string;
  ageLimit?: string | {
    min?: string | number;
    max?: string | number;
    asOn?: string;
    relaxation?: string;
    details?: string;
  };
  eligibility?: string;
  qualifications?: string[];
  postWiseVacancies?: PostWiseVacancy[];
  subjects?: SubjectItem[];
  selectionProcess?: string[];
  salary?: string;
  payScale?: string;
  payLevel?: string;
  howToApply?: string[];
  importantDocuments?: string[];
  importantInstructions?: string[];
  examPattern?: string;
  syllabus?: string;
  officialSource?: string;
  lastUpdated?: string;
  status?: 'Upcoming' | 'Application Open' | 'Last Date Near' | 'Application Closed' | 'Admit Card Released' | 'Result Released' | 'Answer Key Released' | string;
  viewsCount?: number;
  fees?: {
    general?: string;
    obc?: string;
    ews?: string;
    scSt?: string;
    ph?: string;
    female?: string;
    paymentMode?: string;
  };
  dates?: {
    start?: string;
    last?: string;
    feeLast?: string;
    correctionDate?: string;
    examDate?: string;
    admitCardDate?: string;
    resultDate?: string;
    answerKeyDate?: string;
    reExamDate?: string;
    cityAvailableDate?: string;
  };
  links?: {
    apply?: string;
    applyServer2?: string;
    official?: string;
    notification?: string;
    admitCard?: string;
    admitCardNotice?: string;
    result?: string;
    resultServer2?: string;
    resultNotice?: string;
    cutoff?: string;
    answerKey?: string;
    answerKeyNotice?: string;
    examCity?: string;
    syllabus?: string;
    videoHindi?: string;
    extendedNotice?: string;
    telegram?: string;
    whatsapp?: string;
    tools?: string;
  };
}

export interface ScraperSource {
  id: string;
  name: string;
  url: string;
  officialUrl?: string;
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
  | 'categorySeo'
  | 'sitemap'
  | 'social' 
  | 'earnings'
  | 'site' 
  | 'versions' 
  | 'database' 
  | 'subscribers'
  | 'emailNotifications'
  | 'employees' 
  | 'autofeed' 
  | 'npm'
  | 'pages'
  | 'apiIntegrations'
  | 'activityLogs'
  | 'helpdesk'
  | 'autoBroadcast'
  | 'adsManager'
  | 'jobsManager';

export interface EmailNotificationConfig {
  autoSendOnPublish: boolean;
  provider: 'built-in' | 'smtp' | 'resend' | 'sendgrid' | 'webhook';
  fromName: string;
  fromEmail: string;
  replyToEmail?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
  apiKey?: string;
  webhookUrl?: string;
  subjectTemplate: string;
  preheaderText: string;
  bannerTitle: string;
  callToActionText: string;
  footerNote: string;
  sendCategories: string[];
  sendDelaySeconds?: number;
  includePdfLink: boolean;
  includeApplyLink: boolean;
  updatedAt?: string;
}

export interface NotificationDispatchLog {
  id: string;
  jobId: string;
  jobTitle: string;
  category: string;
  sentAt: string;
  recipientCount: number;
  provider: string;
  status: 'delivered' | 'processing' | 'partial' | 'failed';
  subject: string;
  details?: string;
  sampleRecipients?: string[];
}

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

export interface SyncLogEntry {
  id: number | string;
  time: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'system';
  sourceName?: string;
  sourceUrl?: string;
  durationMs?: number;
  statusCode?: number;
  errorDetails?: string;
  postsCount?: number;
  endpoint?: string;
}

