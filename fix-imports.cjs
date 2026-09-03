const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';",
  "import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore/lite';"
);

fs.writeFileSync('server.ts', code, 'utf8');
console.log('Fixed imports.');
