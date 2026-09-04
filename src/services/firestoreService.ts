import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs, 
  getDoc,
  getDocFromServer,
  writeBatch,
  disableNetwork,
} from 'firebase/firestore';
import { db } from '../firebase';
import { JobAlert, EmployeeUser, SocialLinkItem, EmailNotificationConfig, NotificationDispatchLog } from '../types';
import { defaultJobsDatabase, defaultSocialLinks } from '../data';
import { ThemeColorConfig } from '../utils/themeColors';


// Connection validation
// Circuit breaker to avoid flooding Firestore when daily write quota is reached
const getTodayDateKey = () => `quota_exceeded_${new Date().toISOString().slice(0, 10)}`;

let isClientFirestoreQuotaExceeded: boolean = (() => {
  try {
    return localStorage.getItem(getTodayDateKey()) === 'true';
  } catch {
    return false;
  }
})();

export function isFirestoreQuotaExceeded(): boolean {
  return isClientFirestoreQuotaExceeded;
}

export function handleFirestoreQuotaError(err: any, context?: string): boolean {
  const msg = err?.message || String(err);
  if (
    msg.includes('Quota limit exceeded') ||
    msg.includes('resource-exhausted') ||
    msg.includes('quota') ||
    err?.code === 'resource-exhausted'
  ) {
    if (!isClientFirestoreQuotaExceeded) {
      isClientFirestoreQuotaExceeded = true;
      try {
        localStorage.setItem(getTodayDateKey(), 'true');
      } catch {}
      console.info(`[Firebase] Daily write quota reached (${context || 'operation'}). All writes safely redirected to local backend storage.`);
      
      // Removed disableNetwork(db) so that READS (onSnapshot) continue to work on Vercel
      // The console spam is handled by the console.error interceptor in main.tsx
    }
    return true;
  }
  return false;
}

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
      console.warn('Error handling jobs snapshot:', err);
      if (onError) onError(err);
      onUpdate(defaultJobsDatabase);
    }
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToJobs');
    console.warn('Firestore jobs subscription fallback to catalog:', err?.message || err);
    if (onError) onError(err);
    onUpdate(defaultJobsDatabase);
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
  if (isClientFirestoreQuotaExceeded) return;
  try {
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
  } catch (err: any) {
    if (!handleFirestoreQuotaError(err, 'saveJobToFirestore')) {
      console.warn('saveJobToFirestore warning:', err?.message || err);
    }
  }
}

// 3. Delete Job (Immediate & Permanent)
export async function deleteJobFromFirestore(jobId: string): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const jobRef = doc(db, 'jobs', jobId);
    await deleteDoc(jobRef);
  } catch (err: any) {
    if (!handleFirestoreQuotaError(err, 'deleteJobFromFirestore')) {
      console.warn('deleteJobFromFirestore warning:', err?.message || err);
    }
  }
}

// 4. Reset Jobs to Default
export async function resetJobsInFirestore(): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
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

    await batch.commit();
  } catch (err: any) {
    if (!handleFirestoreQuotaError(err, 'resetJobsInFirestore')) {
      console.warn('resetJobsInFirestore warning:', err?.message || err);
    }
  }
}

// 5. Bulk Save / Import Jobs (Deduplicated)
export async function bulkSaveJobsToFirestore(jobs: JobAlert[]): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
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

    await batch.commit();
  } catch (err: any) {
    if (!handleFirestoreQuotaError(err, 'bulkSaveJobsToFirestore')) {
      console.warn('bulkSaveJobsToFirestore warning:', err?.message || err);
    }
  }
}

