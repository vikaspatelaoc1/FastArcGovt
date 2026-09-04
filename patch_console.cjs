const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

if (!code.includes('console.error = ')) {
  const patch = `
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && (args[0].includes('@firebase/firestore') || args[0].includes('Quota limit exceeded') || args[0].includes('Using maximum backoff delay'))) {
    return; // Suppress Firebase quota spam
  }
  originalConsoleError.apply(console, args);
};
`;
  code = patch + code;
  fs.writeFileSync('src/main.tsx', code);
  console.log('Patched src/main.tsx');
}
