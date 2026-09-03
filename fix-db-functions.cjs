const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Fix the typo
code = code.replace('function await saveDatabase(data: DatabaseSchema) {', 'async function saveDatabase(data: DatabaseSchema) {');
code = code.replace('function loadDatabase(): DatabaseSchema {', 'async function loadDatabase(): Promise<DatabaseSchema> {');

const loadReplacement = `async function loadDatabase(): Promise<DatabaseSchema> {
  try {
    if (firestoreDb) {
      const dbRef = doc(firestoreDb, 'config', 'app_state');
      const docSnap = await getDoc(dbRef);
      if (docSnap.exists()) {
        const parsed = docSnap.data();
        if (parsed && typeof parsed === 'object') {
          dbState = {
            jobs: Array.isArray(parsed.jobs) && parsed.jobs.length > 0 ? parsed.jobs : defaultInitialJobs,
            marqueeText: typeof parsed.marqueeText === 'string' ? parsed.marqueeText : dbState.marqueeText,
            employees: Array.isArray(parsed.employees) ? parsed.employees : defaultInitialEmployees,
            subscribers: Array.isArray(parsed.subscribers) ? parsed.subscribers : defaultInitialSubscribers,
            scraperSources: Array.isArray(parsed.scraperSources) && parsed.scraperSources.length > 0 ? parsed.scraperSources : defaultScraperSources,
            notificationConfig: parsed.notificationConfig ? { ...defaultNotificationConfig, ...parsed.notificationConfig } : defaultNotificationConfig,
            notificationHistory: Array.isArray(parsed.notificationHistory) ? parsed.notificationHistory : (dbState.notificationHistory || []),
            siteConfig: parsed.siteConfig || dbState.siteConfig,
            users: Array.isArray(parsed.users) ? parsed.users : dbState.users
          };
          console.log(\`🔥 Database loaded from Firebase: \${dbState.jobs.length} jobs available.\`);
          return dbState;
        }
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not load database from Firebase, falling back to default:', err);
  }
  // Initialize in Firebase if not present
  if (firestoreDb) {
    await saveDatabase(dbState);
  }
  return dbState;
}`;

const saveReplacement = `async function saveDatabase(data: DatabaseSchema) {
  try {
    if (firestoreDb) {
      const dbRef = doc(firestoreDb, 'config', 'app_state');
      await setDoc(dbRef, JSON.parse(JSON.stringify(data)));
      console.log(\`🔥 Database saved to Firebase (\${data.jobs.length} jobs)\`);
    } else {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      console.log(\`✅ Database saved to local disk (\${data.jobs.length} jobs)\`);
    }
  } catch (err) {
    console.error('❌ Failed to save database:', err);
  }
}`;

code = code.replace(/async function loadDatabase\(\): Promise<DatabaseSchema> \{[\s\S]*?return dbState;\n\}/, loadReplacement);
code = code.replace(/async function saveDatabase\(data: DatabaseSchema\) \{[\s\S]*?console\.error\('❌ Failed to save database to disk:', err\);\n  \}\n\}/, saveReplacement);

fs.writeFileSync('server.ts', code, 'utf8');
console.log('Fixed DB functions.');
