import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, setLogLevel } from 'firebase/firestore';

// Mute verbose background retry warnings when quota is hit
setLogLevel('silent');
import firebaseConfig from './firebaseConfig';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Resilient Firestore initialization
let dbInstance;
try {
  if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') {
    dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  } else {
    dbInstance = getFirestore(app);
  }
} catch (e) {
  console.warn('Failed to initialize Firestore with custom database ID, falling back to default database:', e);
  dbInstance = getFirestore(app);
}

export const db = dbInstance;

// Lazy auth getter if ever needed, preventing eager IndexedDB initialization on page load
let _authInstance: any = null;
export const getFirebaseAuth = async () => {
  if (!_authInstance) {
    const { getAuth } = await import('firebase/auth');
    _authInstance = getAuth(app);
  }
  return _authInstance;
};


