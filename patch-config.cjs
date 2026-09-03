const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');

// We will inject the firebase config directly into the server file to avoid Vercel path issues
const configContent = fs.readFileSync('firebase-applet-config.json', 'utf8');

const replacement = `
let firebaseConfig = null;
try {
  firebaseConfig = ${configContent.trim()};
  const firebaseApp = initializeApp(firebaseConfig);
  firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.warn('Error reading Firebase config:', e);
}
`;

serverCode = serverCode.replace(/const configPath = path\.join[\s\S]*?console\.warn\('Firebase config not found for server\.'\);\n  \}/, replacement);

fs.writeFileSync('server.ts', serverCode, 'utf8');
console.log('Firebase config injected directly to prevent Vercel trace issues.');
