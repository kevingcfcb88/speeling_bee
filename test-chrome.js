import puppeteer from 'puppeteer';

(async () => {
  // Use headless: false to make sure we use actual Chrome behavior as much as possible
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  try {
    console.log('Navigating to http://localhost:5173');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    
    console.log('Waiting for "Start Game" button');
    await page.waitForSelector('button');
    
    console.log('Clicking "Start Game" button');
    const buttons = await page.$$('button');
    await buttons[buttons.length - 1].click();

    await new Promise(r => setTimeout(r, 1000));
    
    // Attempt to manually trigger speech
    await page.evaluate(() => {
      console.log('Attempting manual speech trigger...');
      const u = new SpeechSynthesisUtterance('test');
      u.onerror = e => console.error('Speech error:', e.error);
      u.onstart = () => console.log('Speech started manually');
      window.speechSynthesis.speak(u);
    });

    await new Promise(r => setTimeout(r, 2000));
    
  } catch (err) {
    console.error('TEST SCRIPT ERROR:', err);
  } finally {
    await browser.close();
  }
})();