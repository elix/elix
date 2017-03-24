/*jslint node: true */
'use strict';

const gutil = require('gulp-util');
const saucelabs = require('gulp-saucelabs');
const connect   = require('gulp-connect');

const port = 9999;

let reportStatus = 0;

//
// SauceTests task - runs tests on Sauce Labs
//
function saucetestsTask() {
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
        gutil.log('All tests passed!');
      }
      else {
        reportStatus = 1;
      }
    }
  };

  return saucelabs(config);
}

function connectTask() {
  return connect.server({ port: port, root: './' });
}

function disconnectTask() {
  return connect.serverClose();
}

function reportTask() {
  if (reportStatus) {
    return process.exit(reportStatus);
  }
}

module.exports = {
  saucetestsTask,
  connectTask,
  disconnectTask,
  reportTask
};