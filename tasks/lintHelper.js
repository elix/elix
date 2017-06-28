/*jslint node: true */
'use strict';

const spawn = require('child_process').spawn;
const glob = require('glob');

const lintFiles = [
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
  
  let promise = new Promise((resolve, reject) => {
    console.log('Running jshint over sources...');
    let task = spawn(
      'jshint', 
      args,
      {stdio: 'inherit', shell: true});
      
    task.on('close', code => {
      console.log('...jshint complete');
      return resolve();
    });
  });
  
  return promise;
}

module.exports = runLint;