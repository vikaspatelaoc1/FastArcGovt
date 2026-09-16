const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const checkUrlEndpoint = `
// Link Health Check endpoint
app.post('/api/check-url', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ status: 'error', error: 'Missing URL' });
  try {
    const { normalizeExternalUrl } = require('./src/utils/urlUtils.ts');
    const u = new URL(url); // parse validation
    const client = u.protocol === 'http:' ? require('http') : require('https');
    
    await new Promise((resolve, reject) => {
      const request = client.request(url, { method: 'HEAD', timeout: 3000 }, (response) => {
        resolve(response.statusCode);
      });
      request.on('error', (err) => reject(err));
      request.on('timeout', () => { request.destroy(); reject(new Error('timeout')); });
      request.end();
    }).then(statusCode => {
      res.json({ status: 'ok', statusCode });
    }).catch(err => {
      res.json({ status: 'error', error: err.message || 'fetch failed' });
    });
  } catch (err) {
    res.json({ status: 'error', error: err.message || 'invalid url' });
  }
});
`;

if (!content.includes('/api/check-url')) {
  // Find a good spot, like before app.post('/api/send-email'
  if (content.includes('app.post(\'/api/send-email\'')) {
    content = content.replace('app.post(\'/api/send-email\'', checkUrlEndpoint + '\napp.post(\'/api/send-email\'');
  } else if (content.includes('app.get(\'/api/jobs\'')) {
      content = content.replace('app.get(\'/api/jobs\'', checkUrlEndpoint + '\napp.get(\'/api/jobs\'');
  } else {
    // just put it before if (process.env.NODE_ENV !== 'production')
    content = content.replace("if (process.env.NODE_ENV !== 'production')", checkUrlEndpoint + "\n    if (process.env.NODE_ENV !== 'production')");
  }
  fs.writeFileSync('server.ts', content);
  console.log('Patched server.ts with /api/check-url endpoint');
} else {
  console.log('/api/check-url already exists');
}
