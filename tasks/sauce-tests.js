/*jslint node: true */
'use strict';

const saucelabs = require('sauce-test-runner');
const StaticServer = require('static-server');

const port = 9999;

let reportStatus = 1;

const config = {
  urls: [`http://127.0.0.1:${port}/test/sauce-tests.html`],
  testname: 'Elix tests',
  framework: 'mocha',
  throttled: 3,
  sauceConfig: {
    'video-upload-on-pass': false
  },
  browsers: [
    {
      browserName: 'chrome',
      platform: 'OS X 10.11'
    },
    {
      browserName: 'chrome',
      platform: 'Windows 10'
    },
    {
      browserName: 'firefox',
      platform: 'OS X 10.11',
    },
    {
      browserName: 'firefox',
      platform: 'Windows 10'
    },
    // {
    //   browserName: 'internet explorer',
    //   platform: 'Windows 8.1',
    //   version: '11.0'
    // },
    {
      browserName: 'MicrosoftEdge',
      version: '14',
      platform: 'Windows 10'
    },
    {
      browserName: 'safari',
      platform: 'OS X 10.12',
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

function runTests() {
  const server = new StaticServer({
    rootPath: '.',
    name: 'elix-sauce-server',
    port: port,
    host: '0.0.0.0'
  });

  server.start(() => {
    saucelabs(config)
    .then(() => {
      server.stop();
      process.exit(reportStatus);
    })
    .catch(error => {
      server.stop();
      process.exit(reportStatus);
    });
  });
}

try {
  runTests();
}
catch(e) {
  process.exit(reportStatus);
}
