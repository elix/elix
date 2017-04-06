/*jslint node: true */
'use strict';

const gulp = require('gulp');

const webpackTask = require('./gulp/tasks/webpack').webpackTask;
const debugWebpackTask = require('./gulp/tasks/webpack').debugWebpackTask;
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
gulp.task('debugWebpack', [], debugWebpackTask);
gulp.task('debugWebpack-webpack', ['webpack'], debugWebpackTask);
gulp.task('help', [], helpTask);
gulp.task('lint-debugWebpack-webpack', ['debugWebpack-webpack'], lintTask);
gulp.task('lint-debugWebpack', ['debugWebpack'], lintTask);
gulp.task('connect', [], connectTask);
gulp.task('saucetests-connect', ['connect'], saucetestsTask);
gulp.task('disconnect-saucetests-connect', ['saucetests-connect'], disconnectTask);
gulp.task('report-disconnect-saucetests-connect', ['disconnect-saucetests-connect'], reportTask);

// Public
gulp.task('build', ['lint-debugWebpack-webpack']);
gulp.task('devbuild', ['lint-debugWebpack']);
gulp.task('default', ['help']);
gulp.task('lint', [], lintTask);
gulp.task('watch', [], watchifyTask);
gulp.task('sauce-tests', ['report-disconnect-saucetests-connect']);