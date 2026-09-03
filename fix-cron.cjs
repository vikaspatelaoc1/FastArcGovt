const fs = require('fs');

// Add cron endpoint in server.ts
let serverCode = fs.readFileSync('server.ts', 'utf8');
if (!serverCode.includes('/api/v1/cron/auto-watcher')) {
  const cronEndpoint = `
app.get('/api/v1/cron/auto-watcher', async (req, res) => {
  try {
    if (dbState.siteConfig.autoWatcherEnabled) {
      const posts = await runAutomatedScraper();
      if (posts.length > 0) {
        await autoIngestPosts(posts);
        return res.json({ success: true, message: \`Ingested \${posts.length} jobs\` });
      }
      return res.json({ success: true, message: 'No new jobs found' });
    }
    return res.json({ success: true, message: 'Auto-watcher disabled' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
`;
  serverCode = serverCode.replace("app.get('/api/health'", cronEndpoint + "\napp.get('/api/health'");
  fs.writeFileSync('server.ts', serverCode, 'utf8');
}

// Add cron to vercel.json
if (fs.existsSync('vercel.json')) {
  let vercelConf = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  vercelConf.crons = [
    {
      "path": "/api/v1/cron/auto-watcher",
      "schedule": "0 * * * *"
    }
  ];
  fs.writeFileSync('vercel.json', JSON.stringify(vercelConf, null, 2), 'utf8');
}
console.log('Cron endpoint and vercel.json updated.');
