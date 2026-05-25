import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  try {
    console.log('Navigating to http://localhost:5173');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    
    console.log('Waiting for "Start Game" button');
    await page.waitForSelector('button'); // wait for the start button
    
    console.log('Clicking "Start Game" button');
    const buttons = await page.$$('button');
    if (buttons.length > 0) {
      await buttons[buttons.length - 1].click();
      console.log('Clicked!');
    }

    // Wait a bit to see if any errors pop up
    await new Promise(r => setTimeout(r, 2000));
    
    // Check what is on the page
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Page body after click:', bodyText.substring(0, 200).replace(/\n/g, ' '));
    
  } catch (err) {
    console.error('TEST SCRIPT ERROR:', err);
  } finally {
    await browser.close();
  }
})();