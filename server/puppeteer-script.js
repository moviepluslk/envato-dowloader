// This is the standalone version of the Puppeteer script that can be run separately
const puppeteer = require('puppeteer');

async function downloadFromEnvato(url) {
    if (!url || !url.includes('envato-flippa.bestserver.host')) {
        throw new Error('Invalid transformed URL');
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    try {
        // Navigate to the transformed URL
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Click the download button
        await page.waitForSelector('[data-testid="button-download"]', { timeout: 30000 });
        await page.click('[data-testid="button-download"]');

        // Click the download without license button
        await page.waitForSelector('[data-testid="download-without-license-button"]', { timeout: 30000 });
        await page.click('[data-testid="download-without-license-button"]');

        // Wait for download to complete
        await page.waitForTimeout(5000);

        return { success: true };
    } finally {
        await browser.close();
    }
}

module.exports = downloadFromEnvato;
