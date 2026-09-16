const fs = require('fs');
let code = fs.readFileSync('src/utils/jobEnricher.ts', 'utf8');

const regex = /export function cleanOfficialUrl\([\s\S]*?return clean;\n\s*\}\n\}/;

const replacement = `import { normalizeExternalUrl } from './urlUtils';

export function cleanOfficialUrl(url?: string, defaultFallback: string = 'https://india.gov.in'): string {
  const norm = normalizeExternalUrl(url);
  if (!norm) return defaultFallback;
  
  try {
    const u = new URL(norm);
    
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
    return norm;
  }
}`;

if (code.match(regex)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/utils/jobEnricher.ts', code);
  console.log('Patched cleanOfficialUrl!');
} else {
  // Let's do a fallback replace
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
      const importStmt = "import { normalizeExternalUrl } from './urlUtils';\n";
      fs.writeFileSync('src/utils/jobEnricher.ts', importStmt + before + replacement.replace(importStmt, '') + after);
      console.log('Patched via fallback!');
    }
  }
}
