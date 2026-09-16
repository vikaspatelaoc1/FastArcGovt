
if (typeof window !== 'undefined') {
  const isIgnorableError = (msg: string) => {
    if (!msg || msg.trim() === '' || msg === 'Script error.' || msg === 'undefined' || msg === 'null') {
      return true;
    }
    const low = msg.toLowerCase();
    return (
      low.includes('websocket') ||
      low.includes('vite') ||
      low.includes('closed without opened') ||
      low.includes('database is closing') ||
      low.includes('closing/hidden') ||
      low.includes('database connection is closing') ||
      low.includes('connection is closing') ||
      low.includes('connection check timeout') ||
      low.includes('quota') ||
      low.includes('serviceworker') ||
      low.includes('service worker') ||
      low.includes('failed to register a serviceworker') ||
      low.includes('translate') ||
      low.includes('google_translate') ||
      low.includes('networkerror') ||
      low.includes('failed to fetch') ||
      low.includes('load failed') ||
      low.includes('permission denied') ||
      low.includes('permission-denied')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason?.message || String(event?.reason || '');
    if (isIgnorableError(reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const message = event?.message || String(event?.error?.message || '');
    if (isIgnorableError(message)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

const shouldSuppressClientLog = (...args: any[]) => {
  const text = args.map(a => (typeof a === 'string' ? a : a?.message || String(a || ''))).join(' ');
  const low = text.toLowerCase();
  return (
    low.includes('@firebase/firestore') ||
    low.includes('@firebase/auth') ||
    low.includes('quota limit exceeded') ||
    low.includes('quota exceeded') ||
    low.includes('free daily write units') ||
    low.includes('using maximum backoff delay') ||
    low.includes('[vite] failed to connect to websocket') ||
    low.includes('websocket closed without opened') ||
    low.includes('database is closing') ||
    low.includes('closing/hidden') ||
    low.includes('database connection is closing') ||
    low.includes('connection is closing') ||
    low.includes('connection check timeout') ||
    low.includes('serviceworker') ||
    low.includes('service worker') ||
    low.includes('translate')
  );
};

const originalConsoleError = console.error;
console.error = (...args) => {
  if (shouldSuppressClientLog(...args)) return;
  originalConsoleError.apply(console, args);
};

const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (shouldSuppressClientLog(...args)) return;
  originalConsoleWarn.apply(console, args);
};
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
