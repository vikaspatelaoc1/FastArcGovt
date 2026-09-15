const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /function markFirestoreQuotaExhausted\(\) \{[\s\S]*?catch \{\}\n\}/,
  `function markFirestoreQuotaExhausted() {
  isFirestoreQuotaExhausted = true;
  console.warn('⚠️ Firestore quota exhausted. Temporarily pausing sync for 15 minutes.');
  setTimeout(() => {
    isFirestoreQuotaExhausted = false;
    console.log('🔄 Retrying Firestore connection after pause...');
  }, 15 * 60 * 1000);
}`
);

fs.writeFileSync('server.ts', code);
console.log('Patched server.ts markFirestoreQuotaExhausted');
