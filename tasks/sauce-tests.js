const saucelabs = require('sauce-test-runner');
const testServer = require('./testServer.js');

const port = 9999;

let reportStatus = 1;

const config = {
  urls: [`localhost:${port}/test/sauce-tests.html`],
  testname: 'Elix tests',
  framework: 'mocha',
  // throttled: 3,
  sauceConfig: {
    'video-upload-on-pass': false
  },
  browsers: [
    {
      browserName: 'chrome',
      platform: 'OS X 10.13'
    },
    {
      browserName: 'chrome',
      platform: 'Windows 10'
    },
    {
      browserName: 'firefox',
      platform: 'OS X 10.13',
    },
    {
      browserName: 'firefox',
      platform: 'Windows 10'
    },
    {
      browserName: 'MicrosoftEdge',
      version: '17',
      platform: 'Windows 10'
    },
    {
      browserName: 'safari',
      platform: 'OS X 10.13',
    }
  ],
  onTestSuiteComplete: (status) => {
    if (status) {
      console.log('All tests passed!');
      reportStatus = 0;
    }
    else {
      console.log('One or more tests failed');
    }
  }
};

async function runTests() {
  try {  
    const server = await testServer(port);
    await saucelabs(config);
    server.close();
    process.exit(reportStatus);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

runTests();
