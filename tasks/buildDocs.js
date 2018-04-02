/*jslint node: true */
'use strict';

const buildDocs = require('./buildDocsHelper');

buildDocs({
  inputPath: './src',
  outputPath: './build/docs'
});
