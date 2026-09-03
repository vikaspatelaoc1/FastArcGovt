const fs = require('fs');

let fileContent = fs.readFileSync('src/components/AutoFeedContent.tsx', 'utf8');

fileContent = fileContent.replace(
  'onToast(data.autoWatcherEnabled ? "▶️ Automated Background Scraper Watcher Active!" : "⏸️ Auto-Sync Paused");',
  `onToast(data.autoWatcherEnabled ? "▶️ Automated Background Scraper Watcher Active!" : "⏸️ Auto-Sync Paused");
                    if (data.autoWatcherEnabled) {
                      // Trigger an initial background scrape for immediate feedback
                      handleTriggerScraper();
                    }`
);

fs.writeFileSync('src/components/AutoFeedContent.tsx', fileContent, 'utf8');
console.log('Patched Auto-Watcher button.');
