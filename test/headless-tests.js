const puppeteer = require('puppeteer');
const assert = require('assert');
const path = require('path');
const util = require('util');
const getPort = require('get-port');
const StaticServer = require('static-server');

const startServer = async () => {
  const server = new StaticServer({
    rootPath: path.join(__dirname, '..'),
    port: await getPort()
  });
  await new Promise((resolve) => {server.start(resolve)});
  return server;
};

const runTest = async (port) => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/test/`, {waitUntil: 'domcontentloaded'});
  const consoleMsg = await new Promise((resolve) => {
    page.on('console', async ({text}) => resolve(text));
  });
  await browser.close();
  return consoleMsg;
};

(async () => {
  const server = await startServer();
  const testResult = await runTest(server.port);
  if (testResult === 'OK') {
    console.log('Tests passed.');
  } else {
    const errors = JSON.parse(testResult);
    errors.map(e => console.log(e));
    console.error(`\n${errors.length} Error(s)`);
  }
  server.stop();
})();