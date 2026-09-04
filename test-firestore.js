import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  const snapshot = await getDocs(collection(db, 'jobs'));
  console.log('Jobs count:', snapshot.size);
  process.exit(0);
}
test().catch(console.error);
