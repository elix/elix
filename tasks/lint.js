/*jslint node: true */
'use strict';

const spawn = require('child_process').spawn;
const glob = require('glob');

const lintFiles = [
      'gulpfile.js',
      'elements/*.js',
      'mixins/*.js',
      'test/**/*.js',
      'tasks/*.js'
  ];

//
// Runs jshint
//
function runLint() {
  let args = [];
  lintFiles.forEach(item => {
    let globList = glob.sync(item);
    args = args.concat(globList);
  });

  spawn(
    'jshint', 
    args,
    {stdio: 'inherit'});
}

runLint();