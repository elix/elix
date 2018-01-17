const puppeteer = require('puppeteer');
const path = require('path');
const getPort = require('get-port');
const StaticServer = require('static-server');
const runInCi = process.argv.indexOf('--run-in-ci');

const startStaticHttpServer = async () => {
  const server = new StaticServer({
    rootPath: path.join(__dirname, '..'),
    port: await getPort()
  });
  await new Promise((resolve) => {server.start(resolve);});
  return server;
};

const runTestsInHeadlessChrome = async (port) => {

  const options = {
    headless: true,
    args: runInCi ? ['--no-sandbox'] : [],
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
  const server = await startStaticHttpServer();
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