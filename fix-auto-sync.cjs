const fs = require('fs');

let fileContent = fs.readFileSync('src/components/AutoFeedContent.tsx', 'utf8');

// Fix handleTriggerScraper robust error handling
fileContent = fileContent.replace(
  "const res = await fetch('/api/v1/scraper/run', {",
  `const res = await fetch('/api/v1/scraper/run', {`
);

let newHandleTriggerScraper = `
  const handleTriggerScraper = async (sourceId?: string) => {
    setIsScraping(true);
    onToast(sourceId ? '⏳ Scraping selected portal feed...' : '⏳ Automated Scraper starting across all active feeds...');
    try {
      const res = await fetch('/api/v1/scraper/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId })
      });
      
      if (!res.ok) {
        let errorText = await res.text();
        console.error('API Error Response:', errorText);
        throw new Error(\`Server returned \${res.status} \${res.statusText}. Possibly a timeout on Vercel.\`);
      }
      
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        setScrapedQueue(prev => {
          // Prepend new unique items
          const existingTitles = new Set(prev.map(p => p.title.toLowerCase().trim()));
          const newItems = data.posts.filter((p: ScrapedPost) => !existingTitles.has(p.title.toLowerCase().trim()));
          return [...newItems, ...prev];
        });
        fetchSources(); // Refresh last scraped timestamp
        onToast(\`✅ Scraped \${data.totalScraped} latest alerts from \${data.sourcesProcessed} government feeds!\`);
      } else {
        onToast(\`⚠️ Scraper responded: \${data.error || 'No new alerts found'}\`);
      }
    } catch (err: any) {
      console.error("Scraper Error:", err);
      onToast(\`❌ Scraper failed: \${err.message}\`);
    } finally {
      setIsScraping(false);
    }
  };
`;

// Replace handleTriggerScraper
fileContent = fileContent.replace(/const handleTriggerScraper = async \([\s\S]*?setIsScraping\(false\);\n    \}\n  \};/, newHandleTriggerScraper.trim());

fs.writeFileSync('src/components/AutoFeedContent.tsx', fileContent, 'utf8');
console.log('Patched AutoFeedContent.tsx handleTriggerScraper.');
