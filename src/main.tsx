
if (typeof window !== 'undefined') {
  const isIgnorableError = (msg: string) => {
    return (
      msg.includes('WebSocket') ||
      msg.includes('vite') ||
      msg.includes('closed without opened') ||
      msg.includes('Database is closing') ||
      msg.includes('closing/hidden') ||
      msg.includes('database connection is closing') ||
      msg.includes('connection is closing')
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
  return (
    text.includes('@firebase/firestore') ||
    text.includes('@firebase/auth') ||
    text.includes('Quota limit exceeded') ||
    text.includes('Quota exceeded') ||
    text.includes('Free daily write units') ||
    text.includes('Using maximum backoff delay') ||
    text.includes('[vite] failed to connect to websocket') ||
    text.includes('WebSocket closed without opened') ||
    text.includes('Database is closing') ||
    text.includes('closing/hidden') ||
    text.includes('database connection is closing') ||
    text.includes('connection is closing')
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
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
