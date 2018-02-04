const puppeteer = require('puppeteer');
const runInCi = process.argv.indexOf('--run-in-ci');
const startStaticHttpServer = require('./static-webserver').start;

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
    page.on('console', ({text}) => resolve(text));
  });
  await browser.close();
  return consoleMsg;
};

(async () => {
  const server = await startStaticHttpServer({directory: __dirname});
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