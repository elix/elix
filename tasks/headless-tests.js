const puppeteer = require('puppeteer');
const runInCi = process.argv.indexOf('--run-in-ci');
const startStaticWebserver = require('./static-webserver').start;
const path = require('path');

const runTestsInHeadlessChrome = async (port) => {
  const argsNeededForTravisToWork = ['--no-sandbox']; // thx. see https://github.com/GoogleChrome/puppeteer/issues/536#issuecomment-324945531
  const options = {
    headless: true,
    args: runInCi ? argsNeededForTravisToWork : [],
  };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/test/`, {waitUntil: 'domcontentloaded'});
  const consoleMsg = await new Promise((resolve) => {
    page.on('console', (msg) => resolve(msg.text()));
  });
  await browser.close();
  return consoleMsg;
};

(async () => {
  const testFilesDirectory = path.join(__dirname, '..');
  const server = await startStaticWebserver({directory: testFilesDirectory});
  const testResult = await runTestsInHeadlessChrome(server.port);
  if (testResult === 'OK') {
    console.log('Tests passed.');
  } else {
    const errors = JSON.parse(testResult);
    errors.map(e => console.log(e));
    console.error(`\n${errors.length} Error(s)`);
  }
  server.stop();
})();