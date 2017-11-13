/*jslint node: true */
'use strict';

const spawn = require('child_process').spawn;
const glob = require('glob');

const lintFiles = [
  'src/**/*.js',
  'test/**/*.js'
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
    console.log('Running eslint over sources...');
    let task = spawn(
      'eslint', 
      args,
      {stdio: 'inherit', shell: true});
      
    task.on('close', code => {
      console.log('...eslint complete');
      return resolve();
    });
  });
  
  return promise;
}

module.exports = runLint;