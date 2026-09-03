const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldEffectRegex = /\/\/ Auto-Sync Background Feeder simulation[\s\S]*?return \(\) => clearInterval\(interval\);\n  \}, \[isAutoSyncActive, setJobs, setSyncLogs, triggerToast\]\);/;

const newEffect = `// Real Auto-Sync Background Feeder
  useEffect(() => {
    let interval: any;
    if (isAutoSyncActive) {
      console.log("[Auto-Sync] Watcher started. Interval set for background fetching.");
      
      interval = setInterval(async () => {
        try {
          console.log("[Auto-Sync] Triggering background auto-sync fetch...");
          setSyncLogs(logs => [
            { id: Date.now(), time: new Date().toLocaleTimeString(), message: "Starting background auto-sync fetch...", type: "system" },
            ...logs.slice(0, 20)
          ]);

          const res = await fetch('/api/v1/scraper/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}) // Fetch random batch
          });

          if (!res.ok) {
            const errorText = await res.text();
            console.error('[Auto-Sync] Server returned error:', res.status, errorText);
            setSyncLogs(logs => [
              { id: Date.now(), time: new Date().toLocaleTimeString(), message: \`Auto-sync failed: \${res.status} \${res.statusText}\`, type: "error" },
              ...logs.slice(0, 20)
            ]);
            return; // Skip this tick
          }

          const data = await res.json();
          if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
            console.log(\`[Auto-Sync] Successfully fetched \${data.posts.length} jobs.\`);
            
            // Just take one random to auto-fill for the simulation feel, or process all?
            // The prompt says "if the issue is with the external API fetch or parsing logic, implement a more robust error handling and log verification step in the useEffect hook managing the auto-sync interval."
            const randomItem = data.posts[Math.floor(Math.random() * data.posts.length)];
            const todayStr = new Date().toLocaleDateString('en-GB').replace(/\\//g, '-');
            
            const newJob: JobAlert = {
              id: \`auto-\${Date.now()}\`,
              title: randomItem.title,
              category: randomItem.category as any,
              postDate: todayStr,
              isNew: true,
              state: randomItem.state,
              shortInfo: randomItem.shortInfo,
              dates: randomItem.dates,
              fees: randomItem.fees,
              links: randomItem.links
            };

            setJobs(prev => {
              const normTitle = newJob.title.trim().toLowerCase();
              if (prev.some(j => j.title && j.title.trim().toLowerCase() === normTitle)) {
                return prev; // Duplicate
              }
              
              triggerToast(\`🔔 Auto-Filled: \${newJob.title.substring(0, 30)}...\`);
              setSyncLogs(logs => [
                { id: Date.now(), time: new Date().toLocaleTimeString(), message: \`AUTO-POST ADDED: \${newJob.title}\`, type: "success" },
                ...logs.slice(0, 20)
              ]);
              
              saveJobToFirestore(newJob).catch(err => console.warn('Auto-sync firestore save error:', err));
              
              return [newJob, ...prev];
            });

          } else {
            console.log('[Auto-Sync] No new items or invalid format received.', data);
          }
        } catch (err: any) {
          console.error('[Auto-Sync] Catch error during background fetch:', err.message);
          setSyncLogs(logs => [
            { id: Date.now(), time: new Date().toLocaleTimeString(), message: \`Auto-sync exception: \${err.message}\`, type: "error" },
            ...logs.slice(0, 20)
          ]);
        }
      }, 45000); // 45 seconds interval
    }
    return () => {
      if (interval) clearInterval(interval);
      console.log("[Auto-Sync] Watcher stopped.");
    };
  }, [isAutoSyncActive, setJobs, setSyncLogs, triggerToast]);`;

if (oldEffectRegex.test(code)) {
  code = code.replace(oldEffectRegex, newEffect);
  fs.writeFileSync('src/App.tsx', code, 'utf8');
  console.log('Successfully patched App.tsx');
} else {
  console.log('Failed to find old effect in App.tsx');
}
