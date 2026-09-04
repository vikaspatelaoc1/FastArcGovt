import app, { ensureDatabaseLoaded } from '../server';

export default async function handler(req: any, res: any) {
  try {
    // -------------------------------------------------------------
    // 1. Vercel Request -> Correct URL + Query
    // -------------------------------------------------------------
    let url = req.url || '/';

    // If Vercel rewrote the URL to /api/index, restore original requested route from forwarded headers
    if (url === '/api/index' || url.startsWith('/api/index?') || url === '/api' || url === '/api/') {
      if (req.headers['x-forwarded-uri'] && req.headers['x-forwarded-uri'] !== '/api/index') {
        url = req.headers['x-forwarded-uri'];
      } else if (req.headers['x-now-route-matches']) {
        const matches = String(req.headers['x-now-route-matches']);
        const match = matches.match(/1=([^&]+)/);
        if (match && match[1]) {
          url = `/api/${decodeURIComponent(match[1]).replace(/^\//, '')}`;
        }
      }
    }

    if (!url.startsWith('/api')) {
      url = `/api${url.startsWith('/') ? '' : '/'}${url}`;
    }

    req.url = url;
    req.originalUrl = url;

    // -------------------------------------------------------------
    // 2. Database initialization with Maximum 8 sec wait
    //    Success -> Firestore data
    //    Failure / Timeout -> Default in-memory data
    // -------------------------------------------------------------
    await ensureDatabaseLoaded(8000);

    // -------------------------------------------------------------
    // 3. Express API -> HTTP 200 / Controlled Error
    // -------------------------------------------------------------
    return app(req, res);
  } catch (error: any) {
    console.error('Serverless Handler Error:', error);
    if (!res.headersSent) {
      return res.status(200).json({
        success: false,
        error: error?.message || 'Serverless Processing Error',
        fallback: true
      });
    }
  }
}

export { app, ensureDatabaseLoaded };
