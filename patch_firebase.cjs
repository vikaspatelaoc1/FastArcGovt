const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf8');

const regex = /import \{ getFirestore \} from 'firebase\/firestore';/;
const replacement = `import { getFirestore, setLogLevel } from 'firebase/firestore';\n\n// Mute verbose background retry warnings when quota is hit\nsetLogLevel('silent');`;

const newCode = code.replace(regex, replacement);
if (code === newCode) {
  console.log("No replacement made!");
} else {
  fs.writeFileSync('src/firebase.ts', newCode);
  console.log("Replacement successful!");
}
