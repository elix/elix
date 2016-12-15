/*jslint node: true */
'use strict';

const gutil = require('gulp-util');

//
// Help task - prints to the console the tasks that are available to be run from the command line
//
function helpTask() {
  gutil.log(`gulp commands this project supports:

    gulp build (builds all elements, docs, and tests)
    gulp devbuild (same as build minus building the documentation)
    gulp docs (builds all elements README.md files)
    gulp lint (runs jshint on all .js files)
    gulp watch (builds and watches changes to project files)
  `);
  //  gulp npm-publish:package-name|* (publishes elements/element-name or all elements (elements/*) to npm)
  //  gulp set-version:version (updates package.json version values and dependencies. Ex: gulp set-version:1.0.30)
  //  gulp saucelabs (Runs SauceLabs tests. You must set environment variables SAUCE_USERNAME and SAUCE_ACCESS_KEY.)
}

module.exports = helpTask;
