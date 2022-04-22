import getPort from "get-port";
import puppeteer from "puppeteer";
import testServer from "./testServer.js";

const runInCi = process.argv.indexOf("--run-in-ci");

async function runTestsInHeadlessChrome(port) {
  const argsNeededForTravisToWork = ["--no-sandbox"]; // thx. see https://github.com/GoogleChrome/puppeteer/issues/536#issuecomment-324945531
  const options = {
    headless: true,
    args: runInCi ? argsNeededForTravisToWork : [],
  };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/test/index.html`, {
    waitUntil: "domcontentloaded",
  });
  const consoleMsg = await new Promise((resolve) => {
    page.on("console", (msg) => resolve(msg.text()));
  });
  await browser.close();
  return consoleMsg;
}

const port = await getPort();
const server = await testServer(port);
const testResult = await runTestsInHeadlessChrome(port);
if (testResult === "OK") {
  console.log("Tests passed.");
} else if (testResult.startsWith("[")) {
  const results = JSON.parse(testResult);
  results.forEach((result) => console.log(result));
} else {
  console.log(testResult);
}
server.close();
