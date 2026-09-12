import * as cheerio from 'cheerio';
import * as pdfParse from 'pdf-parse';

export interface ScraperOptions {
  timeoutMs?: number;
  maxRetries?: number;
  userAgent?: string;
}

const DEFAULT_OPTIONS: ScraperOptions = {
  timeoutMs: parseInt(process.env.REQUEST_TIMEOUT_MS || '15000', 10),
  maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
  userAgent: process.env.USER_AGENT || 'FastarcGovtBot/1.0 (+https://example.com)',
};

/**
 * Fetch with retry and timeout logic
 */
async function fetchWithRetry(url: string, options: ScraperOptions = {}): Promise<Response> {
  const { timeoutMs, maxRetries, userAgent } = { ...DEFAULT_OPTIONS, ...options };
  
  let attempt = 0;
  while (attempt < (maxRetries || 3)) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': userAgent || 'Mozilla/5.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      });
      clearTimeout(id);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      attempt++;
      if (attempt >= (maxRetries || 3)) {
        throw error;
      }
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  throw new Error('Max retries reached');
}

/**
 * Scrapes HTML from a given URL and returns the loaded Cheerio instance
 */
export async function scrapeHtml(url: string, options: ScraperOptions = {}): Promise<cheerio.CheerioAPI> {
  const response = await fetchWithRetry(url, options);
  const html = await response.text();
  return cheerio.load(html);
}

/**
 * Downloads a PDF and parses its text content using pdf-parse
 */
export async function parsePdfFromUrl(url: string, options: ScraperOptions = {}): Promise<string> {
  const response = await fetchWithRetry(url, options);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  try {
    const data = await (pdfParse as any).default ? await (pdfParse as any).default(buffer) : await (pdfParse as any)(buffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF content');
  }
}
