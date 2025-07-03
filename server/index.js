const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/download', async (req, res) => {
    const { url } = req.body;
    
    if (!url || !url.includes('elements.envato.com')) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid Envato Elements URL' 
        });
    }

    try {
        // Transform the URL
        const transformedUrl = url.replace('elements.envato.com', 'envato-flippa.bestserver.host');

        // Launch Puppeteer and perform the automation
        const result = await automateDownload(transformedUrl);

        res.json({ 
            success: true, 
            transformedUrl,
            message: 'Download completed successfully'
        });
    } catch (error) {
        console.error('Error during automation:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

async function automateDownload(url) {
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

        // Wait for download to complete (you might need to adjust this based on actual behavior)
        await page.waitForTimeout(5000);

        return { success: true };
    } finally {
        await browser.close();
    }
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
