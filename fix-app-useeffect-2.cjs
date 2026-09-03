const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldEffectRegex = /\/\/ Auto-Sync Background Feeder simulation[\s\S]*?return \(\) => clearInterval\(interval\);\n  \}, \[isAutoSyncActive\]\);/;

const newEffect = `// Auto-Sync Background Feeder with robust external API fetch and error handling
  useEffect(() => {
    let interval: any;
    if (isAutoSyncActive) {
      console.log("[Auto-Sync] Watcher active. Background sync enabled.");
      
      interval = setInterval(async () => {
        try {
          console.log("[Auto-Sync] Triggering background API fetch for jobs...");
          setSyncLogs(logs => [
            { id: Date.now(), time: new Date().toLocaleTimeString(), message: "Attempting auto-sync with API endpoint...", type: "system" },
            ...logs.slice(0, 20)
          ]);

          const res = await fetch('/api/v1/scraper/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}) // Fetch random batch
          });

          if (!res.ok) {
            const errorText = await res.text();
            console.error('[Auto-Sync] External API returned error:', res.status, errorText);
            setSyncLogs(logs => [
              { id: Date.now(), time: new Date().toLocaleTimeString(), message: \`Auto-sync failed: HTTP \${res.status} \${res.statusText}\`, type: "error" },
              ...logs.slice(0, 20)
            ]);
            return;
          }

          const data = await res.json();
          if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
            console.log(\`[Auto-Sync] Received \${data.posts.length} new jobs. Verifying formats...\`);
            
            // Pick a random scraped post to emulate "live auto-fill" in UI
            const randomItem = data.posts[Math.floor(Math.random() * data.posts.length)];
            const todayStr = new Date().toLocaleDateString('en-GB').replace(/\\//g, '-');
            
            // Verify mandatory fields
            if (!randomItem.title || !randomItem.category) {
               console.warn('[Auto-Sync] Invalid job format returned from API', randomItem);
               return;
            }

            const newJob: JobAlert = {
              id: \`auto-\${Date.now()}\`,
              title: randomItem.title,
              category: randomItem.category as any,
              postDate: randomItem.postDate || todayStr,
              isNew: true,
              state: randomItem.state || "Central",
              shortInfo: randomItem.shortInfo || "Extracted via Automated Web Scraper",
              dates: randomItem.dates || { start: todayStr, last: "Check Official Notification" },
              fees: randomItem.fees || { general: "₹100", scSt: "₹0" },
              links: randomItem.links || { apply: "https://india.gov.in", official: "https://india.gov.in" }
            };

            setJobs(prev => {
              const normTitle = newJob.title.trim().toLowerCase();
              if (prev.some(j => j.title && j.title.trim().toLowerCase() === normTitle)) {
                return prev; // Ignore duplicates
              }
              
              triggerToast(\`🔔 Auto-Filled: \${newJob.title.substring(0, 30)}...\`);
              setSyncLogs(logs => [
                { id: Date.now(), time: new Date().toLocaleTimeString(), message: \`API SYNC: Added \${newJob.title.substring(0,40)}...\`, type: "success" },
                ...logs.slice(0, 20)
              ]);
              
              saveJobToFirestore(newJob).catch(err => console.warn('Auto-sync firestore save error:', err));
              
              return [newJob, ...prev];
            });
          } else {
            console.log('[Auto-Sync] No new alerts found or invalid payload format.', data);
          }
        } catch (err: any) {
          console.error('[Auto-Sync] Exception parsing external API response:', err.message);
          setSyncLogs(logs => [
            { id: Date.now(), time: new Date().toLocaleTimeString(), message: \`Auto-sync parse/fetch exception: \${err.message}\`, type: "error" },
            ...logs.slice(0, 20)
          ]);
        }
      }, 30000); // 30s interval for background feed
    }
    return () => clearInterval(interval);
  }, [isAutoSyncActive]);`;

if (oldEffectRegex.test(code)) {
  code = code.replace(oldEffectRegex, newEffect);
  fs.writeFileSync('src/App.tsx', code, 'utf8');
  console.log('Successfully patched App.tsx');
} else {
  console.log('Failed to find old effect in App.tsx');
}