// 5b. Append or update jobs without wiping existing database (for Scrapers & Live Ingestion - Deduplicated)
export async function appendJobsToFirestore(jobs: JobAlert[]): Promise<void> {
  if (!jobs || jobs.length === 0 || isClientFirestoreQuotaExceeded) return;

  try {
    const jobsCol = collection(db, 'jobs');
    const snapshot = await getDocs(jobsCol);

    const existingTitleMap = new Map<string, string>();
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as JobAlert;
      if (data.title) {
        existingTitleMap.set(data.title.trim().toLowerCase(), docSnap.id);
      }
    });

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
  } catch (err: any) {
    if (!handleFirestoreQuotaError(err, 'appendJobsToFirestore')) {
      console.warn('appendJobsToFirestore warning:', err?.message || err);
    }
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
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToMarquee');
  });
}

export async function saveMarqueeToFirestore(text: string): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const configRef = doc(db, 'site_config', 'marquee');
    await setDoc(configRef, {
      marqueeText: text,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveMarqueeToFirestore');
  }
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
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToAutoSync');
  });
}

export async function saveAutoSyncToFirestore(isActive: boolean): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const configRef = doc(db, 'site_config', 'autoSync');
    await setDoc(configRef, {
      isActive,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveAutoSyncToFirestore');
  }
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
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToThemeColors');
  });
}

export async function saveThemeColorsToFirestore(colors: ThemeColorConfig): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const configRef = doc(db, 'site_config', 'theme_colors');
    await setDoc(configRef, {
      colors,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveThemeColorsToFirestore');
  }
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
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToEarningsConfig');
  });
}

export async function saveEarningsConfigToFirestore(config: EarningsConfig): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const configRef = doc(db, 'site_config', 'earnings_config');
    await setDoc(configRef, {
      config,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveEarningsConfigToFirestore');
  }
}

// 6e. Website Backup Sync
export async function saveBackupToFirestore(backupData: any): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const backupRef = doc(db, 'site_config', 'website_backup');
    await setDoc(backupRef, {
      backup: JSON.stringify(backupData),
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveBackupToFirestore');
  }
}

export async function getBackupFromFirestore(): Promise<any | null> {
  try {
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
  } catch (err) {
    handleFirestoreQuotaError(err, 'getBackupFromFirestore');
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
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToEmployees');
    onUpdate([]);
  });
}

export async function saveEmployeeToFirestore(employee: EmployeeUser): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const empRef = doc(db, 'employees', employee.id);
    await setDoc(empRef, employee, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveEmployeeToFirestore');
  }
}

export async function deleteEmployeeFromFirestore(employeeId: string): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const empRef = doc(db, 'employees', employeeId);
    await deleteDoc(empRef);
  } catch (err) {
    handleFirestoreQuotaError(err, 'deleteEmployeeFromFirestore');
  }
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
  const defaultSubs: SubscriberRecord[] = [
    { id: 'sub-1', email: 'vikas.patel@example.com', category: 'Latest Jobs', date: '11 Aug 2026' },
    { id: 'sub-2', email: 'rahul.kumar@gmail.com', category: 'Admit Card', date: '10 Aug 2026' },
    { id: 'sub-3', email: 'priya.singh@yahoo.com', category: 'Results', date: '09 Aug 2026' },
  ];

  return onSnapshot(subCol, (snapshot) => {
    try {
      if (snapshot.empty) {
        onUpdate(defaultSubs);
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
      handleFirestoreQuotaError(err, 'subscribeToSubscribers snapshot');
      onUpdate(defaultSubs);
    }
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToSubscribers listener');
    onUpdate(defaultSubs);
  });
}

export async function saveSubscriberToFirestore(sub: SubscriberRecord): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const subRef = doc(db, 'subscribers', sub.id);
    await setDoc(subRef, {
      ...sub,
      createdAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveSubscriberToFirestore');
  }
}

export async function deleteSubscriberFromFirestore(subId: string): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const subRef = doc(db, 'subscribers', subId);
    await deleteDoc(subRef);
  } catch (err) {
    handleFirestoreQuotaError(err, 'deleteSubscriberFromFirestore');
  }
}

