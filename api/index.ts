process.env.IS_SERVERLESS = '1';
import app from '../server';

export default function handler(req: any, res: any) {
  // Normalize req.url if Vercel strips the /api prefix during rewrites
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }
  return app(req, res);
}

export { app };

