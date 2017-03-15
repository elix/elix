/*jslint node: true */
'use strict';

const gulp = require('gulp');

const webpackTask = require('./gulp/tasks/webpack').webpackTask;
const debugWebpackTask = require('./gulp/tasks/webpack').debugWebpackTask;
const watchifyTask = require('./gulp/tasks/webpack').watchifyTask;
const docsTask = require('./gulp/tasks/docs');
const helpTask = require('./gulp/tasks/help');
const lintTask = require('./gulp/tasks/lint');
const saucetestsTask = require('./gulp/tasks/saucetests').saucetestsTask;
const connectTask = require('./gulp/tasks/saucetests').connectTask;
const disconnectTask = require('./gulp/tasks/saucetests').disconnectTask;

//
// Naming convention for tasks:
// taskName[-taskDependency[-taskDependency-[...]]]
//
// Example:
// lint: Simply runs the lint task
// lint-webpack: Runs the lint task with a dependency on webpack
// lint-docs-webpack: Runs the lint taks with a dependency first on docs,
//    then webpack
//

// Private
gulp.task('webpack', [], webpackTask);
gulp.task('debugWebpack', [], debugWebpackTask);
gulp.task('debugWebpack-webpack', ['webpack'], debugWebpackTask);
gulp.task('docs-debugWebpack-webpack', ['debugWebpack-webpack'], docsTask);
gulp.task('help', [], helpTask);
gulp.task('lint-docs-debugWebpack-webpack', ['docs-debugWebpack-webpack'], lintTask);
gulp.task('lint-debugWebpack-webpack', ['debugWebpack-webpack'], lintTask);
gulp.task('lint-debugWebpack', ['debugWebpack'], lintTask);
gulp.task('connect', [], connectTask);
gulp.task('saucetests-connect', ['connect'], saucetestsTask);
gulp.task('disconnect-saucetests-connect', ['saucetests-connect'], disconnectTask);

// Public
gulp.task('build', ['lint-docs-debugWebpack-webpack']);
gulp.task('devbuild', ['lint-debugWebpack']);
gulp.task('default', ['help']);
gulp.task('docs', [], docsTask);
gulp.task('lint', [], lintTask);
gulp.task('watch', [], watchifyTask);
gulp.task('sauce-tests', ['disconnect-saucetests-connect']);