// 9. Social Media Links Realtime Sync
export function subscribeToSocialLinks(
  onUpdate: (links: SocialLinkItem[]) => void,
  onError?: (err: any) => void
) {
  const socialDocRef = doc(db, 'site_config', 'social_links');
  return onSnapshot(socialDocRef, (docSnap) => {
    try {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.links) && data.links.length > 0) {
          onUpdate(data.links);
          return;
        }
      }
      onUpdate(defaultSocialLinks);
    } catch (err) {
      handleFirestoreQuotaError(err, 'subscribeToSocialLinks');
      if (onError) onError(err);
      onUpdate(defaultSocialLinks);
    }
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToSocialLinks listener');
    if (onError) onError(err);
    onUpdate(defaultSocialLinks);
  });
}

export async function saveSocialLinksToFirestore(links: SocialLinkItem[]): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const socialDocRef = doc(db, 'site_config', 'social_links');
    await setDoc(socialDocRef, {
      links: links,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveSocialLinksToFirestore');
  }
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
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToSiteLogo');
  });
}

export async function saveSiteLogoToFirestore(logoData: string): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const configRef = doc(db, 'site_config', 'site_logo');
    await setDoc(configRef, {
      logoData: logoData,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveSiteLogoToFirestore');
  }
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
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToLogoHistory');
    onUpdate([]);
  });
}

export async function saveLogoHistoryToFirestore(history: LogoBackup[]): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const configRef = doc(db, 'site_config', 'logo_history');
    await setDoc(configRef, {
      history: history,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveLogoHistoryToFirestore');
  }
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
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToColumnConfigs');
  });
}

export async function saveColumnConfigsToFirestore(configs: any): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const colRef = doc(db, 'site_config', 'column_configs');
    await setDoc(colRef, {
      configs,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveColumnConfigsToFirestore');
  }
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
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToSeoConfig');
  });
}

export async function saveSeoConfigToFirestore(config: any): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const seoRef = doc(db, 'site_config', 'seo_config');
    await setDoc(seoRef, {
      config,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveSeoConfigToFirestore');
  }
}

// 12b. Category SEO & Meta Tags Realtime Sync
export function subscribeToCategorySeoConfig(onUpdate: (configs: any) => void) {
  const catSeoRef = doc(db, 'site_config', 'category_seo_config');
  return onSnapshot(catSeoRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.configs) {
        onUpdate(data.configs);
      }
    }
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToCategorySeoConfig');
  });
}

export async function saveCategorySeoConfigToFirestore(configs: any): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const catSeoRef = doc(db, 'site_config', 'category_seo_config');
    await setDoc(catSeoRef, {
      configs,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveCategorySeoConfigToFirestore');
  }
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
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToDynamicPages');
  });
}

export async function saveDynamicPagesToFirestore(pages: Record<string, any>): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const pagesRef = doc(db, 'site_config', 'dynamic_pages');
    await setDoc(pagesRef, {
      pages,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveDynamicPagesToFirestore');
  }
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
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToApiConfig');
  });
}

export async function saveApiConfigToFirestore(config: any): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const apiRef = doc(db, 'site_config', 'api_config');
    await setDoc(apiRef, {
      config,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveApiConfigToFirestore');
  }
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
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToAdsConfig');
  });
}

export async function saveAdsConfigToFirestore(ads: any[]): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const adsRef = doc(db, 'site_config', 'ads_config');
    await setDoc(adsRef, {
      ads,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveAdsConfigToFirestore');
  }
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
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToHelpdeskTickets');
  });
}

export async function saveHelpdeskTicketsToFirestore(tickets: any[]): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const ticketsRef = doc(db, 'site_config', 'helpdesk_tickets');
    await setDoc(ticketsRef, {
      tickets,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveHelpdeskTicketsToFirestore');
  }
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
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToWebsiteControlConfig');
  });
}

