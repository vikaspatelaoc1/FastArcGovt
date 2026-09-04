const { initializeApp } = require('firebase/app');
const { getFirestore, collection, onSnapshot } = require('firebase/firestore');

const firebaseConfig = {
  projectId: "direct-stone-dxctm",
  appId: "1:993642021377:web:98bdd8dc2f5d577e283600",
  apiKey: "AIzaSyBPobsHpRVFbi4PKiomkK-46hYr1ylhSec",
  firestoreDatabaseId: "ai-studio-fastarcgovtresul-21912eff-20ad-4387-bde5-7cb20bed357a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const unsub = onSnapshot(collection(db, 'jobs'), (snap) => {
  console.log("Success client SDK! Got docs:", snap.docs.length);
  unsub();
  process.exit(0);
}, (err) => {
  console.error("Client SDK Failed:", err);
  process.exit(1);
});
