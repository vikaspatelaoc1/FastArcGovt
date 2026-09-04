process.env.IS_SERVERLESS = '1';
import app from '../server';

export default function handler(req: any, res: any) {
  // If Vercel rewrote the URL, recover original requested path from headers
  const forwardedUri = req.headers['x-forwarded-uri'] || req.headers['x-matched-path'] || req.headers['x-now-route-matches'];
  if (forwardedUri && typeof forwardedUri === 'string' && forwardedUri.startsWith('/api')) {
    req.url = forwardedUri;
    req.originalUrl = forwardedUri;
  } else if (req.url && !req.url.startsWith('/api')) {
    const fixedUrl = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
    req.url = fixedUrl;
    req.originalUrl = fixedUrl;
  } else if (req.url) {
    req.originalUrl = req.url;
  }
  return app(req, res);
}

export { app };

