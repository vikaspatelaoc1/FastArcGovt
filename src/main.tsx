
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = (event?.reason?.message || String(event?.reason || ''));
    if (reason.includes('WebSocket') || reason.includes('vite') || reason.includes('closed without opened')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

const shouldSuppressClientLog = (...args: any[]) => {
  const text = args.map(a => (typeof a === 'string' ? a : a?.message || String(a || ''))).join(' ');
  return (
    text.includes('@firebase/firestore') ||
    text.includes('Quota limit exceeded') ||
    text.includes('Quota exceeded') ||
    text.includes('Free daily write units') ||
    text.includes('Using maximum backoff delay') ||
    text.includes('[vite] failed to connect to websocket') ||
    text.includes('WebSocket closed without opened')
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
