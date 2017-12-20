const puppeteer = require('puppeteer');
const assert = require('assert');

const runTest = async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto('http://localhost:12345/test/', {waitUntil: 'domcontentloaded'});
  const consoleMsg = await new Promise((resolve) => {
    page.on('console', async ({text}) => resolve(text));
  });
  await browser.close();
  assert.equal(consoleMsg, 'OK', consoleMsg);
};

runTest()
  .then(() => console.log('Tests passed.'))
  .catch(({message}) => {
    const errors = JSON.parse(message);
    errors.map(e => console.log(e));
    console.error(`\n${errors.length} Error(s)`);
  });
