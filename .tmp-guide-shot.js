const puppeteer = require('puppeteer-core');

(async () => {
  const [, , brand = 'clever', variant = 'ltd-new'] = process.argv;
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
  await page.goto(
    `http://localhost:3000/onboarding-guide/sample?brand=${brand}&variant=${variant}`,
    { waitUntil: 'networkidle0' },
  );
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.screenshot({
    path: `C:\\Users\\chris\\CleverAccountsSandbox\\.tmp-guide-${brand}-${variant}.png`,
    fullPage: true,
  });
  await browser.close();
  console.log('shot done', brand, variant);
})();
