import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs, 
  getDoc,
  getDocFromServer,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { JobAlert, EmployeeUser, SocialLinkItem } from '../types';
import { defaultJobsDatabase, defaultSocialLinks } from '../data';
import { ThemeColorConfig } from '../utils/themeColors';


// Connection validation
export async function validateFirestoreConnection() {
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection check timeout')), 3000)
    );
    await Promise.race([
      getDocFromServer(doc(db, 'site_config', 'marquee')),
      timeoutPromise
    ]);
  } catch (error) {
    // Graceful offline fallback - Firestore automatically operates in offline cache mode
    console.info("Firestore connecting or operating in offline cache mode.");
  }
}

// 1. Jobs Realtime Sync
export function subscribeToJobs(
  onUpdate: (jobs: JobAlert[]) => void, 
  onError?: (err: any) => void
) {
  const jobsCol = collection(db, 'jobs');
  
  return onSnapshot(jobsCol, async (snapshot) => {
    try {
      const fetchedJobs: JobAlert[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as JobAlert;
        fetchedJobs.push({
          ...data,
          id: docSnap.id
        });
      });

      // Master catalog starting with default 2016-2026 database
      const masterJobsMap = new Map<string, JobAlert>();
      const titleLookup = new Map<string, string>();

      defaultJobsDatabase.forEach((job) => {
        if (!job || !job.title) return;
        masterJobsMap.set(job.id, job);
        titleLookup.set(job.title.trim().toLowerCase(), job.id);
      });

      // Override / augment with Firestore documents
      fetchedJobs.forEach((job) => {
        if (!job || !job.title) return;
        const normTitle = job.title.trim().toLowerCase();
        const existingIdByTitle = titleLookup.get(normTitle);

        if (existingIdByTitle && existingIdByTitle !== job.id) {
          masterJobsMap.delete(existingIdByTitle);
        }
        masterJobsMap.set(job.id, job);
        titleLookup.set(normTitle, job.id);
      });

      // Process dates for auto-flagging and expiration
      const now = new Date();
      const parseDateString = (dateStr?: string) => {
        if (!dateStr) return null;
        const match = dateStr.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
        if (match) {
          return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
        }
        return null;
      };

      const finalUniqueJobs = Array.from(masterJobsMap.values()).map(job => {
        let isExpired = false;
        let isRecent = false;

        // Flag recent if posted within last 3 days
        if (job.postDate) {
          const postDate = parseDateString(job.postDate);
          if (postDate && !isNaN(postDate.getTime())) {
            const diffTime = now.getTime() - postDate.getTime();
            const diffDays = diffTime / (1000 * 3600 * 24);
            if (diffDays >= 0 && diffDays <= 3) {
              isRecent = true;
            }
          }
        }

        return {
          ...job,
          isExpired,
          isNew: isRecent || Boolean(job.isNew)
        };
      });

      onUpdate(finalUniqueJobs);
    } catch (err) {
      console.error('Error handling jobs snapshot:', err);
      if (onError) onError(err);
    }
  }, (err) => {
    console.error('Firestore jobs subscription error:', err);
    if (onError) onError(err);
  });
}

// Helper to sanitize data for Firestore (remove undefined, replace with safe defaults)
function cleanForFirestore<T>(data: T): T {
  if (data === null || data === undefined) return '' as unknown as T;
  if (typeof data !== 'object') return data;
  if (Array.isArray(data)) {
    return data.map(item => cleanForFirestore(item)) as unknown as T;
  }
  const cleanObj: any = {};
  for (const [key, value] of Object.entries(data as any)) {
    if (value !== undefined) {
      cleanObj[key] = cleanForFirestore(value);
    } else {
      cleanObj[key] = '';
    }
  }
  return cleanObj as T;
}

