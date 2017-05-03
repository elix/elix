/*jslint node: true */
'use strict';

const webpack = require('./wpHelper').webpackTask;
const lint = require('./lintHelper');

return webpack()
.then(() => {
  return lint();
})
.then(() => {
  console.log('build complete');
});