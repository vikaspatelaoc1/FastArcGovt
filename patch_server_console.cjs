const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

if (!code.includes('const originalConsoleError = console.error;')) {
  const patch = `
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && (args[0].includes('@firebase/firestore') || args[0].includes('Quota limit exceeded') || args[0].includes('Using maximum backoff delay'))) {
    return; // Suppress Firebase quota spam
  }
  originalConsoleError.apply(console, args);
};
`;
  code = code.replace("import express from 'express';", patch + "\nimport express from 'express';");
  fs.writeFileSync('server.ts', code);
  console.log('Patched server.ts');
}