// 2. Save / Add Job (with Duplicate Prevention)
export async function saveJobToFirestore(job: JobAlert): Promise<void> {
  const initDocRef = doc(db, 'site_config', 'init');
  await setDoc(initDocRef, { initialized: true }, { merge: true });

  const jobsCol = collection(db, 'jobs');
  const snapshot = await getDocs(jobsCol);
  const normTitle = job.title ? job.title.trim().toLowerCase() : '';

  let targetDocId = job.id;

  if (normTitle) {
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as JobAlert;
      if (data.title && data.title.trim().toLowerCase() === normTitle) {
        targetDocId = docSnap.id; // Overwrite existing document ID to prevent duplicates!
      }
    });
  }

  const sanitizedJob = cleanForFirestore({
    ...job,
    id: targetDocId,
    updatedAt: new Date().toISOString()
  });

  const jobRef = doc(db, 'jobs', targetDocId);
  await setDoc(jobRef, sanitizedJob, { merge: true });
}

// 3. Delete Job (Immediate & Permanent)
export async function deleteJobFromFirestore(jobId: string): Promise<void> {
  // Ensure site_config/init is set so if all jobs are deleted, it doesn't re-seed defaults
  const initDocRef = doc(db, 'site_config', 'init');
  await setDoc(initDocRef, { initialized: true }, { merge: true });
  const jobRef = doc(db, 'jobs', jobId);
  await deleteDoc(jobRef);
}

// 4. Reset Jobs to Default
export async function resetJobsInFirestore(): Promise<void> {
  const jobsCol = collection(db, 'jobs');
  const snapshot = await getDocs(jobsCol);
  const batch = writeBatch(db);
  
  snapshot.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  defaultJobsDatabase.forEach((job) => {
    const jobDoc = doc(db, 'jobs', job.id);
    batch.set(jobDoc, job);
  });

  const initDocRef = doc(db, 'site_config', 'init');
  batch.set(initDocRef, { initialized: true, resetAt: new Date().toISOString() });

  await batch.commit();
}

// 5. Bulk Save / Import Jobs (Deduplicated)
export async function bulkSaveJobsToFirestore(jobs: JobAlert[]): Promise<void> {
  const jobsCol = collection(db, 'jobs');
  const snapshot = await getDocs(jobsCol);
  const batch = writeBatch(db);
  
  snapshot.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  const seenTitles = new Set<string>();
  jobs.forEach((job) => {
    if (!job.title) return;
    const norm = job.title.trim().toLowerCase();
    if (!seenTitles.has(norm)) {
      seenTitles.add(norm);
      const jobDoc = doc(db, 'jobs', job.id);
      batch.set(jobDoc, job);
    }
  });

  const initDocRef = doc(db, 'site_config', 'init');
  batch.set(initDocRef, { initialized: true, importedAt: new Date().toISOString() });

  await batch.commit();
}

// 5b. Append or update jobs without wiping existing database (for Scrapers & Live Ingestion - Deduplicated)
export async function appendJobsToFirestore(jobs: JobAlert[]): Promise<void> {
  if (!jobs || jobs.length === 0) return;

  const jobsCol = collection(db, 'jobs');
  const snapshot = await getDocs(jobsCol);

  const existingTitleMap = new Map<string, string>();
  snapshot.forEach((docSnap) => {
    const data = docSnap.data() as JobAlert;
    if (data.title) {
      existingTitleMap.set(data.title.trim().toLowerCase(), docSnap.id);
    }
  });

  const initDocRef = doc(db, 'site_config', 'init');
  await setDoc(initDocRef, { initialized: true }, { merge: true });

  const batchSeenTitles = new Set<string>();
  const itemsToSync: { targetDocId: string; job: JobAlert }[] = [];

  jobs.forEach((job) => {
    if (!job.title) return;
    const norm = job.title.trim().toLowerCase();
    if (batchSeenTitles.has(norm)) return; // Skip duplicates within the batch
    batchSeenTitles.add(norm);

    const targetDocId = existingTitleMap.get(norm) || job.id;
    itemsToSync.push({ targetDocId, job });
  });

  // Execute in chunks of 400 to stay well under Firestore 500 limit
  const CHUNK_SIZE = 400;
  for (let i = 0; i < itemsToSync.length; i += CHUNK_SIZE) {
    const chunk = itemsToSync.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(db);
    chunk.forEach(({ targetDocId, job }) => {
      const jobDoc = doc(db, 'jobs', targetDocId);
      const sanitized = cleanForFirestore({
        ...job,
        id: targetDocId,
        updatedAt: new Date().toISOString()
      });
      batch.set(jobDoc, sanitized, { merge: true });
    });
    await batch.commit();
  }
}

