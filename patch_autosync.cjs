const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /useEffect\(\(\) => \{\n\s*let interval: any;\n\s*if \(isAutoSyncActive\) \{[\s\S]*?return \(\) => clearInterval\(interval\);\n\s*\}, \[isAutoSyncActive\]\);/g;

const replacement = `useEffect(() => {
    let timeoutId: any;
    let isCancelled = false;
    let currentConsecutiveErrors = 0;

    const scheduleNextSync = (delay: number) => {
      if (isCancelled) return;
      timeoutId = setTimeout(async () => {
        await executeSync();
      }, delay);
    };

    const executeSync = async () => {
      if (isCancelled) return;
      const startTime = performance.now();
      try {
        console.log("[Auto-Sync] Triggering background API fetch for jobs...");
        setSyncLogs(logs => [
          { id: Date.now(), time: new Date().toLocaleTimeString(), message: "Attempting automated background sync batch...", type: "system", endpoint: "/api/v1/scraper/run" },
          ...logs.slice(0, 99)
        ]);

        const res = await fetch('/api/v1/scraper/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });

        const durationMs = Math.round(performance.now() - startTime);
        const statusCode = res.status;
        const contentType = res.headers.get('content-type') || '';

        if (!res.ok || !contentType.includes('application/json')) {
          const errorText = await res.text().catch(() => '');
          const errorDetails = \`HTTP \${statusCode}: \${errorText.substring(0, 100) || res.statusText || 'Server error'}\`;
          console.error('[Auto-Sync] External API returned error:', statusCode, errorDetails);
          
          currentConsecutiveErrors++;
          setConsecutiveSyncErrors(currentConsecutiveErrors);

          setSyncLogs(logs => [
            { 
              id: Date.now(), 
              time: new Date().toLocaleTimeString(), 
              message: \`Auto-sync failed: HTTP status \${statusCode} (Attempt \${currentConsecutiveErrors})\`, 
              type: "error",
              statusCode,
              durationMs,
              errorDetails,
              endpoint: '/api/v1/scraper/run'
            },
            ...logs.slice(0, 99)
          ]);
          
          const backoffDelay = Math.min(30000 * Math.pow(2, currentConsecutiveErrors), 300000); // Max 5 mins
          scheduleNextSync(backoffDelay);
          return;
        }

        currentConsecutiveErrors = 0;
        setConsecutiveSyncErrors(0);

        const data = await res.json();
        if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          const randomItem = data.posts[Math.floor(Math.random() * data.posts.length)];
          const todayStr = new Date().toLocaleDateString('en-GB').replace(/\\//g, '-');
          
          if (randomItem.title && randomItem.category) {
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
                return prev;
              }
              
              triggerToast(\`🔔 Auto-Filled: \${newJob.title.substring(0, 30)}...\`);
              setSyncLogs(logs => [
                { 
                  id: Date.now(), 
                  time: new Date().toLocaleTimeString(), 
                  message: \`AUTO-SYNC: Published \${newJob.title.substring(0,40)}...\`, 
                  type: "success",
                  statusCode: 200,
                  durationMs,
                  postsCount: data.posts.length,
                  endpoint: '/api/v1/scraper/run',
                  sourceName: randomItem.sourceName || 'Active Govt Feed'
                },
                ...logs.slice(0, 99)
              ]);
              
              if (!isFirestoreQuotaExceeded()) {
                saveJobToFirestore(newJob).catch(() => {});
              }
              fetch('/api/v1/sarkari-posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newJob)
              }).catch(() => {});
              
              return [newJob, ...prev];
            });
          }
        }
        
        scheduleNextSync(30000);
      } catch (err: any) {
        currentConsecutiveErrors++;
        setConsecutiveSyncErrors(currentConsecutiveErrors);
        
        const durationMs = Math.round(performance.now() - startTime);
        setSyncLogs(logs => [
          { 
            id: Date.now(), 
            time: new Date().toLocaleTimeString(), 
            message: \`Auto-sync network exception: \${err.message} (Attempt \${currentConsecutiveErrors})\`, 
            type: "error",
            statusCode: 0,
            durationMs,
            errorDetails: err.message || 'Network / connection timeout',
            endpoint: '/api/v1/scraper/run'
          },
          ...logs.slice(0, 99)
        ]);
        
        const backoffDelay = Math.min(30000 * Math.pow(2, currentConsecutiveErrors), 300000); // Max 5 mins
        scheduleNextSync(backoffDelay);
      }
    };

    if (isAutoSyncActive) {
      console.log("[Auto-Sync] Watcher active. Background sync enabled.");
      scheduleNextSync(30000);
    }
    
    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isAutoSyncActive]);`;

const newCode = code.replace(regex, replacement);
if (code === newCode) {
  console.log("No replacement made! Regex mismatch.");
} else {
  fs.writeFileSync('src/App.tsx', newCode);
  console.log("Replacement successful!");
}
