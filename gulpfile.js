/*jslint node: true */
'use strict';

const gulp = require('gulp');

const webpackTask = require('./gulp/tasks/webpack').webpackTask;
const watchifyTask = require('./gulp/tasks/webpack').watchifyTask;
const helpTask = require('./gulp/tasks/help');
const lintTask = require('./gulp/tasks/lint');
const saucetestsTask = require('./gulp/tasks/saucetests').saucetestsTask;
const connectTask = require('./gulp/tasks/saucetests').connectTask;
const disconnectTask = require('./gulp/tasks/saucetests').disconnectTask;
const reportTask = require('./gulp/tasks/saucetests').reportTask;

//
// Naming convention for tasks:
// taskName[-taskDependency[-taskDependency-[...]]]
//
// Example:
// lint: Simply runs the lint task
// lint-webpack: Runs the lint task with a dependency on webpack
//

// Private
gulp.task('webpack', [], webpackTask);
gulp.task('help', [], helpTask);
gulp.task('lint-webpack', ['webpack'], lintTask);
gulp.task('connect', [], connectTask);
gulp.task('saucetests-connect', ['connect'], saucetestsTask);
gulp.task('disconnect-saucetests-connect', ['saucetests-connect'], disconnectTask);
gulp.task('report-disconnect-saucetests-connect', ['disconnect-saucetests-connect'], reportTask);

// Public
gulp.task('build', ['lint-webpack']);
gulp.task('default', ['help']);
gulp.task('lint', [], lintTask);
gulp.task('watch', [], watchifyTask);
gulp.task('sauce-tests', ['report-disconnect-saucetests-connect']);