// 6. Marquee Ticker Sync
export function subscribeToMarquee(onUpdate: (text: string) => void) {
  const configRef = doc(db, 'site_config', 'marquee');
  return onSnapshot(configRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.marqueeText) {
        onUpdate(data.marqueeText);
      }
    }
  });
}

export async function saveMarqueeToFirestore(text: string): Promise<void> {
  const configRef = doc(db, 'site_config', 'marquee');
  await setDoc(configRef, {
    marqueeText: text,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

// 6b. Auto-Sync Watcher State Sync
export function subscribeToAutoSync(onUpdate: (isActive: boolean) => void) {
  const configRef = doc(db, 'site_config', 'autoSync');
  return onSnapshot(configRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && typeof data.isActive === 'boolean') {
        onUpdate(data.isActive);
      }
    }
  });
}

export async function saveAutoSyncToFirestore(isActive: boolean): Promise<void> {
  const configRef = doc(db, 'site_config', 'autoSync');
  await setDoc(configRef, {
    isActive,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

// 6c. Theme Colors State Sync
export function subscribeToThemeColors(onUpdate: (colors: ThemeColorConfig) => void) {
  const configRef = doc(db, 'site_config', 'theme_colors');
  return onSnapshot(configRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.colors) {
        onUpdate(data.colors as ThemeColorConfig);
      }
    }
  });
}

export async function saveThemeColorsToFirestore(colors: ThemeColorConfig): Promise<void> {
  const configRef = doc(db, 'site_config', 'theme_colors');
  await setDoc(configRef, {
    colors,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

export interface EarningsConfig {
  adsensePubId: string;
  amazonTag: string;
  testbookPartnerId: string;
  bankName: string;
  accountEnding: string;
  payoutBankName: string;
  payoutAccountEnding: string;
  payoutBeneficiaryName: string;
  payoutThreshold: number;
  payoutNextDate: string;
  payoutMethod: string;
  payoutTaxStatus: string;
  payoutBalanceMode: 'auto' | 'custom';
  payoutCustomBalance: number;
  customEntries: Array<{
    id: string;
    source: string;
    description: string;
    date: string;
    amount: number;
    status: 'Completed' | 'Processing';
  }>;
}

// 6d. Earnings Config State Sync
export function subscribeToEarningsConfig(onUpdate: (config: EarningsConfig) => void) {
  const configRef = doc(db, 'site_config', 'earnings_config');
  return onSnapshot(configRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.config) {
        onUpdate(data.config as EarningsConfig);
      }
    }
  });
}

