import puppeteer, { Browser, Page } from 'puppeteer';
import { DESIGN_CONFIG } from '@/config/design';

class BrowserPool {
  private browser: Browser | null = null;
  private isInitializing = false;
  private initPromise: Promise<Browser> | null = null;

  async getBrowser(): Promise<Browser> {
    if (this.browser && this.browser.isConnected()) {
      return this.browser;
    }

    if (this.isInitializing && this.initPromise) {
      return this.initPromise;
    }

    this.isInitializing = true;
    this.initPromise = this.createBrowser();
    
    try {
      this.browser = await this.initPromise;
      this.isInitializing = false;
      return this.browser;
    } catch (error) {
      this.isInitializing = false;
      this.initPromise = null;
      throw error;
    }
  }

  private async createBrowser(): Promise<Browser> {
    return puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--single-process'
      ],
      timeout: 30000,
    });
  }

  async createPage(): Promise<Page> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    
    await page.setViewport({ 
      width: DESIGN_CONFIG.IMAGE.WIDTH, 
      height: DESIGN_CONFIG.IMAGE.HEIGHT,
      deviceScaleFactor: 1,
    });

    // Set longer timeout for font loading
    await page.setDefaultTimeout(10000);
    
    return page;
  }

  async closePage(page: Page): Promise<void> {
    if (!page.isClosed()) {
      await page.close();
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      return this.browser ? this.browser.isConnected() : false;
    } catch {
      return false;
    }
  }
}

// Singleton instance
const browserPool = new BrowserPool();

// Graceful shutdown
process.on('SIGTERM', async () => {
  await browserPool.close();
});

process.on('SIGINT', async () => {
  await browserPool.close();
});

export { browserPool };