/*jslint node: true */
'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const jshint = require('gulp-jshint');

const lintTask = function() {
  const lintFiles = [
        'gulpfile.js',
        'packages/**/*.js',
        '!packages/**/dist/**',
        '!packages/**/lib/**',
        '!packages/**/bower_components/**',
        'test/**/*.js'
    ];
    
  return gulp.src(lintFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
}

module.exports = lintTask;