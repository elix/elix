/*jslint node: true */
'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');

//
// Help task - prints to the console the tasks that are available to be run from the command line
//
const helpTask = function() {
  gutil.log('gulp commands this project supports:');
  gutil.log('  gulp build (builds consolidated elix-components.js, all package distributions, all documentation, and all tests)');
  gutil.log('  gulp devbuild (same as build minus building the documentation)');
  gutil.log('  gulp docs (builds all packages README.md files)');
  gutil.log('  gulp lint (runs jshint on all .js files)');
  gutil.log('  gulp npm-publish:package-name|* (publishes packages/package-name or all packages (packages/*) to npm)');
  gutil.log('  gulp set-version:version (updates package.json version values and dependencies. Ex: gulp set-version:1.0.30)');
  gutil.log('  gulp saucelabs (Runs SauceLabs tests. You must set environment variables SAUCE_USERNAME and SAUCE_ACCESS_KEY.)');
  gutil.log('  gulp watch (builds and watches changes to project files)');
}

module.exports = helpTask;