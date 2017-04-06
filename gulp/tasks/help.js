/*jslint node: true */
'use strict';

const gutil = require('gulp-util');

//
// Help task - prints to the console the tasks that are available to be run from the command line
//
function helpTask() {
  gutil.log(`gulp commands this project supports:

    gulp build (builds all elements minified and non-minified, docs, and tests)
    gulp devbuild (builds all elements non-minified)
    gulp lint (runs jshint on all .js files)
    gulp watch (builds devbuild and watches changes to project files)
    gulp sauce-tests (runs tests on Sauce Labs)
  `);
  //  gulp npm-publish:package-name|* (publishes elements/element-name or all elements (elements/*) to npm)
  //  gulp set-version:version (updates package.json version values and dependencies. Ex: gulp set-version:1.0.30)
  //  gulp saucelabs (Runs SauceLabs tests. You must set environment variables SAUCE_USERNAME and SAUCE_ACCESS_KEY.)
}

module.exports = helpTask;
