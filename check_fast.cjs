const fs = require('fs');
const https = require('https');
const http = require('http');

const urls = fs.readFileSync('test_urls.txt', 'utf8').split('\n').filter(Boolean).map(u => u.replace(/"/g, ''));

function checkUrl(url) {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const client = parsed.protocol === 'http:' ? http : https;
    const req = client.request(url, { method: 'HEAD', timeout: 2000 }, (res) => {
      resolve({ url, status: res.statusCode, location: res.headers.location });
    });
    req.on('error', (err) => resolve({ url, error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ url, error: 'timeout' }); });
    req.end();
  });
}

async function run() {
  for (const url of urls) {
    const res = await checkUrl(url);
    if (res.error || res.status >= 400) {
      console.log(`[FAIL] ${url} -> ${res.error || res.status}`);
      if (!url.includes('www.')) {
        const url2 = url.replace('://', '://www.');
        const res2 = await checkUrl(url2);
        if (!res2.error && res2.status < 400) console.log(`   [FIX] -> ${url2}`);
      }
    } else {
      console.log(`[OK] ${url} -> ${res.status}`);
    }
  }
}
run();