export async function saveWebsiteControlConfigToFirestore(config: any): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const configRef = doc(db, 'site_config', 'website_control_config');
    await setDoc(configRef, {
      config,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveWebsiteControlConfigToFirestore');
  }
}

// 18. Automated Email Notifications & Alerts Config Sync
export const defaultEmailNotificationConfig: EmailNotificationConfig = {
  autoSendOnPublish: true,
  provider: 'built-in',
  fromName: 'FastArc Govt Job Alerts',
  fromEmail: 'alerts@fastarc.in',
  replyToEmail: 'support@fastarc.in',
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUser: '',
  smtpPassword: '',
  smtpSecure: false,
  apiKey: '',
  webhookUrl: '',
  subjectTemplate: '⚡ [FastArc Alert] {job_title} - {state} Apply Online',
  preheaderText: 'New Government Job Notification has been published on FastArc Portal. Check eligibility and apply now.',
  bannerTitle: 'OFFICIAL GOVERNMENT JOB NOTIFICATION RELEASED',
  callToActionText: 'View Full Job Details & Apply Online',
  footerNote: 'You received this official alert because you subscribed on FastArc Govt Jobs Portal.',
  sendCategories: ['all', 'latest-jobs', 'admit-cards', 'results', 'answer-key', 'syllabus', 'admission'],
  sendDelaySeconds: 0,
  includePdfLink: true,
  includeApplyLink: true,
};

export function subscribeToEmailNotificationConfig(onUpdate: (config: EmailNotificationConfig) => void) {
  const configRef = doc(db, 'site_config', 'email_notifications');
  return onSnapshot(configRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.config) {
        onUpdate({
          ...defaultEmailNotificationConfig,
          ...data.config
        });
        return;
      }
    }
    onUpdate(defaultEmailNotificationConfig);
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToEmailNotificationConfig');
    onUpdate(defaultEmailNotificationConfig);
  });
}

export async function saveEmailNotificationConfigToFirestore(config: EmailNotificationConfig): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const configRef = doc(db, 'site_config', 'email_notifications');
    await setDoc(configRef, {
      config,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveEmailNotificationConfigToFirestore');
  }
}

export async function bulkDeleteJobsFromFirestore(jobIds: string[]): Promise<void> {
  if (!jobIds || jobIds.length === 0 || isClientFirestoreQuotaExceeded) return;
  try {
    const batch = writeBatch(db);
    jobIds.forEach(id => {
      const jobRef = doc(db, 'jobs', id);
      batch.delete(jobRef);
    });
    await batch.commit();
  } catch (err) {
    handleFirestoreQuotaError(err, 'bulkDeleteJobsFromFirestore');
  }
}

// 19. Notification Dispatch History Logs
export function subscribeToNotificationLogs(onUpdate: (logs: NotificationDispatchLog[]) => void) {
  const logsRef = doc(db, 'site_config', 'notification_logs');
  return onSnapshot(logsRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && Array.isArray(data.logs)) {
        onUpdate(data.logs);
        return;
      }
    }
    onUpdate([]);
  }, (err) => {
    handleFirestoreQuotaError(err, 'subscribeToNotificationLogs');
    onUpdate([]);
  });
}

export async function saveNotificationLogToFirestore(log: NotificationDispatchLog): Promise<void> {
  if (isClientFirestoreQuotaExceeded) return;
  try {
    const logsRef = doc(db, 'site_config', 'notification_logs');
    const snap = await getDoc(logsRef);
    let existingLogs: NotificationDispatchLog[] = [];
    if (snap.exists()) {
      const data = snap.data();
      if (data && Array.isArray(data.logs)) {
        existingLogs = data.logs;
      }
    }
    const updatedLogs = [log, ...existingLogs.filter(l => l.id !== log.id)].slice(0, 100);
    await setDoc(logsRef, {
      logs: updatedLogs,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreQuotaError(err, 'saveNotificationLogToFirestore');
  }
}


