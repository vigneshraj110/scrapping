import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true, 
    });
    const page = await browser.newPage();
    const url = 'https://www.youtube.com/@lonelybeatsmusic';
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('meta[name="title"]', { timeout: 100000 }); 

    // Scrape channel information
    const data = await page.evaluate(() => {
      const channelName = document.querySelector('meta[name="title"]')?.getAttribute('content');
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
      const subscribers = document.querySelector('#subscriber-count')?.textContent;
      const videoTitles = Array.from(document.querySelectorAll('h3.title-and-badge.style-scope.ytd-video-renderer')).map(el => el.textContent?.trim());

      return {
        channelName,
        description,
        subscribers,
        videoTitles,
      };
    });
    console.log(data);
    await browser.close();
  } catch (error) {
    console.error('Error scraping YouTube channel:', error);
  }
})();
