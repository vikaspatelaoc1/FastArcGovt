import * as cheerio from 'cheerio';
import { PDFParse } from 'pdf-parse';

export interface ScraperOptions {
  timeoutMs?: number;
  maxRetries?: number;
  userAgent?: string;
}

const DEFAULT_OPTIONS: ScraperOptions = {
  timeoutMs: parseInt(process.env.REQUEST_TIMEOUT_MS || '8000', 10),
  maxRetries: parseInt(process.env.MAX_RETRIES || '1', 10),
  userAgent: process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
};

/**
 * Fetch with retry and timeout logic
 */
async function fetchWithRetry(url: string, options: ScraperOptions = {}): Promise<Response> {
  const { timeoutMs = 8000, maxRetries = 1, userAgent } = { ...DEFAULT_OPTIONS, ...options };
  const effectiveAgent = userAgent || DEFAULT_OPTIONS.userAgent!;

  let attempt = 0;
  while (attempt < maxRetries) {
    let timeoutHandle: NodeJS.Timeout | null = null;
    try {
      const controller = new AbortController();
      timeoutHandle = setTimeout(() => {
        try {
          controller.abort();
        } catch {
          // ignore
        }
      }, timeoutMs);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': effectiveAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
        }
      });
      if (timeoutHandle) clearTimeout(timeoutHandle);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response;
    } catch (error: any) {
      if (timeoutHandle) clearTimeout(timeoutHandle);
      attempt++;
      if (attempt >= maxRetries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  throw new Error('Max retries reached');
}

/**
 * Scrapes HTML from a given URL and returns the loaded Cheerio instance, or null if unreachable
 */
export async function scrapeHtml(url: string, options: ScraperOptions = {}): Promise<cheerio.CheerioAPI | null> {
  try {
    const response = await fetchWithRetry(url, options);
    const html = await response.text();
    return cheerio.load(html);
  } catch {
    return null;
  }
}

/**
 * Downloads a PDF and parses its text content using pdf-parse
 */
export async function parsePdfFromUrl(url: string, options: ScraperOptions = {}): Promise<string> {
  try {
    const response = await fetchWithRetry(url, options);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    if (typeof PDFParse === 'function') {
      try {
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        if (result && typeof result.text === 'string') {
          return result.text;
        }
      } catch {
        const legacyResult = await (PDFParse as any)(buffer);
        return legacyResult?.text || '';
      }
    }
    return '';
  } catch (error) {
    return '';
  }
}