export async function saveEarningsConfigToFirestore(config: EarningsConfig): Promise<void> {
  const configRef = doc(db, 'site_config', 'earnings_config');
  await setDoc(configRef, {
    config,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

// 6e. Website Backup Sync
export async function saveBackupToFirestore(backupData: any): Promise<void> {
  const backupRef = doc(db, 'site_config', 'website_backup');
  await setDoc(backupRef, {
    backup: JSON.stringify(backupData),
    updatedAt: new Date().toISOString()
  });
}

export async function getBackupFromFirestore(): Promise<any | null> {
  const backupRef = doc(db, 'site_config', 'website_backup');
  const snap = await getDoc(backupRef);
  if (snap.exists()) {
    const data = snap.data();
    if (data.backup) {
      try {
        return JSON.parse(data.backup);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

// 7. Employees Sync
export function subscribeToEmployees(onUpdate: (employees: EmployeeUser[]) => void) {
  const empCol = collection(db, 'employees');
  return onSnapshot(empCol, (snapshot) => {
    if (snapshot.empty) {
      onUpdate([]);
      return;
    }
    const emps: EmployeeUser[] = [];
    snapshot.forEach((docSnap) => {
      emps.push({
        ...(docSnap.data() as EmployeeUser),
        id: docSnap.id
      });
    });
    onUpdate(emps);
  });
}

export async function saveEmployeeToFirestore(employee: EmployeeUser): Promise<void> {
  const empRef = doc(db, 'employees', employee.id);
  await setDoc(empRef, employee, { merge: true });
}

export async function deleteEmployeeFromFirestore(employeeId: string): Promise<void> {
  const empRef = doc(db, 'employees', employeeId);
  await deleteDoc(empRef);
}

// 8. Subscribers Sync
export interface SubscriberRecord {
  id: string;
  email: string;
  category: string;
  date: string;
}

export function subscribeToSubscribers(onUpdate: (subs: SubscriberRecord[]) => void) {
  const subCol = collection(db, 'subscribers');
  return onSnapshot(subCol, async (snapshot) => {
    try {
      const initSubDoc = doc(db, 'site_config', 'subscribers_init');
      const initDoc = await getDoc(initSubDoc);

      if (snapshot.empty && !initDoc.exists()) {
        const initialSubs: SubscriberRecord[] = [
          { id: 'sub-1', email: 'vikas.patel@example.com', category: 'Latest Jobs', date: '11 Aug 2026' },
          { id: 'sub-2', email: 'rahul.kumar@gmail.com', category: 'Admit Card', date: '10 Aug 2026' },
          { id: 'sub-3', email: 'priya.singh@yahoo.com', category: 'Results', date: '09 Aug 2026' },
        ];
        const batch = writeBatch(db);
        initialSubs.forEach((s) => {
          batch.set(doc(db, 'subscribers', s.id), s);
        });
        batch.set(initSubDoc, { initialized: true });
        await batch.commit();
        onUpdate(initialSubs);
        return;
      }

      if (snapshot.empty) {
        onUpdate([]);
        return;
      }

      const subs: SubscriberRecord[] = [];
      snapshot.forEach((docSnap) => {
        subs.push({
          ...(docSnap.data() as SubscriberRecord),
          id: docSnap.id
        });
      });
      onUpdate(subs);
    } catch (err) {
      console.error('Subscribers snapshot error:', err);
    }
  });
}

export async function saveSubscriberToFirestore(sub: SubscriberRecord): Promise<void> {
  const initSubDoc = doc(db, 'site_config', 'subscribers_init');
  await setDoc(initSubDoc, { initialized: true }, { merge: true });
  const subRef = doc(db, 'subscribers', sub.id);
  await setDoc(subRef, {
    ...sub,
    createdAt: new Date().toISOString()
  }, { merge: true });
}

export async function deleteSubscriberFromFirestore(subId: string): Promise<void> {
  const initSubDoc = doc(db, 'site_config', 'subscribers_init');
  await setDoc(initSubDoc, { initialized: true }, { merge: true });
  const subRef = doc(db, 'subscribers', subId);
  await deleteDoc(subRef);
}

// 9. Social Media Links Realtime Sync
export function subscribeToSocialLinks(
  onUpdate: (links: SocialLinkItem[]) => void,
  onError?: (err: any) => void
) {
  const socialDocRef = doc(db, 'site_config', 'social_links');
  return onSnapshot(socialDocRef, async (docSnap) => {
    try {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.links) && data.links.length > 0) {
          onUpdate(data.links);
          return;
        }
      }

      // First time initialization with default links
      await setDoc(socialDocRef, {
        links: defaultSocialLinks,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      onUpdate(defaultSocialLinks);
    } catch (err) {
      console.warn('Social links snapshot warning:', err);
      if (onError) onError(err);
      onUpdate(defaultSocialLinks);
    }
  }, (err) => {
    console.warn('Social links subscription error:', err);
    if (onError) onError(err);
    onUpdate(defaultSocialLinks);
  });
}

export async function saveSocialLinksToFirestore(links: SocialLinkItem[]): Promise<void> {
  const socialDocRef = doc(db, 'site_config', 'social_links');
  await setDoc(socialDocRef, {
    links: links,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}


// 10. Site Logo Sync
export function subscribeToSiteLogo(onUpdate: (logo: string, timestamp?: number) => void) {
  const configRef = doc(db, 'site_config', 'site_logo');
  return onSnapshot(configRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.logoData) {
        onUpdate(data.logoData, data.updatedAt);
      }
    }
  });
}

export async function saveSiteLogoToFirestore(logoData: string): Promise<void> {
  const configRef = doc(db, 'site_config', 'site_logo');
  await setDoc(configRef, {
    logoData: logoData,
    updatedAt: Date.now()
  }, { merge: true });
}

export interface LogoBackup {
  id: string;
  logoData: string;
  timestamp: number;
}

export function subscribeToLogoHistory(onUpdate: (history: LogoBackup[]) => void) {
  const configRef = doc(db, 'site_config', 'logo_history');
  return onSnapshot(configRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && Array.isArray(data.history)) {
        onUpdate(data.history);
      } else {
        onUpdate([]);
      }
    } else {
      onUpdate([]);
    }
  });
}

export async function saveLogoHistoryToFirestore(history: LogoBackup[]): Promise<void> {
  const configRef = doc(db, 'site_config', 'logo_history');
  await setDoc(configRef, {
    history: history,
    updatedAt: Date.now()
  }, { merge: true });
}

// 11. Column Configs Realtime Sync
export function subscribeToColumnConfigs(onUpdate: (configs: any) => void) {
  const colRef = doc(db, 'site_config', 'column_configs');
  return onSnapshot(colRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.configs) {
        onUpdate(data.configs);
      }
    }
  });
}

