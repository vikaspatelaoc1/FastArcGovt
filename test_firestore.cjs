const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore/lite');

const firebaseConfig = {
  projectId: "direct-stone-dxctm",
  appId: "1:993642021377:web:98bdd8dc2f5d577e283600",
  apiKey: "AIzaSyBPobsHpRVFbi4PKiomkK-46hYr1ylhSec",
  firestoreDatabaseId: "ai-studio-fastarcgovtresul-21912eff-20ad-4387-bde5-7cb20bed357a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  try {
    const snapshot = await getDocs(collection(db, 'jobs'));
    console.log("Success! Got docs:", snapshot.docs.length);
  } catch(e) {
    console.error("Failed:", e);
  }
}
test();
