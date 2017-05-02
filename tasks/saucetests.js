/*jslint node: true */
'use strict';

const saucelabs = require('sauce-test-runner');
const connect   = require('gulp-connect');

const port = 9999;

let reportStatus = 0;

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
    {
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11.0'
    },
    {
      browserName: 'MicrosoftEdge',
      platform: 'Windows 10',
    },
    {
      browserName: 'safari',
      platform: 'OS X 10.11',
    }
  ],
  onTestSuiteComplete: (status) => {
    if (status) {
      console.log('All tests passed!');
    }
    else {
      reportStatus = 1;
    }
  }
};

function reportTask() {
  if (reportStatus) {
    return process.exit(reportStatus);
  }
}

function runTests() {
  connect.server({port: port, root: './'});

  saucelabs(config)
  .then(() => {
    connect.serverClose();
    reportTask();
  });
}

runTests();
