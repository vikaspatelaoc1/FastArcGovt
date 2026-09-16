const fs = require('fs');
let code = fs.readFileSync('src/utils/jobEnricher.ts', 'utf8');

const regex = /export function cleanOfficialUrl\([\s\S]*?return clean\n[\s\S]*?replace\(\/\\\.\(xml\|rss\|atom\)\.\*\$\/i, ''\)\n\s*\}\n\}/;

const newFunc = `export function cleanOfficialUrl(url?: string, defaultFallback: string = 'https://india.gov.in'): string {
  if (!url || typeof url !== 'string' || !url.trim() || url.trim() === '#') return defaultFallback;
  let clean = url.trim();
  if (!/^https?:\\/\\//i.test(clean)) clean = \`https://\${clean}\`;
  
  try {
    const u = new URL(clean);
    
    // Only strip feed-related search parameters explicitly, preserve others
    if (u.search) {
      const params = new URLSearchParams(u.search);
      if (params.has('feed')) params.delete('feed');
      if (params.has('format') && params.get('format') === 'xml') params.delete('format');
      u.search = params.toString();
    }

    // Strip feed artifacts from pathname safely, preserving normal paths
    let path = u.pathname
      .replace(/\\/(rss|feed|atom)\\.xml$/i, '')
      .replace(/\\/(rss|feed|rss-feed|feeds)$/i, '')
      .replace(/\\.xml$/i, '')
      .replace(/\\/$/, '');
      
    u.pathname = path || '/';

    return u.toString();
  } catch {
    return clean;
  }
}`;

if (code.match(regex)) {
  code = code.replace(regex, newFunc);
  fs.writeFileSync('src/utils/jobEnricher.ts', code);
  console.log('Patched cleanOfficialUrl successfully!');
} else {
  console.log('Regex did not match. Trying fallback replacement...');
  // Fallback: replace everything between "export function cleanOfficialUrl" and the matching closing brace.
  const startIdx = code.indexOf('export function cleanOfficialUrl');
  if (startIdx !== -1) {
    let braceCount = 0;
    let endIdx = -1;
    let started = false;
    for (let i = startIdx; i < code.length; i++) {
      if (code[i] === '{') {
        braceCount++;
        started = true;
      } else if (code[i] === '}') {
        braceCount--;
        if (started && braceCount === 0) {
          endIdx = i;
          break;
        }
      }
    }
    if (endIdx !== -1) {
      const before = code.substring(0, startIdx);
      const after = code.substring(endIdx + 1);
      fs.writeFileSync('src/utils/jobEnricher.ts', before + newFunc + after);
      console.log('Patched cleanOfficialUrl via index counting successfully!');
    }
  } else {
    console.log('Could not find cleanOfficialUrl function.');
  }
}