export async function saveColumnConfigsToFirestore(configs: any): Promise<void> {
  const colRef = doc(db, 'site_config', 'column_configs');
  await setDoc(colRef, {
    configs,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

// 12. Global SEO Config Realtime Sync
export function subscribeToSeoConfig(onUpdate: (config: any) => void) {
  const seoRef = doc(db, 'site_config', 'seo_config');
  return onSnapshot(seoRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.config) {
        onUpdate(data.config);
      }
    }
  });
}

export async function saveSeoConfigToFirestore(config: any): Promise<void> {
  const seoRef = doc(db, 'site_config', 'seo_config');
  await setDoc(seoRef, {
    config,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

// 13. Dynamic Pages & CMS Sync
export function subscribeToDynamicPages(onUpdate: (pages: Record<string, any>) => void) {
  const pagesRef = doc(db, 'site_config', 'dynamic_pages');
  return onSnapshot(pagesRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.pages) {
        onUpdate(data.pages);
      }
    }
  });
}

export async function saveDynamicPagesToFirestore(pages: Record<string, any>): Promise<void> {
  const pagesRef = doc(db, 'site_config', 'dynamic_pages');
  await setDoc(pagesRef, {
    pages,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

// 14. API Analytics Config Sync
export function subscribeToApiConfig(onUpdate: (config: any) => void) {
  const apiRef = doc(db, 'site_config', 'api_config');
  return onSnapshot(apiRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.config) {
        onUpdate(data.config);
      }
    }
  });
}

export async function saveApiConfigToFirestore(config: any): Promise<void> {
  const apiRef = doc(db, 'site_config', 'api_config');
  await setDoc(apiRef, {
    config,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

// 15. Ads Manager Config Sync
export function subscribeToAdsConfig(onUpdate: (ads: any[]) => void) {
  const adsRef = doc(db, 'site_config', 'ads_config');
  return onSnapshot(adsRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.ads) {
        onUpdate(data.ads);
      }
    }
  });
}

export async function saveAdsConfigToFirestore(ads: any[]): Promise<void> {
  const adsRef = doc(db, 'site_config', 'ads_config');
  await setDoc(adsRef, {
    ads,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

// 16. Helpdesk & Candidate Tickets Sync
export function subscribeToHelpdeskTickets(onUpdate: (tickets: any[]) => void) {
  const ticketsRef = doc(db, 'site_config', 'helpdesk_tickets');
  return onSnapshot(ticketsRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && Array.isArray(data.tickets)) {
        onUpdate(data.tickets);
      }
    }
  });
}

export async function saveHelpdeskTicketsToFirestore(tickets: any[]): Promise<void> {
  const ticketsRef = doc(db, 'site_config', 'helpdesk_tickets');
  await setDoc(ticketsRef, {
    tickets,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

// 17. Master Website Control & Customization Config Sync
export function subscribeToWebsiteControlConfig(onUpdate: (config: any) => void) {
  const configRef = doc(db, 'site_config', 'website_control_config');
  return onSnapshot(configRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.config) {
        onUpdate(data.config);
      }
    }
  });
}

export async function saveWebsiteControlConfigToFirestore(config: any): Promise<void> {
  const configRef = doc(db, 'site_config', 'website_control_config');
  await setDoc(configRef, {
    config,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

